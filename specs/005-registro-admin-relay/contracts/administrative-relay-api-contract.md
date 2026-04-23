# Contract: Administrative Relay API

## Purpose
Definir la interfaz observable del relay administrativo que registra huellas con la cuenta institucional preconfigurada, sin exponer una capacidad generica de firma o proxy RPC.

## Scope
- Alta administrativa de huellas desde la web.
- Consulta de estado operativo de una solicitud ya aceptada.
- Exclusivamente para operadores autenticados.

## Endpoint 1: Submit Administrative Registration

### Request
- Method: `POST`
- Path: `/admin/register-hash`
- Authentication: requerida.
- Idempotency: requerida mediante `Idempotency-Key` o campo equivalente del payload.

### Request Body
```json
{
  "hash": "0x<64-hex>",
  "fileName": "certificado.pdf",
  "mimeType": "application/pdf",
  "sizeBytes": 248193,
  "idempotencyKey": "req-20260422-001"
}
```

### Behavioral Rules
- El relay MUST ignorar cualquier intento del cliente de elegir `from`, `to`, ABI, calldata, gas manual o metodo distinto de `issueCertificate`.
- El relay MUST validar autenticacion, formato del hash, esquema del payload, disponibilidad de configuracion restringida y autorizacion on-chain del emisor institucional.
- El relay MUST detectar duplicados por `certificateHash` e idempotencia antes de transmitir.
- El relay MUST devolver un `requestId` utilizable para seguimiento aun cuando la confirmacion final ocurra despues.

### Success Response
```json
{
  "requestId": "rr_01HT...",
  "status": "accepted_pending_submission",
  "certificateHash": "0x<64-hex>",
  "message": "Solicitud aceptada para registro institucional."
}
```

### Submitted Response
```json
{
  "requestId": "rr_01HT...",
  "status": "submitted_pending_confirmation",
  "certificateHash": "0x<64-hex>",
  "txHash": "0x<64-hex>",
  "message": "Transaccion enviada. Esperando confirmacion on-chain."
}
```

### Duplicate Response
```json
{
  "requestId": "rr_01HT...",
  "status": "duplicate",
  "certificateHash": "0x<64-hex>",
  "message": "La huella ya existe en el registro o ya fue enviada previamente."
}
```

### Error Semantics
- `UNAUTHENTICATED`: el operador no tiene sesion valida.
- `INVALID_REQUEST`: el payload o la huella no cumplen el contrato.
- `RELAY_MISCONFIGURED`: faltan secretos o configuracion restringida.
- `ISSUER_UNAUTHORIZED`: la cuenta institucional ya no esta autorizada en contrato.
- `RATE_LIMITED`: demasiados intentos para el mismo operador/origen.
- `SUBMISSION_FAILED`: fallo operativo despues de aceptar la solicitud.

## Endpoint 2: Query Administrative Registration Status

### Request
- Method: `GET`
- Path: `/admin/register-hash/{requestId}`
- Authentication: requerida.

### Response
```json
{
  "requestId": "rr_01HT...",
  "status": "confirmed",
  "certificateHash": "0x<64-hex>",
  "txHash": "0x<64-hex>",
  "updatedAt": "2026-04-22T20:45:00Z",
  "message": "Registro confirmado en blockchain."
}
```

### Behavioral Rules
- El endpoint MUST devolver el ultimo estado conocido de la solicitud.
- El endpoint MUST no filtrar secretos, claves ni detalles internos de infraestructura.
- El endpoint MUST seguir accesible aunque la confirmacion final tarde mas que la solicitud inicial.

## Out of Scope
- Proxy JSON-RPC general.
- Firma de mensajes arbitrarios.
- Lectura publica de verificacion, que sigue realizandose directo on-chain desde el frontend.
