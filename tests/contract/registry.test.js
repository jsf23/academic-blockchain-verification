import { expect } from "chai";
import ganache from "ganache";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import solc from "solc";
import Web3 from "web3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

async function compileRegistryContract() {
	const source = await fs.readFile(path.join(repoRoot, "contracts", "AcademicIntegrityRegistry.sol"), "utf8");
	const input = {
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

	const output = JSON.parse(solc.compile(JSON.stringify(input)));
	const fatalErrors = (output.errors ?? []).filter((entry) => entry.severity === "error");

	if (fatalErrors.length > 0) {
		throw new Error(fatalErrors.map((entry) => entry.formattedMessage).join("\n"));
	}

	const contract = output.contracts["AcademicIntegrityRegistry.sol"].AcademicIntegrityRegistry;
	return {
		abi: contract.abi,
		bytecode: contract.evm.bytecode.object
	};
}

describe("AcademicIntegrityRegistry (US1)", function () {
	this.timeout(30000);

	let web3;
	let accounts;
	let contract;

	beforeEach(async () => {
		const provider = ganache.provider({ logging: { quiet: true } });
		web3 = new Web3(provider);
		accounts = await web3.eth.getAccounts();

		const { abi, bytecode } = await compileRegistryContract();
		const deployment = new web3.eth.Contract(abi).deploy({
			data: `0x${bytecode}`,
			arguments: [[accounts[1]]]
		});

		contract = await deployment.send({ from: accounts[0], gas: 5000000 });
	});

	it("allows authorized issuer to register a new certificate hash", async () => {
		const hash = web3.utils.sha3("valid-certificate-content");

		const receipt = await contract.methods.issueCertificate(hash).send({
			from: accounts[1],
			gas: 300000
		});

		const result = await contract.methods.verifyCertificate(hash).call();
		expect(Boolean(result.exists)).to.equal(true);
		expect(result.institution.toLowerCase()).to.equal(accounts[1].toLowerCase());
		expect(Boolean(result.isValid)).to.equal(true);
		expect(receipt.events.NewRegistration).to.not.equal(undefined);
	});

	it("rejects certificate registration from unauthorized account", async () => {
		const hash = web3.utils.sha3("unauthorized-certificate-content");

		try {
			await contract.methods.issueCertificate(hash).send({
				from: accounts[2],
				gas: 300000
			});
			throw new Error("Expected transaction to fail");
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			expect(message.toLowerCase()).to.satisfy(
				(value) => value.includes("authorized issuer") || value.includes("revert") || value.includes("reverted")
			);
		}
	});

	it("rejects duplicate registration of the same certificate hash", async () => {
		const hash = web3.utils.sha3("duplicate-certificate-content");

		await contract.methods.issueCertificate(hash).send({
			from: accounts[1],
			gas: 300000
		});

		try {
			await contract.methods.issueCertificate(hash).send({
				from: accounts[1],
				gas: 300000
			});
			throw new Error("Expected duplicate registration to fail");
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			expect(message.toLowerCase()).to.satisfy(
				(value) => value.includes("already registered") || value.includes("revert") || value.includes("reverted")
			);
		}
	});
});

describe("AcademicIntegrityRegistry (US2)", function () {
	this.timeout(30000);

	let web3;
	let accounts;
	let contract;

	beforeEach(async () => {
		const provider = ganache.provider({ logging: { quiet: true } });
		web3 = new Web3(provider);
		accounts = await web3.eth.getAccounts();

		const { abi, bytecode } = await compileRegistryContract();
		const deployment = new web3.eth.Contract(abi).deploy({
			data: `0x${bytecode}`,
			arguments: [[accounts[1]]]
		});

		contract = await deployment.send({ from: accounts[0], gas: 5000000 });
	});

	it("returns certificate data for a registered hash", async () => {
		const hash = web3.utils.sha3("verify-test-certificate");

		await contract.methods.issueCertificate(hash).send({
			from: accounts[1],
			gas: 300000
		});

		const result = await contract.methods.verifyCertificate(hash).call();

		expect(Boolean(result.exists)).to.equal(true);
		expect(result.institution.toLowerCase()).to.equal(accounts[1].toLowerCase());
		expect(Boolean(result.isValid)).to.equal(true);
		expect(Number(result.date)).to.be.greaterThan(0);
	});

	it("returns exists=false for an unregistered hash", async () => {
		const hash = web3.utils.sha3("unknown-certificate-content");

		const result = await contract.methods.verifyCertificate(hash).call();

		expect(Boolean(result.exists)).to.equal(false);
		expect(Number(result.date)).to.equal(0);
		expect(result.institution).to.equal("0x0000000000000000000000000000000000000000");
	});
});