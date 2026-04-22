# Data Model: Deploy Gratuito GitHub

## Overview
Este feature no agrega datos de negocio on-chain. Define entidades operativas para modelar configuracion de publicacion, ejecuciones de despliegue y validacion posterior.

## Entities

### 1. PublicDeployConfig
- Purpose: Representar la configuracion necesaria para publicar la app web en un hosting gratuito.
- Fields:
  - `provider` (enum): `github-pages`.
  - `sourceBranch` (string): rama o fuente aprobada para publicar.
  - `publishPath` (string): carpeta del sitio estatico a publicar.
  - `publicRuntimeConfig` (object): valores publicos requeridos por la app web.
  - `excludedSensitiveFiles` (string[]): archivos/patrones que no deben versionarse.
- Validation Rules:
  - `provider` MUST ser un proveedor gratuito aprobado.
  - `publishPath` MUST apuntar a contenido estatico publicable.
  - `excludedSensitiveFiles` MUST incluir archivos locales no aptos para publicacion.

### 2. DeployExecution
- Purpose: Representar una publicacion individual del sitio.
- Fields:
  - `sourceRevision` (string): commit o revision publicada.
  - `status` (enum): `pending | success | failed | rolled-back`.
  - `publicUrl` (string): URL publica resultante.
  - `executedAt` (datetime/string): fecha de ejecucion.
  - `triggerType` (enum): `manual | github`.
- Validation Rules:
  - `publicUrl` MUST existir cuando `status=success`.
  - `status=failed` MUST dejar evidencia de que no se aprobo como release valida.

### 3. PostDeployValidationRecord
- Purpose: Registrar la verificacion posterior a la publicacion.
- Fields:
  - `homeReachable` (boolean)
  - `registerReachable` (boolean)
  - `verifyReachable` (boolean)
  - `runtimeConfigConsistent` (boolean)
  - `notes` (string)
- Validation Rules:
  - Todos los chequeos criticos MUST ser verdaderos para aceptar la publicacion como estable.

## Relationships
- `PublicDeployConfig` gobierna muchas `DeployExecution`.
- Cada `DeployExecution` produce un `PostDeployValidationRecord`.

## State Transitions

### Deploy Lifecycle
1. `prepared` -> configuracion y fuente listas.
2. `published` -> sitio expuesto en URL publica.
3. `validated` -> chequeos post-deploy aprobados.
4. `failed` -> despliegue no aprobado.
5. `rolled-back` -> se restaura una version estable previa.
