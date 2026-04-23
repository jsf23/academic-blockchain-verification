# Data Model: Registro Administrativo con Relay

## Overview
Este feature no cambia la estructura del contrato inteligente ni la verificacion publica. Introduce un modelo operativo para enrutar la escritura administrativa a traves de un relay restringido, con persistencia minima para idempotencia, estados y trazabilidad.

## Entities

### 1. AdministrativeRegistrationRequest
- Purpose: Representar un intento de registrar una huella administrativa desde la web.
- Fields:
  - `requestId` (string): identificador unico del intento generado por el relay.
  - `idempotencyKey` (string): clave estable para reintentos seguros del mismo envio.
  - `certificateHash` (string): huella SHA-256 en formato `0x` + 64 hex.
  - `fileName` (string): nombre visible del archivo cargado.
  - `mimeType` (string): tipo de archivo declarado.
  - `sizeBytes` (number): tamano declarado del archivo.
  - `operatorId` (string): identificador del operador autenticado.
  - `submittedAt` (string): timestamp de recepcion de la solicitud.
  - `status` (enum): `rejected | duplicate | accepted_pending_submission | submitted_pending_confirmation | confirmed | failed`.
- Validation Rules:
  - `certificateHash` MUST cumplir formato bytes32.
  - `idempotencyKey` MUST existir para cualquier solicitud de alta.
  - `operatorId` MUST existir y corresponder a un operador autenticado.
  - `status` MUST empezar en `accepted_pending_submission`, `duplicate` o `rejected`.

### 2. RelayRuntimeConfig
- Purpose: Representar la configuracion restringida necesaria para firmar y transmitir desde el relay.
- Fields:
  - `rpcUrl` (string): endpoint RPC del entorno objetivo.
  - `chainId` (number): red EVM esperada.
  - `contractAddress` (string): direccion del contrato de registro.
  - `issuerAddress` (string): direccion institucional derivada de la credencial del relay.
  - `privateKeyConfigured` (boolean): indica si el signer esta disponible.
  - `authSecretConfigured` (boolean): indica si el acceso administrativo esta protegido.
- Validation Rules:
  - `rpcUrl`, `chainId` y `contractAddress` MUST existir antes de aceptar solicitudes.
  - `issuerAddress` MUST ser una direccion EVM valida.
  - `privateKeyConfigured` y `authSecretConfigured` MUST ser `true` en un entorno funcional.

### 3. RelaySubmissionOutcome
- Purpose: Modelar el resultado operativo de transmitir una solicitud al contrato.
- Fields:
  - `requestId` (string): referencia al intento administrativo.
  - `txHash` (string|null): hash de transaccion cuando fue transmitida.
  - `onChainStatus` (enum): `not_sent | pending | confirmed | reverted`.
  - `receiptBlockNumber` (number|null): bloque de confirmacion si aplica.
  - `errorCode` (string|null): codigo de negocio o infraestructura.
  - `userMessage` (string): mensaje visible y accionable para el operador.
  - `updatedAt` (string): timestamp de ultimo cambio.
- Validation Rules:
  - Si `onChainStatus=confirmed`, `txHash` MUST existir.
  - Si `onChainStatus=reverted`, `errorCode` MUST existir.
  - `userMessage` MUST existir en todos los estados.

### 4. PublicVerificationResult
- Purpose: Representar el resultado del flujo publico de verificacion, sin pasar por el relay.
- Fields:
  - `certificateHash` (string): huella consultada.
  - `exists` (boolean): indica si la huella esta registrada.
  - `issuerAddress` (string): emisor reportado por el contrato.
  - `issuedAt` (string): fecha reportada por el contrato.
  - `isValid` (boolean): validez derivada del contrato actual.
- Validation Rules:
  - `certificateHash` MUST ser consultable sin autenticacion en el frontend.
  - Este modelo MUST seguir usando la interfaz on-chain existente.

## Relationships
- Cada `AdministrativeRegistrationRequest` usa exactamente un `RelayRuntimeConfig` activo por entorno.
- Cada `AdministrativeRegistrationRequest` produce cero o un `RelaySubmissionOutcome` terminal.
- `PublicVerificationResult` consulta el mismo `certificateHash` emitido por `AdministrativeRegistrationRequest`, pero sin depender del relay.

## State Transitions

### Administrative Request Lifecycle
1. `draft` -> el operador aun no ha enviado el archivo o la huella.
2. `accepted_pending_submission` -> el relay acepto la solicitud y comenzo procesamiento interno.
3. `submitted_pending_confirmation` -> la transaccion fue emitida y espera confirmacion.
4. `confirmed` -> el contrato confirmo el registro.
5. `duplicate` -> la huella ya existe o se detecto un intento equivalente previo.
6. `rejected` -> la solicitud fallo por autenticacion, validacion o configuracion.
7. `failed` -> hubo fallo operativo despues de aceptar la solicitud.

### Relay Readiness
1. `misconfigured` -> faltan secretos o configuracion base.
2. `ready_unverified` -> configuracion completa, pendiente de validacion operativa.
3. `ready` -> signer disponible, emisor autorizado y relay listo para aceptar solicitudes.
4. `degraded` -> configuracion presente, pero el entorno no puede registrar temporalmente.
