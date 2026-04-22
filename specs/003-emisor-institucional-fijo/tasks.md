# Tasks: Emisor Institucional Fijo

**Input**: Design documents from `/specs/003-emisor-institucional-fijo/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se solicito enfoque TDD en el spec. Se incluyen tareas de regresion con pruebas existentes, sin crear suites nuevas.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- `[P]`: Can run in parallel (different files, no dependencies)
- `[Story]`: Which user story this task belongs to (US1, US2, US3)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar configuracion base y artefactos de runtime para soportar emisor institucional fijo.

- [X] T001 Agregar `institutionalIssuerAddress` al esquema base en frontend/contract-config.template.json
- [X] T002 Exponer `institutionalIssuerAddress` desde variables de entorno en scripts/build-frontend-config.js
- [X] T003 [P] Documentar la variable de emisor institucional en README.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implementar cimientos compartidos de configuracion y consumo runtime antes de tocar historias.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Añadir `institutionalIssuerAddress` al `DEFAULT_CONFIG` en frontend/js/app.js
- [X] T005 [P] Validar shape de runtime config con contrato vigente en specs/003-emisor-institucional-fijo/contracts/frontend-runtime-config-contract.md
- [X] T006 [P] Actualizar guia de preparacion de config por entorno en specs/003-emisor-institucional-fijo/quickstart.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Registro con cuenta institucional unica (Priority: P1) 🎯 MVP

**Goal**: El flujo de registro debe usar siempre la cuenta institucional configurada, sin seleccion manual.

**Independent Test**: Desde register, se puede registrar una huella valida y el emisor final coincide con la cuenta institucional fija sin pasos de seleccion de cuenta.

### Implementation for User Story 1

- [X] T007 [US1] Eliminar controles de carga/seleccion manual de cuentas en frontend/register.html
- [X] T008 [US1] Convertir el campo de emisor institucional a solo lectura en frontend/register.html
- [X] T009 [US1] Consumir `institutionalIssuerAddress` y fijar `issuerAddress` en frontend/js/register.js
- [X] T010 [US1] Retirar listeners y handlers de seleccion manual de cuentas en frontend/js/register.js
- [X] T011 [P] [US1] Alinear mensaje de error por emisor ausente al flujo institucional en frontend/js/register.js

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Transparencia de la identidad emisora (Priority: P2)

**Goal**: El operador ve claramente la cuenta institucional activa antes de enviar y entiende bloqueos por configuracion.

**Independent Test**: En register se visualiza la cuenta institucional activa como referencia operativa; si falta configuracion, el bloqueo es claro y previo al envio.

### Implementation for User Story 2

- [X] T012 [US2] Mostrar bloque de referencia de cuenta institucional activa en frontend/register.html
- [X] T013 [US2] Mostrar aviso explicito cuando falta `institutionalIssuerAddress` en frontend/js/register.js
- [X] T014 [P] [US2] Ajustar copys de guidance operativa para emisor institucional en frontend/js/register.js
- [X] T015 [P] [US2] Sincronizar criterios de visibilidad/solo lectura en specs/003-emisor-institucional-fijo/contracts/frontend-institutional-issuer-behavior.md

**Checkpoint**: User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Validacion de autorizacion institucional (Priority: P3)

**Goal**: Solo una cuenta institucional valida y autorizada logra registrar; los fallos entregan mensajes accionables.

**Independent Test**: Con cuenta institucional autorizada se confirma registro; con cuenta no autorizada o invalida se bloquea/rechaza con causa clara.

### Implementation for User Story 3

- [X] T016 [US3] Validar formato de direccion institucional antes de submit en frontend/js/register.js
- [X] T017 [US3] Bloquear submit cuando la cuenta institucional no esta configurada o es invalida en frontend/js/register.js
- [X] T018 [US3] Mantener pre-check de autorizacion con mensaje especifico para institucional no autorizada en frontend/js/register.js
- [X] T019 [P] [US3] Homologar reglas de negocio del controlador puro con flujo institucional en frontend/js/register-controller.js
- [X] T020 [P] [US3] Actualizar semantica de errores operativos institucionales en frontend/js/blockchain-service.js

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar consistencia documental y validar regresion del feature completo.

- [X] T021 [P] Ejecutar regresion automatizada existente con `npm run test:integration` en tests/integration/ui-flow.test.js
- [X] T022 [P] Ejecutar regresion de contrato con `npm run test:contract` en tests/contract/registry.test.js
- [X] T023 Consolidar evidencia de validacion manual y tecnica en specs/003-emisor-institucional-fijo/quickstart.md
- [X] T024 Revisar mensajes y contenido final del flujo institucional en frontend/register.html

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies - can start immediately.
- Foundational (Phase 2): Depends on Setup completion - BLOCKS all user stories.
- User Stories (Phase 3+): All depend on Foundational phase completion.
- Polish (Phase 6): Depends on all user stories being complete.

### User Story Dependencies

- User Story 1 (P1): Can start after Foundational - no dependency on other stories.
- User Story 2 (P2): Can start after Foundational - independent but uses the fixed-flow base from US1 artifacts.
- User Story 3 (P3): Can start after Foundational - validates and hardens authorization/error semantics over the fixed institutional flow.

### Within Each User Story

- Estructura de UI primero (HTML), luego comportamiento (JS), luego mensajes/contratos.
- Validaciones de bloqueo antes de refinamientos de copy.
- Completar criterios de prueba independiente por historia antes de avanzar.

### Parallel Opportunities

- Phase 1: T003 can run in parallel with T001-T002.
- Phase 2: T005 and T006 can run in parallel after T004.
- US1: T011 can run in parallel after T009.
- US2: T014 and T015 can run in parallel after T012-T013.
- US3: T019 and T020 can run in parallel after T016-T018.
- Polish: T021 and T022 can run in parallel; T023 after resultados.

---

## Parallel Example: User Story 1

```bash
Task: "T009 [US1] Consumir institutionalIssuerAddress y fijar issuerAddress en frontend/js/register.js"
Task: "T011 [P] [US1] Alinear mensaje de error por emisor ausente al flujo institucional en frontend/js/register.js"
```

---

## Parallel Example: User Story 2

```bash
Task: "T014 [P] [US2] Ajustar copys de guidance operativa para emisor institucional en frontend/js/register.js"
Task: "T015 [P] [US2] Sincronizar criterios de visibilidad/solo lectura en specs/003-emisor-institucional-fijo/contracts/frontend-institutional-issuer-behavior.md"
```

---

## Parallel Example: User Story 3

```bash
Task: "T019 [P] [US3] Homologar reglas de negocio del controlador puro con flujo institucional en frontend/js/register-controller.js"
Task: "T020 [P] [US3] Actualizar semantica de errores operativos institucionales en frontend/js/blockchain-service.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. STOP and validate User Story 1 independently from `register.html`.

### Incremental Delivery

1. Deliver Setup + Foundational for config/runtime readiness.
2. Deliver US1 to enforce institutional fixed issuer flow (MVP).
3. Deliver US2 to improve operator transparency and blocked-state clarity.
4. Deliver US3 to harden authorization and error semantics.
5. Execute Polish phase for regression and final evidence.

### Parallel Team Strategy

1. Developer A: HTML/UI changes in frontend/register.html.
2. Developer B: Runtime/config and flow logic in frontend/js/app.js, frontend/js/register.js, scripts/build-frontend-config.js.
3. Developer C: Controller alignment and docs in frontend/js/register-controller.js and specs/003-emisor-institucional-fijo/.

---

## Notes

- `[P]` tasks indicate no blocking dependency with same-stage tasks.
- `[USx]` labels are used only in user-story phases.
- Every task is written as an actionable change with concrete file path.
- This plan avoids new test-suite creation and uses existing regression commands.
