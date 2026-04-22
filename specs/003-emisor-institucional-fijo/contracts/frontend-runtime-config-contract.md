# Contract: Frontend Runtime Config for Institutional Issuer

## Purpose
Definir el contrato de configuracion runtime minimo para soportar emisor institucional fijo por entorno.

## File
- `frontend/contract-config.json`
- `frontend/contract-config.template.json`

## Required Shape

```json
{
  "rpcUrl": "string",
  "chainId": 11155111,
  "contractAddress": "0x...",
  "contractAbi": [],
  "preferWalletProvider": true,
  "institutionalIssuerAddress": "0x..."
}
```

## Field Contract
- `institutionalIssuerAddress`
  - Type: `string`
  - Required: `true` para habilitar registro
  - Format: direccion EVM con prefijo `0x` y 40 caracteres hexadecimales
  - Semantics: unica cuenta emisora institucional del entorno

## Validation Rules
- Si `institutionalIssuerAddress` esta vacio, el flujo de registro MUST bloquear submit.
- Si `institutionalIssuerAddress` no cumple formato de direccion EVM, el flujo MUST bloquear submit.
- Si existe y es valido, el flujo MUST usar este valor como `issuerAddress` en cada envio.

## Producer/Consumer Contract
- Producer: `scripts/build-frontend-config.js` (genera runtime config desde variables de entorno y artifacts).
- Consumer: `frontend/js/app.js` y `frontend/js/register.js`.

## Producer Inputs (Environment)
- `INSTITUTIONAL_ISSUER_ADDRESS` (preferido)
- `UNIVERSITY_ISSUER_ADDRESS` (alias de compatibilidad)

Cuando ambos existen, el producer MUST priorizar `INSTITUTIONAL_ISSUER_ADDRESS`.

## Compatibility
- La adicion del campo `institutionalIssuerAddress` MUST ser backward-compatible con otros consumidores que ignoren campos extra.
- El feature no cambia `contractAbi` ni contratos on-chain.
