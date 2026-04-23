import { formatUnixTimestamp, getUserMessage } from "./app.js";
import { createRegistrationController, mapRegistrationError } from "./register-controller.js";

function applyStatus(element, styleClass, text) {
	if (!element) {
		return;
	}

	element.classList.remove("status-idle", "status-working", "status-success", "status-error");
	element.classList.add(styleClass);
	element.textContent = text;
}

function applyFloatingNote(element, styleClass, text) {
	if (!element) {
		return;
	}

	element.hidden = false;
	element.classList.remove("floating-note-hidden", "floating-note-info", "floating-note-success", "floating-note-error");
	element.classList.add(styleClass);
	element.textContent = text;
}

function normalizeIssuerAddress(value) {
	const compact = (value ?? "").trim().replace(/[\s,;]+/g, "");

	if (!compact) {
		return "";
	}

	if (compact.startsWith("0x")) {
		return `0x${compact.slice(2).replace(/[^a-fA-F0-9]/g, "")}`;
	}

	return `0x${compact.replace(/[^a-fA-F0-9]/g, "")}`;
}

function isEthereumAddress(value) {
	return /^0x[a-fA-F0-9]{40}$/.test((value ?? "").trim());
}

function getInstitutionalIssuerAddress() {
	return normalizeIssuerAddress(window.AcademicIntegrityApp?.config?.institutionalIssuerAddress ?? "");
}

function isAdministrativeRelayEnabled() {
	return window.AcademicIntegrityApp?.config?.adminRegistrationEnabled === true;
}

function getRelayBaseUrl() {
	return String(window.AcademicIntegrityApp?.config?.relayBaseUrl ?? "").trim().replace(/\/$/, "");
}

function buildRelayEndpoint(path) {
	const relayBaseUrl = getRelayBaseUrl();

	if (!relayBaseUrl) {
		throw new Error("relay config missing");
	}

	return `${relayBaseUrl}${path}`;
}

function buildIdempotencyKey({ hash, file }) {
	const safeName = String(file?.name ?? "certificado").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24) || "certificado";
	return `${safeName}-${hash.slice(2, 14)}-${crypto.randomUUID()}`;
}

function getFileSignature(file) {
	if (!file) {
		return "";
	}

	return [
		String(file.name ?? "").trim(),
		Number(file.size ?? 0),
		Number(file.lastModified ?? 0),
		String(file.type ?? "").trim()
	].join("::");
}

async function requestRelay(path, options = {}) {
	const response = await fetch(buildRelayEndpoint(path), {
		...options,
		headers: {
			"Content-Type": "application/json",
			"X-Operator-Id": "institutional-web",
			...(options.headers ?? {})
		}
	});
	const payload = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(payload.message ?? `relay request failed (${response.status})`);
	}

	return payload;
}

async function submitAdministrativeRegistration(payload) {
	return requestRelay("/api/admin/register-hash", {
		method: "POST",
		body: JSON.stringify(payload)
	});
}

async function getAdministrativeRegistrationStatus(requestId) {
	return requestRelay(`/api/admin/register-status?requestId=${encodeURIComponent(requestId)}`, {
		method: "GET"
	});
}

async function waitForRelayResolution(requestId, attempts = 10) {
	let latest = null;

	for (let index = 0; index < attempts; index += 1) {
		latest = await getAdministrativeRegistrationStatus(requestId);

		if (["confirmed", "duplicate", "failed"].includes(latest.status)) {
			return latest;
		}

		await new Promise((resolve) => window.setTimeout(resolve, 1500));
	}

	return latest;
}

