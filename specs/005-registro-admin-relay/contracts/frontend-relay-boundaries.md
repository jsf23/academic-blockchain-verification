# Contract: Frontend Relay Boundaries

## Purpose
Definir que partes del flujo permanecen publicas y directas on-chain, y cuales pasan por el relay administrativo restringido.

## Public Frontend Responsibilities
- El frontend MUST permitir cargar un archivo y derivar o mostrar la huella SHA-256 antes del envio.
- El frontend MUST usar configuracion publica versionable para verificacion y lectura on-chain.
- El frontend MUST mantener la verificacion publica de huellas directamente contra el contrato existente.
- El frontend MUST tratar cualquier URL o identificador del relay como publico, pero nunca incluir secretos del relay.

## Administrative Registration Responsibilities
- El frontend MUST enviar al relay solo el payload minimo requerido para registrar una huella.
- El frontend MUST no permitir al operador elegir la cuenta emisora, editar el metodo on-chain ni inyectar parametros de firma.
- El frontend MUST reflejar estados operativos del relay: aceptado, pendiente, confirmado, duplicado o fallido.
- El frontend MUST mostrar mensajes comprensibles cuando la configuracion administrativa no este disponible.

## Public Configuration Boundary
- `contractAddress`, `chainId`, `contractAbi`, `rpcUrl` e `institutionalIssuerAddress` MAY existir en configuracion publica del frontend.
- La URL base del relay MAY existir en configuracion publica del frontend.
- Todo valor entregado al navegador MUST considerarse publico.

## Restricted Configuration Boundary
- La clave privada institucional MUST permanecer solo en variables de entorno o secret manager del relay.
- Los secretos de autenticacion administrativa MUST permanecer solo del lado servidor.
- Credenciales RPC restringidas o de almacenamiento MUST no publicarse en GitHub Pages ni en `contract-config.json`.

## Behavioral Rules
- Si el relay no esta disponible o no esta configurado, el frontend MUST bloquear el alta administrativa y comunicar el problema sin intentar usar MetaMask como fallback silencioso.
- El frontend MUST seguir permitiendo verificacion publica aun cuando el relay administrativo este degradado.
- El frontend MUST conservar la separacion entre flujo administrativo autenticado y flujo publico de verificacion.

## Out of Scope
- Custodia institucional de claves fuera del entorno relay.
- Cambios al contrato inteligente o a la semantica de verificacion publica.
- Exponer herramientas operativas de administrador distintas del alta y seguimiento de solicitudes.
