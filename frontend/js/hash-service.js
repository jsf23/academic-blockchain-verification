function bufferToHex(buffer) {
	const bytes = new Uint8Array(buffer);
	return `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

export async function hashFileWithSha256(file) {
	if (!(file instanceof File)) {
		throw new Error("Se requiere un archivo válido para generar una huella SHA-256.");
	}

	const buffer = await file.arrayBuffer();
	const digest = await crypto.subtle.digest("SHA-256", buffer);
	return bufferToHex(digest);
}

export function isBytes32Hex(value) {
	return /^0x[a-fA-F0-9]{64}$/.test(value);
}