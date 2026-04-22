# Tasks: Mejorar Frontend Home

**Input**: Design documents from /specs/002-mejorar-frontend-home/
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se solicito TDD ni creacion de nuevos tests automatizados en el spec. Se incluyen tareas de validacion manual y regresion con pruebas existentes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: [ID] [P?] [Story] Description

- [P]: Can run in parallel (different files, no dependencies)
- [Story]: Which user story this task belongs to (US1, US2, US3)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar criterios de validacion y contexto de trabajo para ejecutar el cambio visual sin ampliar alcance.

- [x] T001 Ajustar checklist de ejecucion local y validacion del feature en specs/002-mejorar-frontend-home/quickstart.md
- [x] T002 [P] Consolidar criterios de aceptacion visual y de contenido del home en specs/002-mejorar-frontend-home/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Definir la base visual y estructural compartida que bloquea todas las historias.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Implementar ajustes globales de jerarquia tipografica y ritmo de espaciado en frontend/css/app.css
- [x] T004 [P] Implementar reglas base de coherencia de tarjetas y profundidad visual usando la paleta existente en frontend/css/app.css
- [x] T005 Definir la ubicacion estructural de la seccion author dentro del flujo del home en frontend/index.html
- [x] T006 [P] Alinear contrato de lineamientos visuales con las reglas base del feature en specs/002-mejorar-frontend-home/contracts/frontend-visual-guidelines.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Home con identidad del proyecto (Priority: P1) 🎯 MVP

**Goal**: Mostrar en el home una seccion explicita de identidad academica del autor con contenido obligatorio.

**Independent Test**: Al abrir el home, existe una seccion visible dedicada al autor y se leen exactamente los textos requeridos.

### Implementation for User Story 1

- [x] T007 [US1] Insertar la seccion de identidad del autor con texto requerido en frontend/index.html
- [x] T008 [P] [US1] Estilizar la author card para legibilidad y jerarquia del bloque de identidad en frontend/css/app.css
- [x] T009 [US1] Ajustar semantica y accesibilidad del bloque author (etiquetas/aria/estructura) en frontend/index.html
- [x] T010 [US1] Actualizar contrato de contenido del home con la estructura final de author section en specs/002-mejorar-frontend-home/contracts/frontend-home-content.md

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Apariencia menos artificial manteniendo identidad visual (Priority: P2)

**Goal**: Reducir la sensacion artificial del frontend manteniendo la misma paleta de color.

**Independent Test**: El home se percibe visualmente mas natural y no introduce una nueva familia de color dominante.

### Implementation for User Story 2

- [x] T011 [US2] Refinar composicion visual del hero (tipografia, espaciado y balance) en frontend/css/app.css
- [x] T012 [US2] Refinar composicion visual de info cards para una lectura menos rigida en frontend/css/app.css
- [x] T013 [US2] Implementar mejoras de textura/profundidad sutiles sin cambiar paleta base en frontend/css/app.css
- [x] T014 [P] [US2] Registrar decisiones finales de estilo y restricciones en specs/002-mejorar-frontend-home/research.md

**Checkpoint**: User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Coherencia visual en la portada (Priority: P3)

**Goal**: Integrar la nueva seccion personal en el home con consistencia visual y comportamiento responsive.

**Independent Test**: En escritorio y movil, la seccion personal se integra con el resto del home sin romper legibilidad ni alineaciones.

### Implementation for User Story 3

- [x] T015 [US3] Integrar posicion final de la author section entre hero e info grid principal en frontend/index.html
- [x] T016 [P] [US3] Implementar reglas responsive de author section para movil y zoom en frontend/css/app.css
- [x] T017 [US3] Incorporar validaciones de edge cases responsive/zoom en specs/002-mejorar-frontend-home/quickstart.md
- [x] T018 [P] [US3] Sincronizar contrato visual con criterios de coherencia final en specs/002-mejorar-frontend-home/contracts/frontend-visual-guidelines.md

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre de calidad transversal y validacion final del feature.

- [x] T019 [P] Ejecutar regresion existente con npm run test:integration y documentar resultado en specs/002-mejorar-frontend-home/quickstart.md
- [x] T020 Ejecutar validacion manual completa del home y registrar evidencia de cumplimiento en specs/002-mejorar-frontend-home/quickstart.md
- [x] T021 [P] Realizar limpieza final de reglas CSS redundantes o conflictivas en frontend/css/app.css
- [x] T022 [P] Realizar revision final de contenido visible del home para asegurar textos requeridos en frontend/index.html

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies - can start immediately.
- Foundational (Phase 2): Depends on Setup completion - BLOCKS all user stories.
- User Stories (Phase 3+): All depend on Foundational phase completion.
- Polish (Phase 6): Depends on all user stories being complete.

### User Story Dependencies

- User Story 1 (P1): Can start after Foundational - no dependency on other stories.
- User Story 2 (P2): Can start after Foundational - independent from US1 at implementation level.
- User Story 3 (P3): Can start after Foundational - validates integration/coherence over home and benefits from US1 and US2 complete.

### Within Each User Story

- Estructura y contenido primero (HTML), ajustes visuales despues (CSS), cierre documental al final (contracts/research/quickstart).
- Cada historia debe poder validarse por su criterio independiente antes de avanzar.

### Parallel Opportunities

- Phase 1: T002 can run in parallel with T001.
- Phase 2: T004 and T006 can run in parallel after T003 starts.
- US1: T008 can run in parallel with T007.
- US2: T014 can run in parallel with T011-T013.
- US3: T016 and T018 can run in parallel with T015.
- Polish: T019, T021, and T022 can run in parallel; T020 after cambios estabilizados.

---

## Parallel Example: User Story 1

```bash
Task: "T007 Insertar la seccion de identidad del autor con texto requerido en frontend/index.html"
Task: "T008 Estilizar la author card para legibilidad y jerarquia del bloque de identidad en frontend/css/app.css"
```

---

## Parallel Example: User Story 2

```bash
Task: "T011 Refinar composicion visual del hero en frontend/css/app.css"
Task: "T014 Registrar decisiones finales de estilo y restricciones en specs/002-mejorar-frontend-home/research.md"
```

---

## Parallel Example: User Story 3

```bash
Task: "T015 Integrar posicion final de la author section en frontend/index.html"
Task: "T016 Implementar reglas responsive de author section para movil y zoom en frontend/css/app.css"
Task: "T018 Sincronizar contrato visual con criterios de coherencia final en specs/002-mejorar-frontend-home/contracts/frontend-visual-guidelines.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate User Story 1 independently on home.

### Incremental Delivery

1. Setup + Foundational establish visual baseline and guardrails.
2. Deliver US1 (contenido del autor en home).
3. Deliver US2 (naturalidad visual con paleta intacta).
4. Deliver US3 (coherencia y responsive final).
5. Final polish with regression + manual validation evidence.

### Parallel Team Strategy

With multiple developers:

1. Developer A: HTML structure tasks in frontend/index.html.
2. Developer B: CSS visual/refinement tasks in frontend/css/app.css.
3. Developer C: Documentation/contracts/quickstart updates in specs/002-mejorar-frontend-home/.

---

## Notes

- All tasks follow the required checklist format with ID, optional [P], and [USx] labels only in user story phases.
- Task descriptions include explicit file paths and are immediately executable.
- MVP scope suggested: Phase 3 (US1) after completing Setup and Foundational.
