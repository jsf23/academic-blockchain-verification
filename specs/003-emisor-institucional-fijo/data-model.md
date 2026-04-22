# Data Model: Emisor Institucional Fijo

## Overview
Este feature no agrega entidades persistentes nuevas en contrato ni base de datos. Define un modelo de configuracion y estado de UI para asegurar que el registro use una cuenta institucional unica.

## Entities

### 1. InstitutionalIssuerConfig
- Purpose: Representar la identidad emisora institucional activa por entorno.
- Fields:
  - `address` (string): direccion EVM del emisor institucional (formato `0x` + 40 hex).
  - `configured` (boolean): indica si existe valor utilizable en runtime config.
  - `formatValid` (boolean): indica si la direccion cumple formato EVM esperado.
- Validation Rules:
  - `address` MUST existir para habilitar registro.
  - `address` MUST cumplir formato EVM valido.

### 2. RegistrationAttempt
- Purpose: Modelar un intento de registrar una huella con emisor institucional fijo.
- Fields:
  - `certificateHash` (string): huella SHA-256 en formato bytes32 (`0x` + 64 hex).
  - `issuerAddress` (string): direccion emisora aplicada (debe ser institucional fija).
  - `authorizationStatus` (enum): `unknown | authorized | unauthorized`.
  - `submissionStatus` (enum): `blocked | failed | confirmed`.
  - `message` (string): mensaje operativo mostrado al usuario.
- Validation Rules:
  - `issuerAddress` MUST ser igual a `InstitutionalIssuerConfig.address`.
  - Si `configured=false` o `formatValid=false`, `submissionStatus` MUST ser `blocked`.
  - Si `authorizationStatus=unauthorized`, `submissionStatus` MUST ser `blocked` o `failed` con causa explicita.

### 3. RegistrationOutcome
- Purpose: Representar resultado final de un intento de registro.
- Fields:
  - `status` (enum): `confirmed | failed | blocked`.
  - `transactionHash` (string|null): hash de transaccion cuando aplica.
  - `onChainIssuer` (string|null): emisor reportado por evento de contrato.
  - `issuedAt` (string|null): timestamp formateado cuando aplica.
  - `errorCode` (string|null): codigo de error de negocio/operacion.
- Validation Rules:
  - Si `status=confirmed`, `transactionHash` MUST existir.
  - Si `status!=confirmed`, `errorCode` MUST existir.

## Relationships
- `RegistrationAttempt.issuerAddress` referencia exactamente un `InstitutionalIssuerConfig.address` activo.
- Cada `RegistrationAttempt` produce exactamente un `RegistrationOutcome`.

## State Transitions

### Institutional Issuer Readiness
1. `missing_config` -> no hay direccion institucional.
2. `invalid_config` -> direccion presente pero invalida.
3. `ready` -> direccion valida y disponible para uso.

### Registration Lifecycle
1. `draft` -> huella no lista o emisor no listo.
2. `prechecked` -> huella valida y emisor institucional listo.
3. `authorized` -> emisor institucional confirmado como autorizado en contrato.
4. `submitted` -> transaccion enviada.
5. `confirmed` o `failed` -> resultado final mostrado al operador.