function wireRegistrationPage() {
	if (typeof document === "undefined") {
		return;
	}

	const page = document.body?.dataset?.page;

	if (page !== "register") {
		return;
	}

	const form = document.getElementById("registrationForm");
	const fileInput = document.getElementById("certificateFile");
	const hashInput = document.getElementById("certificateHash");
	const issuerInput = document.getElementById("issuerAddress");
	const issuerHint = document.getElementById("institutionalIssuerHint");
	const generateButton = document.getElementById("generateHashButton");
	const copyHashButton = document.getElementById("copyHashButton");
	const preRegistrationNotice = document.getElementById("preRegistrationNotice");
	const statusBox = document.getElementById("registrationStatus");
	const resultBlock = document.getElementById("registrationResult");
	const resultHash = document.getElementById("resultHash");
	const resultIssuer = document.getElementById("resultIssuer");
	const resultDate = document.getElementById("resultDate");
	const resultTx = document.getElementById("resultTx");
	const relayModeLabel = document.getElementById("relayModeLabel");

	const controller = createRegistrationController({
		submitRegistration: submitAdministrativeRegistration,
		queryRegistrationStatus: waitForRelayResolution,
		buildIdempotencyKey,
		formatTimestamp: formatUnixTimestamp,
		isAdminRegistrationEnabled: () => isAdministrativeRelayEnabled() && Boolean(getRelayBaseUrl())
	});
	const institutionalIssuerAddress = getInstitutionalIssuerAddress();
	const hasInstitutionalIssuer = Boolean(institutionalIssuerAddress);
	const institutionalIssuerIsValid = isEthereumAddress(institutionalIssuerAddress);
	const relayConfigured = isAdministrativeRelayEnabled() && Boolean(getRelayBaseUrl());
	let isGeneratingHash = false;
	let isSubmittingRegistration = false;
	let lockedSubmittedFileSignature = "";

	function setButtonBusy(button, isBusy, idleLabel, busyLabel) {
		if (!button) {
			return;
		}

		button.disabled = isBusy;
		button.setAttribute("aria-busy", isBusy ? "true" : "false");
		button.textContent = isBusy ? busyLabel : idleLabel;
	}

	function resetSubmissionLock() {
		lockedSubmittedFileSignature = "";
	}

	function clearGeneratedHash() {
		if (hashInput) {
			hashInput.value = "";
		}
	}

	function isLockedSubmittedFile(file) {
		const signature = getFileSignature(file);
		return Boolean(signature) && signature === lockedSubmittedFileSignature;
	}

	function syncButtonsState() {
		setButtonBusy(
			generateButton,
			isGeneratingHash,
			"Generar huella",
			"Generando huella..."
		);
		setButtonBusy(
			document.getElementById("submitRegistrationButton"),
			isSubmittingRegistration,
			"Registrar por relay institucional",
			"Enviando al relay..."
		);
	}

	function handleFileInputChange() {
		const currentFile = fileInput?.files?.[0] ?? null;

		if (!currentFile) {
			resetSubmissionLock();
			clearGeneratedHash();
			applyFloatingNote(
				preRegistrationNotice,
				"floating-note-info",
				"Archivo eliminado. Ya puedes seleccionar un certificado y generar una nueva huella."
			);
			return;
		}

		clearGeneratedHash();
		resultBlock.hidden = true;

		if (!isLockedSubmittedFile(currentFile)) {
			return;
		}

		applyFloatingNote(
			preRegistrationNotice,
			"floating-note-error",
			"Este archivo ya fue enviado al relay. Elimínalo del selector antes de volver a intentarlo."
		);
	}

	syncButtonsState();

	if (issuerInput) {
		issuerInput.value = institutionalIssuerAddress;
		issuerInput.readOnly = true;
	}

	if (relayModeLabel) {
		relayModeLabel.textContent = relayConfigured
			? "El registro se enviará por relay institucional preconfigurado."
			: "El relay administrativo aún no está disponible para este entorno.";
	}

	if (!relayConfigured) {
		applyFloatingNote(
			preRegistrationNotice,
			"floating-note-error",
			getUserMessage("relayUnavailable", "El registro administrativo no está disponible en este entorno.")
		);
	} else if (!hasInstitutionalIssuer) {
		if (issuerHint) {
			issuerHint.textContent = "No hay cuenta institucional configurada para este entorno.";
		}
		applyFloatingNote(
			preRegistrationNotice,
			"floating-note-error",
			"No hay cuenta institucional configurada. Define institutionalIssuerAddress en contract-config.json para continuar."
		);
	} else if (!institutionalIssuerIsValid) {
		if (issuerHint) {
			issuerHint.textContent = "La cuenta institucional configurada no tiene un formato de dirección EVM válido.";
		}
		applyFloatingNote(
			preRegistrationNotice,
			"floating-note-error",
			"La cuenta institucional configurada es inválida. Debe tener formato 0x + 40 caracteres hexadecimales."
		);
	} else if (issuerHint) {
		issuerHint.textContent = `Cuenta institucional activa: ${institutionalIssuerAddress}`;
	}

	async function handleGenerate() {
		if (isGeneratingHash || isSubmittingRegistration) {
			return;
		}

		const file = fileInput?.files?.[0] ?? null;

		if (isLockedSubmittedFile(file)) {
			applyFloatingNote(
				preRegistrationNotice,
				"floating-note-error",
				"Este archivo ya fue enviado al relay. Elimínalo del selector antes de generar otra vez la huella."
			);
			return;
		}

		isGeneratingHash = true;
		syncButtonsState();
		applyFloatingNote(preRegistrationNotice, "floating-note-info", "Generando la huella del certificado...");

		try {
			const result = await controller.generateHash(file);

			if (result.status === "failed") {
				applyFloatingNote(preRegistrationNotice, "floating-note-error", result.message);
				return;
			}

			hashInput.value = result.hash;
			applyFloatingNote(preRegistrationNotice, "floating-note-success", getUserMessage("registrationHashReady", "La huella ya fue generada. Ahora puedes registrarla."));
		} catch (error) {
			const mapped = mapRegistrationError(error);
			applyFloatingNote(preRegistrationNotice, "floating-note-error", mapped.message);
		} finally {
			isGeneratingHash = false;
			syncButtonsState();
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (isSubmittingRegistration || isGeneratingHash) {
			return;
		}

		const currentFile = fileInput?.files?.[0] ?? null;
		const submissionFileSignature = getFileSignature(currentFile);

		if (isLockedSubmittedFile(currentFile)) {
			applyStatus(statusBox, "status-error", "Este archivo ya fue enviado al relay institucional.");
			applyFloatingNote(preRegistrationNotice, "floating-note-error", "Elimina el archivo actual del selector antes de volver a registrarlo.");
			return;
		}

		if (!hasInstitutionalIssuer) {
			applyStatus(statusBox, "status-error", "No hay cuenta institucional configurada para registrar.");
			applyFloatingNote(preRegistrationNotice, "floating-note-error", "Configura la cuenta institucional antes de enviar el registro.");
			return;
		}

		if (!institutionalIssuerIsValid) {
			applyStatus(statusBox, "status-error", "La cuenta institucional configurada no tiene un formato válido.");
			applyFloatingNote(preRegistrationNotice, "floating-note-error", "Corrige la dirección institucional con formato 0x + 40 caracteres hexadecimales.");
			return;
		}

		if (!relayConfigured) {
			applyStatus(statusBox, "status-error", getUserMessage("relayUnavailable", "El registro administrativo no está disponible en este entorno."));
			applyFloatingNote(preRegistrationNotice, "floating-note-error", "Define relayBaseUrl y habilita adminRegistrationEnabled en contract-config.json para continuar.");
			return;
		}

		issuerInput.value = institutionalIssuerAddress;
		isSubmittingRegistration = true;
		lockedSubmittedFileSignature = submissionFileSignature;
		syncButtonsState();
		applyStatus(statusBox, "status-working", getUserMessage("registrationWorking", "Enviando el registro al relay institucional..."));
		resultBlock.hidden = true;

		try {
			const result = await controller.submit({
				issuerAddress: issuerInput?.value?.trim() ?? "",
				hash: hashInput?.value?.trim() ?? "",
				file: currentFile
			});

			if (result.status === "pending") {
				applyStatus(statusBox, "status-working", result.message ?? getUserMessage("relayPending", "La solicitud fue aceptada por el relay institucional. Esperando confirmación..."));
				return;
			}

			if (result.status !== "confirmed") {
				applyStatus(statusBox, "status-error", result.message);
				return;
			}

			resultHash.textContent = result.certificateHash;
			resultIssuer.textContent = result.issuerAddress;
			resultDate.textContent = result.issuedAt;
			resultTx.textContent = result.transactionHash;
			resultBlock.hidden = false;
			applyStatus(statusBox, "status-success", result.message);
		} catch (error) {
			const mapped = mapRegistrationError(error);
			applyStatus(statusBox, "status-error", mapped.message);
		} finally {
			isSubmittingRegistration = false;
			syncButtonsState();
		}
	}

	async function handleCopyHash() {
		const hash = hashInput?.value?.trim() ?? "";

		if (!hash) {
			applyFloatingNote(preRegistrationNotice, "floating-note-error", "Primero genera la huella antes de intentar copiarla.");
			return;
		}

		try {
			await navigator.clipboard.writeText(hash);
			applyFloatingNote(preRegistrationNotice, "floating-note-success", "La huella fue copiada al portapapeles.");
		} catch {
			applyFloatingNote(preRegistrationNotice, "floating-note-error", "No fue posible copiar la huella automáticamente. Cópiala manualmente.");
		}
	}

	generateButton?.addEventListener("click", handleGenerate);
	copyHashButton?.addEventListener("click", handleCopyHash);
	fileInput?.addEventListener("change", handleFileInputChange);
	form?.addEventListener("submit", handleSubmit);
}

wireRegistrationPage();