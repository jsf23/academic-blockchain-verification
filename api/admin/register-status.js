import { loadRelayRuntimeConfig } from "../../backend/lib/relay-config.js";
import { getRemoteAddress, verifyRelayAccess } from "../../backend/lib/relay-auth.js";
import { getAdministrativeRegistrationStatus } from "../../backend/lib/relay-service.js";

function applyCorsHeaders(response, config, requestOrigin = "") {
	const allowedOrigin = String(config?.allowedOrigin ?? "").trim();
	const origin = allowedOrigin || requestOrigin || "*";
	response.setHeader("Access-Control-Allow-Origin", origin);
	response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
	response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Operator-Id");
	response.setHeader("Vary", "Origin");
}

function sendJson(response, statusCode, body) {
	response.statusCode = statusCode;
	response.setHeader("Content-Type", "application/json; charset=utf-8");
	response.end(`${JSON.stringify(body, null, 2)}\n`);
}

function getRequestId(request) {
	const fromQuery = request.query?.requestId ?? request.query?.id;

	if (fromQuery) {
		return String(fromQuery).trim();
	}

	const url = new URL(request.url ?? "http://localhost", "http://localhost");
	const fromSearch = url.searchParams.get("requestId") ?? url.searchParams.get("id");

	if (fromSearch) {
		return fromSearch.trim();
	}

	const segments = url.pathname.split("/").filter(Boolean);
	return segments.length > 0 ? segments[segments.length - 1] : "";
}

export default async function handler(request, response) {
	const config = await loadRelayRuntimeConfig();
	applyCorsHeaders(response, config, String(request.headers?.origin ?? "").trim());

	if (request.method === "OPTIONS") {
		response.statusCode = 204;
		response.end();
		return;
	}

	if (request.method !== "GET") {
		response.setHeader("Allow", "GET");
		sendJson(response, 405, {
			status: "failed",
			errorCode: "METHOD_NOT_ALLOWED",
			message: "El relay administrativo solo acepta solicitudes GET para consultar estado."
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

		const requestId = getRequestId(request);
		const status = await getAdministrativeRegistrationStatus({ requestId, config });
		sendJson(response, 200, status);
	} catch (error) {
		sendJson(response, error.statusCode ?? 500, {
			status: "failed",
			errorCode: error.code ?? "SUBMISSION_FAILED",
			message: error instanceof Error ? error.message : "No fue posible consultar el estado de la solicitud administrativa."
		});
	}
}
