import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolvePublicRuntimeConfig, validatePublicRuntimeConfig } from "./public-deploy-config.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const frontendDir = path.join(repoRoot, "frontend");
const artifactPath = path.join(repoRoot, "artifacts", "AcademicIntegrityRegistry.json");
const outputDir = path.join(repoRoot, "dist", "pages");

async function copyDirectory(sourceDir, destinationDir) {
	await fs.mkdir(destinationDir, { recursive: true });
	const entries = await fs.readdir(sourceDir, { withFileTypes: true });

	for (const entry of entries) {
		const sourcePath = path.join(sourceDir, entry.name);
		const destinationPath = path.join(destinationDir, entry.name);

		if (entry.isDirectory()) {
			await copyDirectory(sourcePath, destinationPath);
			continue;
		}

		if (entry.isFile()) {
			await fs.copyFile(sourcePath, destinationPath);
		}
	}
}

async function emptyDirectory(targetDir) {
	await fs.rm(targetDir, { recursive: true, force: true });
	await fs.mkdir(targetDir, { recursive: true });
}

async function main() {
	const { config, hasExistingConfig } = await resolvePublicRuntimeConfig({ frontendDir, artifactPath });
	const issues = validatePublicRuntimeConfig(config);

	if (issues.length > 0) {
		throw new Error(`Public deployment config is invalid:\n- ${issues.join("\n- ")}`);
	}

	await emptyDirectory(outputDir);
	await copyDirectory(frontendDir, outputDir);
	await fs.writeFile(path.join(outputDir, "contract-config.json"), `${JSON.stringify(config, null, 2)}\n`, "utf8");

	console.log(JSON.stringify({
		outputDir,
		hasExistingConfig,
		filesCopiedFrom: frontendDir,
		contractAddress: config.contractAddress,
		chainId: config.chainId
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