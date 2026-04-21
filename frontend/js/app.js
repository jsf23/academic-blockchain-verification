const DEFAULT_CONFIG = {
	rpcUrl: "http://127.0.0.1:7545",
	chainId: 1337,
	contractAddress: "",
	contractAbi: []
};

const DEFAULT_MESSAGES = {
	missingConfig: "The blockchain connection is not configured yet.",
	networkUnavailable: "The local blockchain is not reachable right now.",
	walletUnavailable: "No issuer wallet is connected yet.",
	verificationMissing: "No certificate proof exists for that hash.",
	technicalFallback: "Something went wrong. Please try again in a moment.",
	registrationSuccess: "Certificate fingerprint was registered successfully.",
	registrationWorking: "Submitting registration to the blockchain...",
	registrationHashReady: "Fingerprint generated. You can register it now.",
	verificationWorking: "Checking the registry... this may take a few seconds.",
	verificationValid: "Certificate found - authenticity confirmed.",
	verificationNotFound: "No record found for this fingerprint.",
	invalidHashFormat: "Enter a valid SHA-256 fingerprint (64 hex characters starting with 0x)."
};

async function loadRuntimeConfig() {
	try {
		const response = await fetch("./contract-config.json", { cache: "no-store" });

		if (!response.ok) {
			return { ...DEFAULT_CONFIG };
		}

		const remoteConfig = await response.json();
		return { ...DEFAULT_CONFIG, ...remoteConfig };
	} catch {
		return { ...DEFAULT_CONFIG };
	}
}

function humanizeError(error) {
	if (!error) {
		return DEFAULT_MESSAGES.technicalFallback;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return String(error);
}

function formatUnixTimestamp(timestamp) {
	if (!timestamp) {
		return "Not available";
	}

	return new Intl.DateTimeFormat("en", {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(new Date(Number(timestamp) * 1000));
}

function getUserMessage(key, fallback = DEFAULT_MESSAGES.technicalFallback) {
	return window.AcademicIntegrityApp?.messages?.[key] ?? fallback;
}

window.AcademicIntegrityApp = {
	config: await loadRuntimeConfig(),
	messages: { ...DEFAULT_MESSAGES },
	humanizeError,
	formatUnixTimestamp,
	getUserMessage
};

export { DEFAULT_CONFIG, DEFAULT_MESSAGES, formatUnixTimestamp, getUserMessage, humanizeError, loadRuntimeConfig };