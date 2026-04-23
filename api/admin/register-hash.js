import { loadRelayRuntimeConfig } from "../../backend/lib/relay-config.js";
import { getRemoteAddress, verifyRelayAccess } from "../../backend/lib/relay-auth.js";
import { submitAdministrativeRegistration } from "../../backend/lib/relay-service.js";

function applyCorsHeaders(response, config, requestOrigin = "") {
	const allowedOrigin = String(config?.allowedOrigin ?? "").trim();
	const origin = allowedOrigin || requestOrigin || "*";
	response.setHeader("Access-Control-Allow-Origin", origin);
	response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
	response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Operator-Id");
	response.setHeader("Vary", "Origin");
}

function sendJson(response, statusCode, body) {
	response.statusCode = statusCode;
	response.setHeader("Content-Type", "application/json; charset=utf-8");
	response.end(`${JSON.stringify(body, null, 2)}\n`);
}

async function readJsonBody(request) {
	if (request.body && typeof request.body === "object") {
		return request.body;
	}

	if (typeof request.body === "string" && request.body.trim()) {
		return JSON.parse(request.body);
	}

	const chunks = [];
	for await (const chunk of request) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	}

	if (chunks.length === 0) {
		return {};
	}

	return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export default async function handler(request, response) {
	const config = await loadRelayRuntimeConfig();
	applyCorsHeaders(response, config, String(request.headers?.origin ?? "").trim());

	if (request.method === "OPTIONS") {
		response.statusCode = 204;
		response.end();
		return;
	}

	if (request.method !== "POST") {
		response.setHeader("Allow", "POST");
		sendJson(response, 405, {
			status: "failed",
			errorCode: "METHOD_NOT_ALLOWED",
			message: "El relay administrativo solo acepta solicitudes POST para registrar huellas."
		});
		return;
	}

	try {
		const access = verifyRelayAccess({
			headers: request.headers,
			config,
			remoteAddress: getRemoteAddress(request)
		});

		if (!access.ok) {
			sendJson(response, access.statusCode, access.body);
			return;
		}

		const payload = await readJsonBody(request);
		const result = await submitAdministrativeRegistration({
			payload,
			operatorId: access.operatorId,
			config
		});
		sendJson(response, result.httpStatus, result.body);
	} catch (error) {
		sendJson(response, error.statusCode ?? 500, {
			status: "failed",
			errorCode: error.code ?? "SUBMISSION_FAILED",
			message: error instanceof Error ? error.message : "No fue posible procesar la solicitud administrativa."
		});
	}
}
