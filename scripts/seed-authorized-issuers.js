import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Web3 from "web3";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const artifactPath = path.join(repoRoot, "artifacts", "AcademicIntegrityRegistry.json");

function parseAuthorizedIssuers(value) {
	return (value ?? "")
		.split(",")
		.map((entry) => entry.trim())
		.filter(Boolean)
		.map((entry) => Web3.utils.toChecksumAddress(entry));
}

async function loadArtifact() {
	const content = await fs.readFile(artifactPath, "utf8");
	return JSON.parse(content);
}

async function main() {
	const rpcUrl = process.env.RPC_URL ?? process.env.GANACHE_RPC_URL;
	const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
	const authorizedIssuers = parseAuthorizedIssuers(process.env.AUTHORIZED_ISSUERS);

	if (!rpcUrl || !deployerPrivateKey) {
		throw new Error("RPC_URL (or GANACHE_RPC_URL) and DEPLOYER_PRIVATE_KEY are required.");
	}

	const artifact = await loadArtifact();

	if (!artifact.contractAddress) {
		throw new Error("Contract artifact does not include a deployed contractAddress.");
	}

	const web3 = new Web3(rpcUrl);
	const account = web3.eth.accounts.privateKeyToAccount(deployerPrivateKey);
	web3.eth.accounts.wallet.add(deployerPrivateKey);

	const contract = new web3.eth.Contract(artifact.abi, artifact.contractAddress);

	for (const issuer of authorizedIssuers) {
		const alreadyAuthorized = await contract.methods.isAuthorizedIssuer(issuer).call();

		if (alreadyAuthorized) {
			continue;
		}

		const gasEstimate = await contract.methods.authorizeIssuer(issuer).estimateGas({ from: account.address });
		await contract.methods.authorizeIssuer(issuer).send({
			from: account.address,
			gas: Number(gasEstimate) + 100000
		});
	}

	console.log(JSON.stringify({
		contractAddress: artifact.contractAddress,
		authorizedIssuers
	}, null, 2));
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});