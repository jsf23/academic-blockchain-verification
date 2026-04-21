import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import solc from "solc";
import Web3 from "web3";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const contractPath = path.join(repoRoot, "contracts", "AcademicIntegrityRegistry.sol");
const artifactsDir = path.join(repoRoot, "artifacts");
const artifactPath = path.join(artifactsDir, "AcademicIntegrityRegistry.json");

function parseAuthorizedIssuers(value) {
	return (value ?? "")
		.split(",")
		.map((entry) => entry.trim())
		.filter(Boolean)
		.map((entry) => Web3.utils.toChecksumAddress(entry));
}

async function compileContract() {
	const source = await fs.readFile(contractPath, "utf8");
	const compilerInput = {
		language: "Solidity",
		sources: {
			"AcademicIntegrityRegistry.sol": {
				content: source
			}
		},
		settings: {
			evmVersion: "paris",
			outputSelection: {
				"*": {
					"*": ["abi", "evm.bytecode"]
				}
			}
		}
	};

	const compilerOutput = JSON.parse(solc.compile(JSON.stringify(compilerInput)));
	const errors = compilerOutput.errors ?? [];
	const fatalErrors = errors.filter((entry) => entry.severity === "error");

	if (fatalErrors.length > 0) {
		throw new Error(fatalErrors.map((entry) => entry.formattedMessage).join("\n"));
	}

	const contract = compilerOutput.contracts["AcademicIntegrityRegistry.sol"].AcademicIntegrityRegistry;
	const artifact = {
		abi: contract.abi,
		bytecode: contract.evm.bytecode.object,
		contractName: "AcademicIntegrityRegistry"
	};

	await fs.mkdir(artifactsDir, { recursive: true });
	await fs.writeFile(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
	return artifact;
}

async function deployContract(artifact) {
	const rpcUrl = process.env.RPC_URL ?? process.env.GANACHE_RPC_URL;
	const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
	const authorizedIssuers = parseAuthorizedIssuers(process.env.AUTHORIZED_ISSUERS);

	if (!rpcUrl) {
		throw new Error("RPC_URL (or GANACHE_RPC_URL) is required to deploy the contract.");
	}

	if (!deployerPrivateKey) {
		throw new Error("DEPLOYER_PRIVATE_KEY is required to deploy the contract.");
	}

	const web3 = new Web3(rpcUrl);
	const account = web3.eth.accounts.privateKeyToAccount(deployerPrivateKey);
	web3.eth.accounts.wallet.add(deployerPrivateKey);

	const deployment = new web3.eth.Contract(artifact.abi).deploy({
		data: `0x${artifact.bytecode}`,
		arguments: [authorizedIssuers]
	});

	const gasEstimate = await deployment.estimateGas({ from: account.address });
	let deploymentTxHash;
	let deploymentReceipt;

	const contract = await deployment
		.send({
			from: account.address,
			gas: Number(gasEstimate) + 250000
		})
		.on("transactionHash", (hash) => {
			deploymentTxHash = hash;
		})
		.on("receipt", (receipt) => {
			deploymentReceipt = receipt;
		});

	const deployedArtifact = {
		...artifact,
		contractAddress: contract.options.address,
		deploymentTxHash: deploymentTxHash ?? null,
		networkId: Number(await web3.eth.getChainId()),
		authorizedIssuers,
		deployedBy: account.address,
		deployedAtBlock:
			deploymentReceipt?.blockNumber !== undefined && deploymentReceipt?.blockNumber !== null
				? Number(deploymentReceipt.blockNumber)
				: null
	};

	await fs.writeFile(artifactPath, `${JSON.stringify(deployedArtifact, null, 2)}\n`, "utf8");
	return deployedArtifact;
}

async function main() {
	const compileOnly = process.argv.includes("--compile-only");
	const artifact = await compileContract();

	if (compileOnly) {
		console.log(`Compiled contract and wrote artifact to ${artifactPath}`);
		return;
	}

	const deployedArtifact = await deployContract(artifact);
	console.log(JSON.stringify({
		contractAddress: deployedArtifact.contractAddress,
		networkId: deployedArtifact.networkId,
		artifactPath
	}, null, 2));
}

main().catch((error) => {
	if (error instanceof Error) {
		console.error(error.stack ?? error.message);
		if ("cause" in error && error.cause) {
			console.error("Cause:", error.cause);
		}
	} else {
		console.error(error);
	}
	process.exit(1);
});