import { isBytes32Hex } from "./hash-service.js";

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
		message: "The registration transaction could not be completed."
	};
}

export function createRegistrationController(dependencies) {
	const {
		hashFile,
		isAuthorizedIssuer,
		issueCertificate,
		formatTimestamp
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

		const authorized = await isAuthorizedIssuer(issuerAddress);

		if (!authorized) {
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
			issuedAt: formatTimestamp(issuedTimestamp),
			transactionHash: submission.receipt?.transactionHash ?? "Not available",
			message: "Certificate fingerprint was registered successfully."
		};
	}

	return {
		generateHash,
		submit
	};
}