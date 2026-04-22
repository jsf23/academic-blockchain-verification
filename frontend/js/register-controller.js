import { isBytes32Hex } from "./hash-service.js";

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

	return {
		status: "failed",
		errorCode: "TRANSACTION_REJECTED",
		message: "No fue posible completar la transacción de registro."
	};
}

function isEthereumAddress(value) {
	return /^0x[a-fA-F0-9]{40}$/.test((value ?? "").trim());
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

		const authorized = await isAuthorizedIssuer(issuerAddress);

		if (!authorized) {
			return {
				status: "failed",
				errorCode: "UNAUTHORIZED",
				message: "La cuenta institucional no está autorizada en este registro."
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
			transactionHash: submission.receipt?.transactionHash ?? "No disponible",
			message: "La huella del certificado se registró correctamente."
		};
	}

	return {
		generateHash,
		submit
	};
}