const VALID_HASH_RE = /^0x[0-9a-fA-F]{64}$/;

function defaultFormatTimestamp(ts) {
	return ts ? new Date(Number(ts) * 1000).toLocaleString() : "Not available";
}

export function isValidHashFormat(hash) {
	return VALID_HASH_RE.test((hash ?? "").trim());
}

export function mapVerificationResult(rawResult, hash, formatTimestamp = defaultFormatTimestamp) {
	if (!rawResult.exists) {
		return {
			status: "not-found",
			message: "No authenticity proof exists for this fingerprint in the registry.",
			hash
		};
	}

	return {
		status: "valid",
		exists: true,
		issuerAddress: rawResult.institution,
		issuedAt: formatTimestamp(rawResult.date),
		isValid: Boolean(rawResult.isValid),
		message: "This certificate fingerprint has been verified and is authentic.",
		hash
	};
}

export function classifyVerifyError(error) {
	const message = (error instanceof Error ? error.message : String(error)).toLowerCase();

	if (message.includes("contract") || message.includes("abi") || message.includes("missing config")) {
		return {
			status: "error",
			errorCode: "CONTRACT_UNAVAILABLE",
			message: "The registry contract is not reachable. Make sure your configured network and contract address are correct."
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
			message: "The configured blockchain network is not reachable right now."
		};
	}

	return {
		status: "error",
		errorCode: "CONTRACT_UNAVAILABLE",
		message: "The verification could not be completed. Please try again."
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
				message: "Please enter a valid SHA-256 fingerprint (64 hex characters, starting with 0x)."
			};
		}

		if (typeof verify !== "function") {
			return {
				status: "error",
				errorCode: "CONTRACT_UNAVAILABLE",
				message: "The verification service is not configured."
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
