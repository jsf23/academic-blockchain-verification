import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolvePublicRuntimeConfig, validatePublicRuntimeConfig } from "./public-deploy-config.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const frontendDir = path.join(repoRoot, "frontend");
const artifactPath = path.join(repoRoot, "artifacts", "AcademicIntegrityRegistry.json");

async function main() {
	const { config, hasExistingConfig, configPath } = await resolvePublicRuntimeConfig({ frontendDir, artifactPath });
	const issues = validatePublicRuntimeConfig(config);

	if (issues.length > 0) {
		throw new Error(`Public deployment config is invalid:\n- ${issues.join("\n- ")}`);
	}

	console.log(JSON.stringify({
		configPath,
		hasExistingConfig,
		contractAddress: config.contractAddress,
		chainId: config.chainId,
		hasAbi: Array.isArray(config.contractAbi) && config.contractAbi.length > 0,
		preferWalletProvider: config.preferWalletProvider
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