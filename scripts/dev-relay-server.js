import http from "node:http";
import registerHashHandler from "../api/admin/register-hash.js";
import registerStatusHandler from "../api/admin/register-status.js";

const port = Number(process.env.RELAY_DEV_PORT ?? 8787);

function notFound(response) {
	response.statusCode = 404;
	response.setHeader("Content-Type", "application/json; charset=utf-8");
	response.end(`${JSON.stringify({ status: "failed", errorCode: "NOT_FOUND", message: "Route not found." }, null, 2)}\n`);
}

const server = http.createServer(async (request, response) => {
	try {
		if (request.url?.startsWith("/api/admin/register-hash")) {
			await registerHashHandler(request, response);
			return;
		}

		if (request.url?.startsWith("/api/admin/register-status")) {
			await registerStatusHandler(request, response);
			return;
		}

		notFound(response);
	} catch (error) {
		response.statusCode = 500;
		response.setHeader("Content-Type", "application/json; charset=utf-8");
		response.end(`${JSON.stringify({ status: "failed", errorCode: "DEV_SERVER_ERROR", message: error instanceof Error ? error.message : String(error) }, null, 2)}\n`);
	}
});

server.listen(port, () => {
	console.log(`Relay dev server listening on http://localhost:${port}`);
});
