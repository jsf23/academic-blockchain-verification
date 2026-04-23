# Tasks: Registro Administrativo con Relay

**Input**: Design documents from `/specs/005-registro-admin-relay/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: El spec no solicita TDD ni nuevas suites obligatorias. Se incluyen tareas de validacion y regresion con las pruebas existentes al cierre del feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- `[P]`: Can run in parallel (different files, no dependencies)
- `[Story]`: Which user story this task belongs to (US1, US2, US3)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar configuracion publica y base operativa para introducir el relay administrativo sin romper el frontend estatico.

- [X] T001 Extender variables de entorno publicas y restringidas del relay en .env.example
- [X] T002 [P] Actualizar la plantilla de configuracion publica con la URL del relay en frontend/contract-config.template.json
- [X] T003 [P] Añadir generacion de `relayBaseUrl` y modo administrativo en scripts/build-frontend-config.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Montar la infraestructura minima del relay, la validacion de requests y la frontera de configuracion que bloquean todas las historias.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Crear carga fail-closed de configuracion restringida del relay en backend/lib/relay-config.js
- [X] T005 [P] Crear autenticacion administrativa y verificacion de origen para el relay en backend/lib/relay-auth.js
- [X] T006 [P] Crear persistencia minima de idempotencia y estados de solicitud en backend/lib/relay-storage.js
- [X] T007 [P] Crear validacion de payload, hash y reglas fijas de contrato en backend/lib/relay-validation.js
- [X] T008 Implementar el ciclo de envio y seguimiento on-chain del relay en backend/lib/relay-service.js
- [X] T009 Implementar los handlers serverless base del relay en api/admin/register-hash.js
- [X] T010 [P] Implementar el handler serverless de consulta de estado en api/admin/register-status.js
- [X] T011 Configurar comandos operativos del relay y validacion local en package.json

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Registro administrativo sin instalaciones (Priority: P1) 🎯 MVP

**Goal**: Permitir que el operador suba un archivo y registre su huella desde la web sin MetaMask ni seleccion manual de cuenta.

**Independent Test**: En un navegador sin extensiones blockchain, el operador abre `register.html`, sube un archivo valido y completa el registro viendo estados claros sin instalar software adicional.

### Implementation for User Story 1

- [X] T012 [US1] Reemplazar el flujo visual dependiente de wallet por un flujo administrativo de carga y confirmacion en frontend/register.html
- [X] T013 [P] [US1] Adaptar el controlador de registro para enviar solicitudes al relay y mapear estados operativos en frontend/js/register-controller.js
- [X] T014 [P] [US1] Actualizar la logica de pantalla para generar `idempotencyKey`, consultar estado y bloquear fallback a MetaMask en frontend/js/register.js
- [X] T015 [US1] Exponer estado de configuracion administrativa y mensajes globales del flujo en frontend/js/app.js

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Emision institucional preconfigurada por relay (Priority: P2)

**Goal**: Asegurar que el relay use siempre la cuenta institucional existente, con autenticacion, validacion de duplicados y seguimiento de estados.

**Independent Test**: Con el relay configurado, registros repetidos de la misma huella se resuelven con idempotencia o duplicado, y cualquier intento sin configuracion/autorizacion valida queda bloqueado con mensaje claro.

### Implementation for User Story 2

- [X] T016 [US2] Endurecer la carga de secretos, signer institucional y CORS del relay en backend/lib/relay-config.js
- [X] T017 [P] [US2] Implementar autenticacion de operadores y rate limiting basico en backend/lib/relay-auth.js
- [X] T018 [P] [US2] Implementar validaciones de esquema, duplicado on-chain y autorizacion del emisor en backend/lib/relay-validation.js
- [X] T019 [P] [US2] Implementar seguimiento por `requestId`, idempotencia y estados terminales en backend/lib/relay-storage.js
- [X] T020 [US2] Completar la orquestacion de firma, envio, polling y clasificacion de resultados en backend/lib/relay-service.js
- [X] T021 [US2] Completar `POST /admin/register-hash` con respuestas `accepted`, `duplicate`, `failed` y `pending` en api/admin/register-hash.js
- [X] T022 [P] [US2] Completar `GET /admin/register-hash/{requestId}` para seguimiento estable del operador en api/admin/register-status.js
- [X] T023 [US2] Documentar despliegue del relay, variables restringidas y operacion institucional en README.md

**Checkpoint**: User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Verificacion publica on-chain intacta (Priority: P3)

**Goal**: Mantener la consulta publica directa a blockchain y separar claramente ese flujo del alta administrativa por relay.

**Independent Test**: Tras registrar una huella por el relay, cualquier usuario puede verificarla desde `verify.html` con el mismo comportamiento on-chain existente, incluso si el relay administrativo no esta disponible.

### Implementation for User Story 3

- [X] T024 [US3] Separar definitivamente el camino de escritura administrativa del acceso on-chain publico en frontend/js/blockchain-service.js
- [X] T025 [P] [US3] Ajustar la UI y mensajes de verificacion publica sin dependencia del relay en frontend/verify.html
- [X] T026 [P] [US3] Mantener la logica de consulta publica y presentacion de resultados intacta en frontend/js/verify.js
- [X] T027 [US3] Ampliar las fronteras de configuracion publica para incluir solo URL del relay y prohibir secretos en scripts/public-deploy-config.js
- [X] T028 [US3] Reforzar la validacion de configuracion publica y exclusiones inseguras del relay en scripts/validate-public-config.js

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar documentacion operativa, validacion manual y regresion transversal del feature.

- [X] T029 [P] Registrar el procedimiento final de arranque, validacion local y deploy del relay en specs/005-registro-admin-relay/quickstart.md
- [X] T030 [P] Ejecutar `npm run test:contract` y anotar el resultado operativo en specs/005-registro-admin-relay/quickstart.md
- [X] T031 [P] Ejecutar `npm run test:integration` y anotar el resultado operativo en specs/005-registro-admin-relay/quickstart.md
- [X] T032 Ejecutar validacion manual de registro administrativo sin MetaMask y documentar evidencia en specs/005-registro-admin-relay/quickstart.md
- [X] T033 [P] Consolidar checklist final de consistencia documental y fronteras del relay en specs/005-registro-admin-relay/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependency on other stories.
- **User Story 2 (P2)**: Can start after Foundational - builds on the relay infrastructure while remaining independently testable through API-level and UI-level registration outcomes.
- **User Story 3 (P3)**: Can start after Foundational - preserves the public verification path and should remain independently testable after any relay-backed registration exists.

### Within Each User Story

- Finish configuration and relay primitives before wiring UI flows.
- Complete each story's independent validation before moving to the next priority.
- Keep public verification changes isolated from administrative write-path changes.

### Parallel Opportunities

- Phase 1: T002 and T003 can run in parallel after T001 starts.
- Phase 2: T005, T006, T007, and T010 can run in parallel after T004 starts; T008 depends on T004-T007; T009 depends on T008.
- US1: T013 and T014 can run in parallel after T012 is defined; T015 follows once UI wiring is clear.
- US2: T017, T018, T019, and T022 can run in parallel after T016; T020 depends on T017-T019; T021 depends on T020.
- US3: T025 and T026 can run in parallel after T024; T027 and T028 proceed sequentially on the config scripts.
- Polish: T029, T030, T031, and T033 can run in parallel; T032 after the full flow is stable.

---

## Parallel Example: User Story 1

```bash
Task: "T013 [P] [US1] Adaptar el controlador de registro para enviar solicitudes al relay en frontend/js/register-controller.js"
Task: "T014 [P] [US1] Actualizar la logica de pantalla para generar idempotencyKey y consultar estado en frontend/js/register.js"
```

---

## Parallel Example: User Story 2

```bash
Task: "T017 [P] [US2] Implementar autenticacion de operadores y rate limiting basico en backend/lib/relay-auth.js"
Task: "T018 [P] [US2] Implementar validaciones de esquema, duplicado on-chain y autorizacion del emisor en backend/lib/relay-validation.js"
Task: "T019 [P] [US2] Implementar seguimiento por requestId e idempotencia en backend/lib/relay-storage.js"
```

---

## Parallel Example: User Story 3

```bash
Task: "T025 [P] [US3] Ajustar la UI y mensajes de verificacion publica en frontend/verify.html"
Task: "T026 [P] [US3] Mantener la logica de consulta publica intacta en frontend/js/verify.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate that an operator can register from the web without MetaMask.

### Incremental Delivery

1. Deliver Setup + Foundational to make the relay and public config boundaries operable.
2. Deliver US1 to unlock the operator web flow without software installation.
3. Deliver US2 to harden institutional emission, authentication, idempotency and status tracking.
4. Deliver US3 to preserve and harden public on-chain verification.
5. Finish with regression, manual validation and deployment evidence.

### Parallel Team Strategy

1. Developer A: relay backend in `backend/lib/` and `api/admin/`.
2. Developer B: operator registration UI in `frontend/register.html`, `frontend/js/register-controller.js`, and `frontend/js/register.js`.
3. Developer C: public config boundaries, verification flow and operational documentation in `scripts/`, `README.md`, and `specs/005-registro-admin-relay/quickstart.md`.

---

## Notes

- All tasks follow the required checklist format with sequential IDs, optional `[P]`, and `[USx]` labels only in story phases.
- Task descriptions include exact file paths and are directly actionable.
- Suggested MVP scope: complete Phases 1-3 to deliver the operator flow without MetaMask.
