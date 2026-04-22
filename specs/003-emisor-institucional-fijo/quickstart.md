# Quickstart: Feature 003 - Emisor Institucional Fijo

## Goal
Validar que el registro de huellas use una cuenta institucional unica y no permita seleccion manual de emisor.

## Prerequisites
- Node.js instalado (version recomendada por `.nvmrc`).
- Dependencias instaladas con `npm install`.
- Contrato desplegado y `frontend/contract-config.json` generado.

## Runtime Config Preparation
1. Definir en `.env` la cuenta institucional del entorno:
   - `INSTITUTIONAL_ISSUER_ADDRESS=0x...`
   - (opcional legado) `UNIVERSITY_ISSUER_ADDRESS=0x...`
1. Generar/actualizar config frontend:
   - `npm run config:frontend`
2. Confirmar que `frontend/contract-config.json` incluya la direccion del emisor institucional del entorno.
3. Confirmar que la direccion institucional este autorizada en contrato.
4. Si existen ambas variables, verificar que el valor aplicado corresponda a `INSTITUTIONAL_ISSUER_ADDRESS`.

## Run Locally
1. Iniciar frontend estatico:
   - `npm run start`
2. Abrir:
   - `http://localhost:4173/register.html`

## Validation Flow

1. UI behavior
- Confirmar que no exista selector manual de cuentas en registro.
- Confirmar que la cuenta institucional activa se muestre en modo solo lectura.

2. Positive registration path
- Cargar archivo de certificado.
- Generar huella SHA-256.
- Registrar en blockchain.
- Confirmar resultado `confirmed` con emisor igual a la cuenta institucional configurada.

3. Negative paths
- Remover/invalidar cuenta institucional en config y verificar bloqueo temprano con mensaje claro.
- Usar cuenta institucional no autorizada y verificar rechazo con mensaje accionable.

4. Regression
- Ejecutar pruebas del proyecto:
  - `npm run test:integration`
  - `npm run test:contract`

## Completion Criteria
- Todos los registros exitosos usan la cuenta institucional fija del entorno.
- No hay seleccion manual de emisor en UI.
- Casos de error por configuracion/autorizacion son claros y bloquean envio cuando corresponde.
- Pruebas automatizadas existentes pasan sin regresiones.

## Evidence Log

- Regression `npm run test:integration`: PASS (9 passing, 0 failing)
- Regression `npm run test:contract`: PASS (5 passing, 0 failing)
- Manual review de contenido en `frontend/register.html`: PASS (sin selector manual; emisor en solo lectura)
- Manual review de mensajes institucionales en `frontend/js/register.js`: PASS (bloqueo por config ausente/invalida y no autorizada)
