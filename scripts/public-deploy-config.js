import fs from "node:fs/promises";
import path from "node:path";

export function isNonEmpty(value) {
	return typeof value === "string" ? value.trim().length > 0 : value !== undefined && value !== null;
}

export function pickPreferredValue(...values) {
	for (const value of values) {
		if (isNonEmpty(value)) {
			return typeof value === "string" ? value.trim() : value;
		}
	}

	return "";
}

export function normalizeChainId(value) {
	if (value === undefined || value === null || value === "") {
		return null;
	}

	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

export async function fileExists(targetPath) {
	try {
		await fs.access(targetPath);
		return true;
	} catch {
		return false;
	}
}

export async function readJsonIfExists(filePath) {
	if (!(await fileExists(filePath))) {
		return null;
	}

	const raw = await fs.readFile(filePath, "utf8");
	return JSON.parse(raw);
}

export function parseAbiJson(value) {
	if (!isNonEmpty(value)) {
		return [];
	}

	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function buildPublicRuntimeConfig({ environment = process.env, artifact = null, existingConfig = null } = {}) {
	const rpcUrl = pickPreferredValue(
		environment.PUBLIC_RPC_URL,
		environment.RPC_URL,
		existingConfig?.rpcUrl,
		""
	);
	const chainId = normalizeChainId(
		pickPreferredValue(
			environment.PUBLIC_CHAIN_ID,
			environment.CHAIN_ID,
			existingConfig?.chainId,
			artifact?.networkId,
			null
		)
	);
	const contractAddress = pickPreferredValue(
		environment.PUBLIC_CONTRACT_ADDRESS,
		environment.CONTRACT_ADDRESS,
		existingConfig?.contractAddress,
		artifact?.contractAddress,
		""
	);
	const contractAbi = (() => {
		const abiFromEnv = parseAbiJson(environment.PUBLIC_CONTRACT_ABI_JSON ?? environment.CONTRACT_ABI_JSON ?? "");

		if (abiFromEnv.length > 0) {
			return abiFromEnv;
		}

		if (Array.isArray(existingConfig?.contractAbi) && existingConfig.contractAbi.length > 0) {
			return existingConfig.contractAbi;
		}

		if (Array.isArray(artifact?.abi) && artifact.abi.length > 0) {
			return artifact.abi;
		}

		return [];
	})();
	const institutionalIssuerAddress = pickPreferredValue(
		environment.PUBLIC_INSTITUTIONAL_ISSUER_ADDRESS,
		environment.INSTITUTIONAL_ISSUER_ADDRESS,
		environment.UNIVERSITY_ISSUER_ADDRESS,
		existingConfig?.institutionalIssuerAddress,
		""
	);
	const preferWalletProvider = (() => {
		const raw = pickPreferredValue(
			environment.PUBLIC_PREFER_WALLET_PROVIDER,
			environment.PREFER_WALLET_PROVIDER,
			existingConfig?.preferWalletProvider,
			"true"
		);

		if (typeof raw === "boolean") {
			return raw;
		}

		return String(raw).toLowerCase() !== "false";
	})();

	return {
		rpcUrl,
		chainId,
		contractAddress,
		institutionalIssuerAddress,
		contractAbi,
		preferWalletProvider
	};
}

export function validatePublicRuntimeConfig(config) {
	const issues = [];

	if (!isNonEmpty(config?.rpcUrl)) {
		issues.push("rpcUrl is required for the public deployment config.");
	}

	if (!Number.isInteger(Number(config?.chainId))) {
		issues.push("chainId must be a valid integer for the public deployment config.");
	}

	if (!/^0x[a-fA-F0-9]{40}$/.test(config?.contractAddress ?? "")) {
		issues.push("contractAddress must be a valid EVM address.");
	}

	if (!/^0x[a-fA-F0-9]{40}$/.test(config?.institutionalIssuerAddress ?? "")) {
		issues.push("institutionalIssuerAddress must be a valid EVM address.");
	}

	if (!Array.isArray(config?.contractAbi) || config.contractAbi.length === 0) {
		issues.push("contractAbi must be a non-empty ABI array.");
	}

	if (typeof config?.preferWalletProvider !== "boolean") {
		issues.push("preferWalletProvider must be a boolean value.");
	}

	return issues;
}

export async function resolvePublicRuntimeConfig({ frontendDir, artifactPath, environment = process.env } = {}) {
	const configPath = path.join(frontendDir, "contract-config.json");
	const existingConfig = await readJsonIfExists(configPath);
	const artifact = await readJsonIfExists(artifactPath);
	const config = buildPublicRuntimeConfig({ environment, artifact, existingConfig });

	return {
		config,
		configPath,
		hasExistingConfig: Boolean(existingConfig)
	};
}