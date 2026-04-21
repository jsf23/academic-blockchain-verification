import Web3 from "https://cdn.jsdelivr.net/npm/web3@4.16.0/+esm";

function getRuntimeConfig() {
	return window.AcademicIntegrityApp?.config ?? {
		rpcUrl: "",
		contractAddress: "",
		contractAbi: [],
		preferWalletProvider: true
	};
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
			throw new Error(window.AcademicIntegrityApp?.messages?.missingConfig ?? "Missing blockchain provider configuration.");
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
		throw new Error(window.AcademicIntegrityApp?.messages?.missingConfig ?? "Missing contract configuration.");
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
			message: "This wallet is not authorized to register certificates."
		};
	}

	if (message.includes("already registered") || message.includes("duplicate")) {
		return {
			errorCode: "DUPLICATE_HASH",
			message: "This certificate hash already exists in the registry."
		};
	}

	if (message.includes("hash is required") || message.includes("invalid")) {
		return {
			errorCode: "INVALID_HASH",
			message: "The certificate hash is invalid. Generate a valid SHA-256 fingerprint first."
		};
	}

	if (message.includes("denied") || message.includes("rejected")) {
		return {
			errorCode: "TRANSACTION_REJECTED",
			message: "The transaction was rejected before confirmation."
		};
	}

	if (message.includes("sender account not recognized") || message.includes("unknown account")) {
		return {
			errorCode: "WALLET_UNAVAILABLE",
			message: "The issuer address is not available in the active provider. Connect and use an account from your current wallet/network."
		};
	}

	return {
		errorCode: "TRANSACTION_REJECTED",
		message: "The registration transaction failed. Please try again."
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