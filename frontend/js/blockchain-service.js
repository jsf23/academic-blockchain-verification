import Web3 from "https://cdn.jsdelivr.net/npm/web3@4.16.0/+esm";

function getRuntimeConfig() {
	return window.AcademicIntegrityApp?.config ?? {
		rpcUrl: "",
		contractAddress: "",
		contractAbi: [],
		relayBaseUrl: "",
		adminRegistrationEnabled: false,
		preferWalletProvider: true,
		institutionalIssuerAddress: ""
	};
}

function isAdministrativeRelayMode() {
	return getRuntimeConfig().adminRegistrationEnabled === true;
}

function getInjectedProvider() {
	if (typeof window === "undefined") {
		return null;
	}

	return window.ethereum ?? null;
}

function shouldUseInjectedProvider() {
	const config = getRuntimeConfig();
	return Boolean(getInjectedProvider()) && config.preferWalletProvider !== false;
}

let cachedWeb3;
let cachedProviderMode;

export function getWeb3Client() {
	const useInjectedProvider = shouldUseInjectedProvider();
	const nextMode = useInjectedProvider ? "injected" : "rpc";

	if (!cachedWeb3 || cachedProviderMode !== nextMode) {
		if (useInjectedProvider) {
			cachedWeb3 = new Web3(getInjectedProvider());
			cachedProviderMode = "injected";
			return cachedWeb3;
		}

		const { rpcUrl } = getRuntimeConfig();

		if (!rpcUrl) {
			throw new Error(window.AcademicIntegrityApp?.messages?.missingConfig ?? "Falta la configuración del proveedor de blockchain.");
		}

		cachedWeb3 = new Web3(rpcUrl);
		cachedProviderMode = "rpc";
	}

	return cachedWeb3;
}

export function getRegistryContract() {
	const web3 = getWeb3Client();
	const { contractAbi, contractAddress } = getRuntimeConfig();

	if (!contractAddress || !Array.isArray(contractAbi) || contractAbi.length === 0) {
		throw new Error(window.AcademicIntegrityApp?.messages?.missingConfig ?? "Falta la configuración del contrato.");
	}

	return new web3.eth.Contract(contractAbi, contractAddress);
}

export async function getConnectionStatus() {
	const web3 = getWeb3Client();
	const chainId = await web3.eth.getChainId();
	return {
		chainId: Number(chainId),
		rpcUrl: getRuntimeConfig().rpcUrl,
		providerMode: cachedProviderMode ?? "unknown"
	};
}

export async function getAvailableAccounts() {
	if (shouldUseInjectedProvider()) {
		const provider = getInjectedProvider();
		const accounts = await provider.request({ method: "eth_requestAccounts" });
		return Array.isArray(accounts) ? accounts : [];
	}

	const web3 = getWeb3Client();
	return web3.eth.getAccounts();
}

export async function isAuthorizedIssuer(address) {
	const contract = getRegistryContract();
	return contract.methods.isAuthorizedIssuer(address).call();
}

export async function verifyCertificate(hash) {
	const contract = getRegistryContract();
	return contract.methods.verifyCertificate(hash).call();
}

export async function issueCertificate(hash, fromAddress) {
	if (isAdministrativeRelayMode()) {
		throw new Error("Administrative relay mode is enabled; browser writes are disabled.");
	}

	if (shouldUseInjectedProvider()) {
		const provider = getInjectedProvider();
		const accounts = await provider.request({ method: "eth_requestAccounts" });
		const normalizedFrom = String(fromAddress ?? "").toLowerCase();
		const authorized = Array.isArray(accounts)
			? accounts.some((account) => String(account).toLowerCase() === normalizedFrom)
			: false;

		if (!authorized) {
			throw new Error("Wallet account not authorized for issuer address (4100).");
		}
	}

	const contract = getRegistryContract();
	const gasEstimate = await contract.methods.issueCertificate(hash).estimateGas({ from: fromAddress });
	return contract.methods.issueCertificate(hash).send({
		from: fromAddress,
		gas: Number(gasEstimate) + 100000
	});
}

export function classifyIssueError(error) {
	const message = (error instanceof Error ? error.message : String(error)).toLowerCase();

	if (message.includes("authorized issuer") || message.includes("not authorized")) {
		return {
			errorCode: "UNAUTHORIZED",
			message: "La cuenta institucional no está autorizada para registrar certificados."
		};
	}

	if (message.includes("already registered") || message.includes("duplicate")) {
		return {
			errorCode: "DUPLICATE_HASH",
			message: "Esta huella del certificado ya existe en el registro."
		};
	}

	if (message.includes("hash is required") || message.includes("invalid")) {
		return {
			errorCode: "INVALID_HASH",
			message: "La huella del certificado no es válida. Genera primero una huella SHA-256 válida."
		};
	}

	if (message.includes("administrative relay mode is enabled")) {
		return {
			errorCode: "RELAY_UNAVAILABLE",
			message: "Este entorno usa relay administrativo. El registro ya no se firma desde la wallet del navegador."
		};
	}

	if (message.includes("denied") || message.includes("rejected")) {
		return {
			errorCode: "TRANSACTION_REJECTED",
			message: "La transacción fue rechazada antes de confirmarse."
		};
	}

	if (message.includes("sender account not recognized") || message.includes("unknown account")) {
		return {
			errorCode: "WALLET_UNAVAILABLE",
			message: "La cuenta institucional configurada no está disponible en el proveedor activo. Cambia a la cuenta institucional en tu wallet o red actual."
		};
	}

	if (message.includes("4100") || message.includes("not been authorized by the user") || message.includes("wallet account not authorized")) {
		return {
			errorCode: "WALLET_UNAVAILABLE",
			message: "La wallet no autorizó la cuenta institucional para este sitio. En MetaMask, conecta la cuenta institucional configurada y vuelve a intentar."
		};
	}

	return {
		errorCode: "TRANSACTION_REJECTED",
		message: "La transacción de registro falló. Inténtalo de nuevo."
	};
}

export async function submitCertificateIssuance({ hash, issuerAddress }) {
	try {
		const receipt = await issueCertificate(hash, issuerAddress);
		return {
			status: "confirmed",
			receipt
		};
	} catch (error) {
		const mapped = classifyIssueError(error);
		const rawMessage = error instanceof Error ? error.message : String(error);
		return {
			status: "failed",
			...mapped,
			rawError: rawMessage
		};
	}
}