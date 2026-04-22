import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const artifactPath = path.join(repoRoot, "artifacts", "AcademicIntegrityRegistry.json");
const outputPath = path.join(repoRoot, "frontend", "contract-config.json");

async function tryReadArtifact() {
	try {
		const raw = await fs.readFile(artifactPath, "utf8");
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

function isNonEmpty(value) {
	return typeof value === "string" ? value.trim().length > 0 : value !== undefined && value !== null;
}

function pickPreferredValue(...values) {
	for (const value of values) {
		if (isNonEmpty(value)) {
			return typeof value === "string" ? value.trim() : value;
		}
	}

	return "";
}

function normalizeChainId(value) {
	if (value === undefined || value === null || value === "") {
		return null;
	}

	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

async function main() {
	const artifact = await tryReadArtifact();
	const rpcUrl = pickPreferredValue(process.env.RPC_URL, process.env.GANACHE_RPC_URL, "");
	const chainId = normalizeChainId(process.env.CHAIN_ID ?? artifact?.networkId ?? null);
	const contractAddress = pickPreferredValue(process.env.CONTRACT_ADDRESS, artifact?.contractAddress, "");
	const contractAbi = Array.isArray(artifact?.abi) ? artifact.abi : [];
	const preferWalletProvider = (process.env.PREFER_WALLET_PROVIDER ?? "true").toLowerCase() !== "false";
	const institutionalIssuerAddress = pickPreferredValue(
		process.env.INSTITUTIONAL_ISSUER_ADDRESS,
		process.env.UNIVERSITY_ISSUER_ADDRESS,
		""
	);
	const networkMismatch = chainId !== null && artifact?.networkId !== undefined && Number(artifact.networkId) !== Number(chainId);

	const runtimeConfig = {
		rpcUrl,
		chainId,
		contractAddress,
		contractAbi,
		preferWalletProvider,
		institutionalIssuerAddress
	};

	await fs.writeFile(outputPath, `${JSON.stringify(runtimeConfig, null, 2)}\n`, "utf8");

	console.log(JSON.stringify({
		outputPath,
		chainId,
		contractAddress,
		hasRpcUrl: Boolean(rpcUrl),
		preferWalletProvider,
		hasInstitutionalIssuerAddress: Boolean(institutionalIssuerAddress),
		networkMismatch
	}, null, 2));
}

main().catch((error) => {
	if (error instanceof Error) {
		console.error(error.stack ?? error.message);
	} else {
		console.error(error);
	}
	process.exit(1);
});
