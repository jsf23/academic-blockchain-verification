import { formatUnixTimestamp, getUserMessage } from "./app.js";
import { getAvailableAccounts, isAuthorizedIssuer, submitCertificateIssuance } from "./blockchain-service.js";
import { hashFileWithSha256, isBytes32Hex } from "./hash-service.js";

export function mapRegistrationError(error) {
	const message = (error instanceof Error ? error.message : String(error)).toLowerCase();

	if (message.includes("authorized")) {
		return {
			status: "failed",
			errorCode: "UNAUTHORIZED",
			message: "The selected wallet is not authorized to register certificates."
		};
	}

	if (message.includes("duplicate") || message.includes("already")) {
		return {
			status: "failed",
			errorCode: "DUPLICATE_HASH",
			message: "This fingerprint already exists in the registry."
		};
	}

	if (message.includes("hash") || message.includes("bytes32") || message.includes("invalid")) {
		return {
			status: "failed",
			errorCode: "INVALID_HASH",
			message: "A valid SHA-256 fingerprint is required."
		};
	}

	return {
		status: "failed",
		errorCode: "TRANSACTION_REJECTED",
		message: "We could not complete the registration. Please check Ganache and try again."
	};
}

export function createRegistrationController(dependencies) {
	const {
		hashFile = hashFileWithSha256,
		checkAuthorization = dependencies?.isAuthorizedIssuer ?? isAuthorizedIssuer,
		issueCertificate = submitCertificateIssuance
	} = dependencies ?? {};

	async function generateHash(file) {
		if (!file) {
			return {
				status: "failed",
				errorCode: "INVALID_HASH",
				message: "Select a certificate file before generating the fingerprint."
			};
		}

		const hash = await hashFile(file);

		if (!isBytes32Hex(hash)) {
			return {
				status: "failed",
				errorCode: "INVALID_HASH",
				message: "The generated fingerprint is not valid bytes32 format."
			};
		}

		return {
			status: "ready",
			hash
		};
	}

	async function submit({ issuerAddress, hash }) {
		if (!hash || !isBytes32Hex(hash)) {
			return {
				status: "failed",
				errorCode: "INVALID_HASH",
				message: "Generate a valid SHA-256 fingerprint before registration."
			};
		}

		if (!issuerAddress) {
			return {
				status: "failed",
				errorCode: "WALLET_UNAVAILABLE",
				message: "Provide an issuer wallet address to continue."
			};
		}

		const isAuthorized = await checkAuthorization(issuerAddress);

		if (!isAuthorized) {
			return {
				status: "failed",
				errorCode: "UNAUTHORIZED",
				message: "The issuer wallet is not authorized in this registry."
			};
		}

		const submission = await issueCertificate({ hash, issuerAddress });

		if (submission.status === "failed") {
			return {
				status: "failed",
				errorCode: submission.errorCode,
				message: submission.message
			};
		}

		const registrationEvent = submission.receipt?.events?.NewRegistration?.returnValues;
		const issuedTimestamp = registrationEvent?.date ?? `${Math.floor(Date.now() / 1000)}`;

		return {
			status: "confirmed",
			certificateHash: registrationEvent?.hash ?? hash,
			issuerAddress: registrationEvent?.issuer ?? issuerAddress,
			issuedAt: formatUnixTimestamp(issuedTimestamp),
			transactionHash: submission.receipt?.transactionHash ?? "Not available",
			message: getUserMessage("registrationSuccess", "Certificate fingerprint was registered successfully.")
		};
	}

	return {
		generateHash,
		submit
	};
}

function applyStatus(element, styleClass, text) {
	if (!element) {
		return;
	}

	element.classList.remove("status-idle", "status-working", "status-success", "status-error");
	element.classList.add(styleClass);
	element.textContent = text;
}

function normalizeIssuerAddress(value) {
	const compact = (value ?? "").trim().replace(/[\s,;]+/g, "");

	if (!compact) {
		return "";
	}

	if (compact.startsWith("0x")) {
		return `0x${compact.slice(2).replace(/[^a-fA-F0-9]/g, "")}`;
	}

	return `0x${compact.replace(/[^a-fA-F0-9]/g, "")}`;
}

