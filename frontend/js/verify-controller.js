const VALID_HASH_RE = /^0x[0-9a-fA-F]{64}$/;

function defaultFormatTimestamp(ts) {
	return ts ? new Date(Number(ts) * 1000).toLocaleString("es-CO") : "No disponible";
}

export function isValidHashFormat(hash) {
	return VALID_HASH_RE.test((hash ?? "").trim());
}

export function mapVerificationResult(rawResult, hash, formatTimestamp = defaultFormatTimestamp) {
	if (!rawResult.exists) {
		return {
			status: "not-found",
			message: "No existe una prueba de autenticidad para esta huella en el registro.",
			hash
		};
	}

	return {
		status: "valid",
		exists: true,
		issuerAddress: rawResult.institution,
		issuedAt: formatTimestamp(rawResult.date),
		isValid: Boolean(rawResult.isValid),
		message: "La huella de este certificado fue verificada y es auténtica.",
		hash
	};
}

export function classifyVerifyError(error) {
	const message = (error instanceof Error ? error.message : String(error)).toLowerCase();

	if (message.includes("contract") || message.includes("abi") || message.includes("missing config")) {
		return {
			status: "error",
			errorCode: "CONTRACT_UNAVAILABLE",
			message: "No es posible acceder al contrato del registro. Verifica que la red y la dirección del contrato sean correctas."
		};
	}

	if (
		message.includes("network") ||
		message.includes("connection") ||
		message.includes("provider") ||
		message.includes("fetch") ||
		message.includes("econnrefused")
	) {
		return {
			status: "error",
			errorCode: "NETWORK_UNAVAILABLE",
			message: "La red blockchain configurada no está disponible en este momento."
		};
	}

	return {
		status: "error",
		errorCode: "CONTRACT_UNAVAILABLE",
		message: "No fue posible completar la verificación. Inténtalo de nuevo."
	};
}

export function createVerificationController(dependencies) {
	const {
		verify,
		formatTimestamp = defaultFormatTimestamp
	} = dependencies ?? {};

	async function submit({ hash }) {
		const normalized = (hash ?? "").trim();

		if (!isValidHashFormat(normalized)) {
			return {
				status: "error",
				errorCode: "INVALID_HASH_FORMAT",
				message: "Ingresa una huella SHA-256 válida (64 caracteres hexadecimales que comiencen con 0x)."
			};
		}

		if (typeof verify !== "function") {
			return {
				status: "error",
				errorCode: "CONTRACT_UNAVAILABLE",
				message: "El servicio de verificación no está configurado."
			};
		}

		try {
			const rawResult = await verify(normalized);
			return mapVerificationResult(rawResult, normalized, formatTimestamp);
		} catch (error) {
			return classifyVerifyError(error);
		}
	}

	return { submit };
}
