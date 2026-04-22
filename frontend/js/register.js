import { formatUnixTimestamp, getUserMessage } from "./app.js";
import { isAuthorizedIssuer, submitCertificateIssuance } from "./blockchain-service.js";
import { hashFileWithSha256, isBytes32Hex } from "./hash-service.js";

export function mapRegistrationError(error) {
	const message = (error instanceof Error ? error.message : String(error)).toLowerCase();

	if (message.includes("authorized")) {
		return {
			status: "failed",
			errorCode: "UNAUTHORIZED",
			message: "La cuenta institucional no está autorizada para registrar certificados."
		};
	}

	if (message.includes("duplicate") || message.includes("already")) {
		return {
			status: "failed",
			errorCode: "DUPLICATE_HASH",
			message: "Esta huella ya existe en el registro."
		};
	}

	if (message.includes("hash") || message.includes("bytes32") || message.includes("invalid")) {
		return {
			status: "failed",
			errorCode: "INVALID_HASH",
			message: "Se requiere una huella SHA-256 válida."
		};
	}

	if (
		message.includes("missing contract configuration") ||
		message.includes("missing blockchain provider configuration") ||
		message.includes("missing config")
	) {
		return {
			status: "failed",
			errorCode: "CONTRACT_UNAVAILABLE",
			message: "La configuración está incompleta. Verifica contractAddress, ABI y la red en contract-config.json."
		};
	}

	if (message.includes("chain") || message.includes("network") || message.includes("wrong network")) {
		return {
			status: "failed",
			errorCode: "NETWORK_UNAVAILABLE",
			message: "La red de la wallet no coincide con la red configurada del contrato. Cambia de red e inténtalo de nuevo."
		};
	}

	return {
		status: "failed",
		errorCode: "TRANSACTION_REJECTED",
		message: "No fue posible completar el registro. Revisa tu conexión con la wallet o la red e inténtalo de nuevo."
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
				message: "Selecciona un archivo de certificado antes de generar la huella."
			};
		}

		const hash = await hashFile(file);

		if (!isBytes32Hex(hash)) {
			return {
				status: "failed",
				errorCode: "INVALID_HASH",
				message: "La huella generada no tiene un formato bytes32 válido."
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
				message: "Genera una huella SHA-256 válida antes de registrar."
			};
		}

		if (!issuerAddress) {
			return {
				status: "failed",
				errorCode: "WALLET_UNAVAILABLE",
				message: "No hay una cuenta institucional emisora configurada para continuar."
			};
		}

		if (!isEthereumAddress(issuerAddress)) {
			return {
				status: "failed",
				errorCode: "WALLET_UNAVAILABLE",
				message: "La cuenta institucional configurada no tiene un formato de dirección EVM válido."
			};
		}

		try {
			const isAuthorized = await checkAuthorization(issuerAddress);
			if (!isAuthorized) {
				return {
					status: "failed",
					errorCode: "UNAUTHORIZED",
					message: "La cuenta institucional no está autorizada en este registro."
				};
			}
		} catch {
			// pre-check failed (provider issue); let the transaction decide
		}

		const submission = await issueCertificate({ hash, issuerAddress });

		if (submission.status === "failed") {
			return {
				status: "failed",
				errorCode: submission.errorCode,
				message: submission.message,
				rawError: submission.rawError
			};
		}

		const registrationEvent = submission.receipt?.events?.NewRegistration?.returnValues;
		const issuedTimestamp = registrationEvent?.date ?? `${Math.floor(Date.now() / 1000)}`;

		return {
			status: "confirmed",
			certificateHash: registrationEvent?.hash ?? hash,
			issuerAddress: registrationEvent?.issuer ?? issuerAddress,
			issuedAt: formatUnixTimestamp(issuedTimestamp),
			transactionHash: submission.receipt?.transactionHash ?? "No disponible",
			message: getUserMessage("registrationSuccess", "La huella del certificado se registró correctamente.")
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

function applyFloatingNote(element, styleClass, text) {
	if (!element) {
		return;
	}

	element.hidden = false;
	element.classList.remove("floating-note-hidden", "floating-note-info", "floating-note-success", "floating-note-error");
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

function isEthereumAddress(value) {
	return /^0x[a-fA-F0-9]{40}$/.test((value ?? "").trim());
}

function getInstitutionalIssuerAddress() {
	return normalizeIssuerAddress(window.AcademicIntegrityApp?.config?.institutionalIssuerAddress ?? "");
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
	const issuerHint = document.getElementById("institutionalIssuerHint");
	const generateButton = document.getElementById("generateHashButton");
	const copyHashButton = document.getElementById("copyHashButton");
	const preRegistrationNotice = document.getElementById("preRegistrationNotice");
	const statusBox = document.getElementById("registrationStatus");
	const resultBlock = document.getElementById("registrationResult");
	const resultHash = document.getElementById("resultHash");
	const resultIssuer = document.getElementById("resultIssuer");
	const resultDate = document.getElementById("resultDate");
	const resultTx = document.getElementById("resultTx");

	const controller = createRegistrationController();
	const institutionalIssuerAddress = getInstitutionalIssuerAddress();
	const hasInstitutionalIssuer = Boolean(institutionalIssuerAddress);
	const institutionalIssuerIsValid = isEthereumAddress(institutionalIssuerAddress);

	if (issuerInput) {
		issuerInput.value = institutionalIssuerAddress;
		issuerInput.readOnly = true;
	}

	if (!hasInstitutionalIssuer) {
		if (issuerHint) {
			issuerHint.textContent = "No hay cuenta institucional configurada para este entorno.";
		}
		applyFloatingNote(
			preRegistrationNotice,
			"floating-note-error",
			"No hay cuenta institucional configurada. Define institutionalIssuerAddress en contract-config.json para continuar."
		);
	} else if (!institutionalIssuerIsValid) {
		if (issuerHint) {
			issuerHint.textContent = "La cuenta institucional configurada no tiene un formato de dirección EVM válido.";
		}
		applyFloatingNote(
			preRegistrationNotice,
			"floating-note-error",
			"La cuenta institucional configurada es inválida. Debe tener formato 0x + 40 caracteres hexadecimales."
		);
	} else if (issuerHint) {
		issuerHint.textContent = `Cuenta institucional activa: ${institutionalIssuerAddress}`;
	}

	async function handleGenerate() {
		applyFloatingNote(preRegistrationNotice, "floating-note-info", "Generando la huella del certificado...");
		const file = fileInput?.files?.[0];

		try {
			const result = await controller.generateHash(file);

			if (result.status === "failed") {
				applyFloatingNote(preRegistrationNotice, "floating-note-error", result.message);
				return;
			}

			hashInput.value = result.hash;
			applyFloatingNote(preRegistrationNotice, "floating-note-success", getUserMessage("registrationHashReady", "La huella ya fue generada. Ahora puedes registrarla."));
		} catch (error) {
			const mapped = mapRegistrationError(error);
			applyFloatingNote(preRegistrationNotice, "floating-note-error", mapped.message);
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();
		if (!hasInstitutionalIssuer) {
			applyStatus(statusBox, "status-error", "No hay cuenta institucional configurada para registrar.");
			applyFloatingNote(preRegistrationNotice, "floating-note-error", "Configura la cuenta institucional antes de enviar el registro.");
			return;
		}

		if (!institutionalIssuerIsValid) {
			applyStatus(statusBox, "status-error", "La cuenta institucional configurada no tiene un formato válido.");
			applyFloatingNote(preRegistrationNotice, "floating-note-error", "Corrige la dirección institucional con formato 0x + 40 caracteres hexadecimales.");
			return;
		}

		issuerInput.value = institutionalIssuerAddress;
		applyStatus(statusBox, "status-working", getUserMessage("registrationWorking", "Enviando el registro a la blockchain..."));
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
			applyStatus(statusBox, "status-error", "No fue posible completar el registro. Inténtalo de nuevo.");
		}
	}

	async function handleCopyHash() {
		const hash = hashInput?.value?.trim() ?? "";

		if (!hash) {
			applyFloatingNote(preRegistrationNotice, "floating-note-error", "Primero genera la huella antes de intentar copiarla.");
			return;
		}

		try {
			await navigator.clipboard.writeText(hash);
			applyFloatingNote(preRegistrationNotice, "floating-note-success", "La huella fue copiada al portapapeles.");
		} catch {
			applyFloatingNote(preRegistrationNotice, "floating-note-error", "No fue posible copiar la huella automáticamente. Cópiala manualmente.");
		}
	}

	generateButton?.addEventListener("click", handleGenerate);
	copyHashButton?.addEventListener("click", handleCopyHash);
	form?.addEventListener("submit", handleSubmit);
}

wireRegistrationPage();