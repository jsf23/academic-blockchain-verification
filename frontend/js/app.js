const DEFAULT_CONFIG = {
	rpcUrl: "",
	chainId: null,
	contractAddress: "",
	contractAbi: [],
	preferWalletProvider: true,
	institutionalIssuerAddress: ""
};

const DEFAULT_MESSAGES = {
	missingConfig: "La conexión con blockchain aún no está configurada.",
	networkUnavailable: "La blockchain local no está disponible en este momento.",
	walletUnavailable: "Aún no hay una wallet emisora conectada.",
	verificationMissing: "No existe una prueba del certificado para ese hash.",
	technicalFallback: "Ocurrió un problema. Inténtalo de nuevo en un momento.",
	registrationSuccess: "La huella del certificado se registró correctamente.",
	registrationWorking: "Enviando el registro a la blockchain...",
	registrationHashReady: "La huella ya fue generada. Ahora puedes registrarla.",
	verificationWorking: "Consultando el registro... esto puede tardar unos segundos.",
	verificationValid: "Certificado encontrado: autenticidad confirmada.",
	verificationNotFound: "No se encontró un registro para esta huella.",
	invalidHashFormat: "Ingresa una huella SHA-256 válida (64 caracteres hexadecimales que comiencen con 0x)."
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
		return "No disponible";
	}

	return new Intl.DateTimeFormat("es-CO", {
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