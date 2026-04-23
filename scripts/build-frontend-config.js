import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolvePublicRuntimeConfig } from "./public-deploy-config.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const artifactPath = path.join(repoRoot, "artifacts", "AcademicIntegrityRegistry.json");
const frontendDir = path.join(repoRoot, "frontend");
const outputPath = path.join(repoRoot, "frontend", "contract-config.json");

async function main() {
	const { config: runtimeConfig } = await resolvePublicRuntimeConfig({ frontendDir, artifactPath });

	await fs.writeFile(outputPath, `${JSON.stringify(runtimeConfig, null, 2)}\n`, "utf8");

	console.log(JSON.stringify({
		outputPath,
		chainId: runtimeConfig.chainId,
		contractAddress: runtimeConfig.contractAddress,
		hasRpcUrl: Boolean(runtimeConfig.rpcUrl),
		hasRelayBaseUrl: Boolean(runtimeConfig.relayBaseUrl),
		adminRegistrationEnabled: runtimeConfig.adminRegistrationEnabled,
		preferWalletProvider: runtimeConfig.preferWalletProvider,
		hasInstitutionalIssuerAddress: Boolean(runtimeConfig.institutionalIssuerAddress)
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
