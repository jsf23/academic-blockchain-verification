# Quickstart: Registro Administrativo con Relay

## Goal
Levantar y validar el flujo administrativo sin MetaMask para operadores, manteniendo la verificacion publica directa on-chain.

## Prerequisites
- Node.js 22 disponible en el entorno de desarrollo.
- Contrato desplegado y autorizado para la cuenta institucional existente.
- Un proyecto de Vercel configurado para alojar el relay administrativo.
- Variables de entorno separadas entre frontend publico y relay restringido.

## 1. Preparar configuracion publica del frontend
1. Configurar los valores publicos necesarios para `frontend/contract-config.json`.
2. Mantener solo datos publicos: `rpcUrl`, `chainId`, `contractAddress`, `contractAbi`, `institutionalIssuerAddress`, `relayBaseUrl` y `adminRegistrationEnabled`.
3. Ejecutar el flujo existente de validacion y generacion de configuracion publica antes de publicar el frontend.

## 2. Preparar configuracion restringida del relay
1. Configurar en el proveedor serverless las credenciales restringidas del relay: clave del signer institucional, origen permitido del frontend y cualquier credencial operativa no publica.
2. Si el despliegue requiere endurecimiento adicional, configurar tambien `RELAY_ADMIN_TOKEN`; si no existe, el relay puede operar limitado por `RELAY_ALLOWED_ORIGIN` para el flujo preconfigurado del operador.
3. Verificar que el signer institucional siga autorizado en el contrato antes de habilitar el entorno.

## 3. Ejecutar el frontend localmente
1. Generar o refrescar la configuracion publica con `npm run config:frontend`.
2. Validar la configuracion publica con `npm run validate:public-config`.
3. Levantar el frontend estatico con `npm run start`.
4. Confirmar que la pagina de registro carga sin depender de MetaMask.
5. Confirmar que la pagina de verificacion publica sigue resolviendo consultas on-chain como hasta ahora.

## 4. Ejecutar y probar el relay localmente
1. Validar la configuracion restringida con `npm run validate:relay-config`.
2. Desplegar o ejecutar localmente los handlers `api/admin/register-hash.js` y `api/admin/register-status.js` en el runtime serverless elegido.
3. Probar el endpoint de alta administrativa con una huella valida, un `idempotencyKey` nuevo y un operador autenticado o un origen permitido.
4. Consultar el endpoint de estado hasta obtener `confirmed`, `duplicate` o `failed`.

## 5. Validar el flujo extremo a extremo
1. Abrir la web en un navegador sin MetaMask.
2. Subir un archivo valido y completar el registro desde la UI administrativa.
3. Confirmar que la UI muestre estado inicial, seguimiento y resultado final sin pedir instalacion adicional.
4. Ejecutar la verificacion publica de la misma huella y comprobar que el resultado on-chain coincide con el registro emitido.

## 6. Publicar
1. Publicar el frontend estatico en GitHub Pages usando el flujo de despliegue gratuito ya definido.
2. Publicar el relay administrativo en Vercel con las variables restringidas del entorno objetivo.
3. Repetir la validacion post-deploy sobre registro administrativo y verificacion publica.

## Validaciones ejecutadas en este entorno

- `npm run config:frontend`: OK. El generador produjo `frontend/contract-config.json` con `hasRelayBaseUrl` y `adminRegistrationEnabled` visibles en la salida.
- `npm run validate:public-config`: OK. Resultado observado: `hasRelayBaseUrl=true`, `adminRegistrationEnabled=true`, ABI presente y contrato configurado.
- `npm run validate:relay-config`: OK con un set temporal de variables coherente para el signer del relay; el chequeo rechazo primero una clave privada incompatible con la direccion institucional y luego valido correctamente una configuracion consistente.
- `npm run test:integration`: OK. 9 pruebas pasando.
- `npm run test:contract`: OK. 5 pruebas pasando. Ganache informo fallback a implementacion Node por incompatibilidad del binario `uws`, sin afectar el resultado funcional.

## Checklist final de consistencia

- El registro administrativo en `register.html` usa `relayBaseUrl` y `adminRegistrationEnabled` en lugar de firma directa desde wallet.
- El relay serverless falla en cerrado cuando faltan clave privada, contrato o configuracion base.
- La verificacion publica en `verify.html` y `verify.js` sigue consultando directo a blockchain y no depende del relay.
- `frontend/contract-config.json` solo expone valores publicos; los secretos del relay quedan fuera del frontend.
- README.md documenta el despliegue dual: GitHub Pages para frontend y relay gratuito separado para escrituras administrativas.

## Evidencia manual E2E (sin MetaMask)

- Flujo ejecutado sobre `http://localhost:4173/register.html` con relay local `http://localhost:8787` y origen permitido `RELAY_ALLOWED_ORIGIN=http://localhost:4173`.
- Archivo usado en la prueba final: `artifacts/manual-certificate-3.txt` (contenido unico para evitar duplicados de hash).
- Huella generada en navegador: `0x974ea1ca78ef0519245a7ab454d85d00f7fb16c3f3f146361e4e0e1a63686a47`.
- Resultado en UI de registro: `Registro confirmado en blockchain.`
- Transaccion mostrada por la UI: `0x6a6a0ad90df84de87fa3718205839fdd64e715315042ff4be603b16858a08eca`.
- Emisor mostrado por la UI: `0x8b380eac1Ba86FDbE87b239aCef55FA3B056cd5E`.
- Verificacion publica ejecutada en `http://localhost:4173/verify.html` con la misma huella.
- Resultado en UI publica: `Certificado encontrado: autenticidad confirmada.` con estado `Valido`.
- Durante la prueba no hubo prompts de MetaMask ni dependencia de wallet para registrar.

## Incidencias detectadas y correcciones aplicadas durante la validacion

- CORS preflight bloqueado hacia el relay: se agrego manejo `OPTIONS` y cabeceras `Access-Control-Allow-*` en `api/admin/register-hash.js` y `api/admin/register-status.js`.
- Enrutamiento local incompleto para preflight: `scripts/dev-relay-server.js` ahora enruta `/api/admin/register-hash` y `/api/admin/register-status` para todos los metodos, no solo `POST`/`GET`.
- Falso `failed` con HTTP 502 pese a transaccion confirmada: se corrigio serializacion de `blockNumber` (BigInt) en `backend/lib/relay-service.js` antes de persistir estado.

## Expected Outcome
- El operador registra certificados desde la web sin MetaMask ni software adicional.
- El relay firma y transmite con la cuenta institucional preconfigurada.
- La verificacion publica permanece directa y consistente sobre blockchain.
