import { expect } from "chai";
import { createRegistrationController, mapRegistrationError } from "../../frontend/js/register-controller.js";
import { createVerificationController, mapVerificationResult, isValidHashFormat } from "../../frontend/js/verify-controller.js";

describe("Registration flow helpers (US1)", () => {
	it("maps duplicate transaction errors to DUPLICATE_HASH", () => {
		const result = mapRegistrationError("execution reverted: Certificate already registered");
		expect(result.errorCode).to.equal("DUPLICATE_HASH");
	});

	it("returns INVALID_HASH when no fingerprint is present", async () => {
		const controller = createRegistrationController({
			hashFile: async () => "",
			isAuthorizedIssuer: async () => true,
			issueCertificate: async () => ({}),
			formatTimestamp: () => "Not available"
		});

		const result = await controller.submit({
			issuerAddress: "0x0000000000000000000000000000000000000001",
			hash: ""
		});

		expect(result.status).to.equal("failed");
		expect(result.errorCode).to.equal("INVALID_HASH");
	});

	it("returns confirmation model for successful registration", async () => {
		const controller = createRegistrationController({
			hashFile: async () => "0x" + "a".repeat(64),
			isAuthorizedIssuer: async () => true,
			issueCertificate: async () => ({
				transactionHash: "0x" + "b".repeat(64),
				events: {
					NewRegistration: {
						returnValues: {
							hash: "0x" + "a".repeat(64),
							issuer: "0x0000000000000000000000000000000000000001",
							date: `${Math.floor(Date.now() / 1000)}`
						}
					}
				}
			}),
			formatTimestamp: () => "Apr 18, 2026"
		});

		const result = await controller.submit({
			issuerAddress: "0x0000000000000000000000000000000000000001",
			hash: "0x" + "a".repeat(64)
		});

		expect(result.status).to.equal("confirmed");
		expect(result.certificateHash).to.equal("0x" + "a".repeat(64));
		expect(result.issuerAddress).to.equal("0x0000000000000000000000000000000000000001");
	});
});

describe("Verification flow helpers (US2)", () => {
	const KNOWN_HASH = "0x" + "a".repeat(64);
	const UNKNOWN_HASH = "0x" + "b".repeat(64);

	it("rejects invalid hash format before querying the chain", async () => {
		const controller = createVerificationController({
			verify: async () => { throw new Error("Should not be called"); }
		});

		const result = await controller.submit({ hash: "not-a-valid-hash" });

		expect(result.status).to.equal("error");
		expect(result.errorCode).to.equal("INVALID_HASH_FORMAT");
	});

	it("returns valid status for a registered certificate", async () => {
		const controller = createVerificationController({
			verify: async () => ({
				exists: true,
				institution: "0x0000000000000000000000000000000000000001",
				date: `${Math.floor(Date.now() / 1000)}`,
				isValid: true
			})
		});

		const result = await controller.submit({ hash: KNOWN_HASH });

		expect(result.status).to.equal("valid");
		expect(result.exists).to.equal(true);
		expect(result.issuerAddress).to.equal("0x0000000000000000000000000000000000000001");
	});

	it("returns not-found status for an unregistered hash", async () => {
		const controller = createVerificationController({
			verify: async () => ({
				exists: false,
				institution: "0x0000000000000000000000000000000000000000",
				date: "0",
				isValid: false
			})
		});

		const result = await controller.submit({ hash: UNKNOWN_HASH });

		expect(result.status).to.equal("not-found");
		expect(result.hash).to.equal(UNKNOWN_HASH);
	});

	it("isValidHashFormat accepts proper 0x-prefixed sha256 hash", () => {
		expect(isValidHashFormat("0x" + "c".repeat(64))).to.equal(true);
		expect(isValidHashFormat("invalid")).to.equal(false);
		expect(isValidHashFormat("")).to.equal(false);
	});
});

describe("Usability messaging helpers (US3)", () => {
	it("uses plain-language duplicate registration guidance", () => {
		const result = mapRegistrationError("execution reverted: Certificate already registered");
		expect(result.message.toLowerCase()).to.include("already exists");
		expect(result.message.toLowerCase()).to.not.include("revert");
	});

	it("returns plain-language not-found verification message", () => {
		const result = mapVerificationResult(
			{ exists: false, institution: "0x0000000000000000000000000000000000000000", date: "0", isValid: false },
			"0x" + "d".repeat(64),
			() => "Apr 18, 2026"
		);

		expect(result.status).to.equal("not-found");
		expect(result.message.toLowerCase()).to.include("no authenticity proof");
		expect(result.message.toLowerCase()).to.not.include("bytes32");
	});
});