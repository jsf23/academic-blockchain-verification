import { createVerificationController } from "./verify-controller.js";
import { formatUnixTimestamp, getUserMessage } from "./app.js";
import { verifyCertificate } from "./blockchain-service.js";

function applyStatus(element, styleClass, text) {
	if (!element) {
		return;
	}

	element.classList.remove("status-idle", "status-working", "status-success", "status-error");
	element.classList.add(styleClass);
	element.textContent = text;
}

function hideAllResults(valid, notFound, error) {
	valid.hidden = true;
	notFound.hidden = true;
	error.hidden = true;
}

function wireVerificationPage() {
	if (typeof document === "undefined") {
		return;
	}

	const page = document.body?.dataset?.page;

	if (page !== "verify") {
		return;
	}

	const form = document.getElementById("verifyForm");
	const hashInput = document.getElementById("certificateHash");
	const verifyButton = document.getElementById("verifyButton");
	const statusBox = document.getElementById("verifyStatus");
	const resultValid = document.getElementById("verifyResultValid");
	const resultNotFound = document.getElementById("verifyResultNotFound");
	const resultError = document.getElementById("verifyResultError");

	const resultHash = document.getElementById("resultHash");
	const resultIssuer = document.getElementById("resultIssuer");
	const resultDate = document.getElementById("resultDate");
	const resultValidity = document.getElementById("resultValidity");
	const notFoundMessage = document.getElementById("verifyNotFoundMessage");
	const errorMessage = document.getElementById("verifyErrorMessage");

	const controller = createVerificationController({
		verify: verifyCertificate,
		formatTimestamp: formatUnixTimestamp
	});

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const hash = (hashInput.value ?? "").trim();

		hideAllResults(resultValid, resultNotFound, resultError);
		applyStatus(statusBox, "status-working", getUserMessage("verificationWorking", "Checking the registry... this may take a few seconds."));
		verifyButton.disabled = true;

		try {
			const result = await controller.submit({ hash });

			if (result.status === "valid") {
				applyStatus(statusBox, "status-success", getUserMessage("verificationValid", "Certificate found - authenticity confirmed."));

				resultHash.textContent = result.hash ?? "\u2014";
				resultIssuer.textContent = result.issuerAddress ?? "\u2014";
				resultDate.textContent = result.issuedAt ?? "\u2014";
				resultValidity.textContent = result.isValid ? "Valid" : "Revoked";

				resultValid.hidden = false;
			} else if (result.status === "not-found") {
				applyStatus(statusBox, "status-error", getUserMessage("verificationNotFound", "No record found for this fingerprint."));
				notFoundMessage.textContent = result.message;
				resultNotFound.hidden = false;
			} else {
				applyStatus(statusBox, "status-error", result.message);
				errorMessage.textContent = result.message;
				resultError.hidden = false;
			}
		} catch (unexpectedError) {
			applyStatus(statusBox, "status-error", "An unexpected error occurred. Please try again.");
			errorMessage.textContent = "Verification could not be completed. Please check your connection and try again.";
			resultError.hidden = false;
		} finally {
			verifyButton.disabled = false;
		}
	});
}

wireVerificationPage();