function wireRegistrationPage() {
	if (typeof document === "undefined") {
		return;
	}

	const page = document.body?.dataset?.page;

	if (page !== "register") {
		return;
	}

	const form = document.getElementById("registrationForm");
	const fileInput = document.getElementById("certificateFile");
	const hashInput = document.getElementById("certificateHash");
	const issuerInput = document.getElementById("issuerAddress");
	const loadAccountsButton = document.getElementById("loadAccountsButton");
	const accountsSelect = document.getElementById("ganacheAccounts");
	const generateButton = document.getElementById("generateHashButton");
	const statusBox = document.getElementById("registrationStatus");
	const resultBlock = document.getElementById("registrationResult");
	const resultHash = document.getElementById("resultHash");
	const resultIssuer = document.getElementById("resultIssuer");
	const resultDate = document.getElementById("resultDate");
	const resultTx = document.getElementById("resultTx");

	const controller = createRegistrationController();

	async function handleLoadAccounts() {
		applyStatus(statusBox, "status-working", "Loading active Ganache accounts...");

		try {
			const accounts = await getAvailableAccounts();
			accountsSelect.innerHTML = "";
			const placeholder = document.createElement("option");
			placeholder.value = "";
			placeholder.textContent = "Select an active Ganache account...";
			accountsSelect.appendChild(placeholder);

			for (const account of accounts) {
				const option = document.createElement("option");
				option.value = account;
				option.textContent = account;
				accountsSelect.appendChild(option);
			}

			if (accounts.length === 0) {
				applyStatus(statusBox, "status-error", "No active accounts found in the current Ganache workspace.");
				return;
			}

			applyStatus(statusBox, "status-success", "Ganache accounts loaded. Select one to fill issuer automatically.");
		} catch (error) {
			const mapped = mapRegistrationError(error);
			applyStatus(statusBox, "status-error", mapped.message);
		}
	}

	async function handleGenerate() {
		applyStatus(statusBox, "status-working", "Creating the certificate fingerprint...");
		const file = fileInput?.files?.[0];

		try {
			const result = await controller.generateHash(file);

			if (result.status === "failed") {
				applyStatus(statusBox, "status-error", result.message);
				return;
			}

			hashInput.value = result.hash;
			applyStatus(statusBox, "status-success", getUserMessage("registrationHashReady", "Fingerprint generated. You can register it now."));
		} catch (error) {
			const mapped = mapRegistrationError(error);
			applyStatus(statusBox, "status-error", mapped.message);
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();
		issuerInput.value = normalizeIssuerAddress(issuerInput?.value ?? "");
		applyStatus(statusBox, "status-working", getUserMessage("registrationWorking", "Submitting registration to the blockchain..."));
		resultBlock.hidden = true;

		try {
			const result = await controller.submit({
				issuerAddress: issuerInput?.value?.trim() ?? "",
				hash: hashInput?.value?.trim() ?? ""
			});

			if (result.status !== "confirmed") {
				applyStatus(statusBox, "status-error", result.message);
				return;
			}

			resultHash.textContent = result.certificateHash;
			resultIssuer.textContent = result.issuerAddress;
			resultDate.textContent = result.issuedAt;
			resultTx.textContent = result.transactionHash;
			resultBlock.hidden = false;
			applyStatus(statusBox, "status-success", result.message);
		} catch (error) {
			const mapped = mapRegistrationError(error);
			applyStatus(statusBox, "status-error", mapped.message);
		}
	}

	function handleAccountSelection() {
		const selected = accountsSelect?.value ?? "";

		if (!selected) {
			return;
		}

		issuerInput.value = selected;
		applyStatus(statusBox, "status-success", "Issuer field filled from active Ganache account.");
	}

	loadAccountsButton?.addEventListener("click", handleLoadAccounts);
	accountsSelect?.addEventListener("change", handleAccountSelection);
	generateButton?.addEventListener("click", handleGenerate);
	form?.addEventListener("submit", handleSubmit);
}

wireRegistrationPage();