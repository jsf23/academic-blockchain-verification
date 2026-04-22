# Tasks: Deploy Gratuito GitHub

**Input**: Design documents from `/specs/004-deploy-gratuito-github/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: El spec no solicita TDD ni nuevas suites automatizadas. Se incluyen tareas de regresion con las pruebas existentes y validacion manual post-deploy.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- `[P]`: Can run in parallel (different files, no dependencies)
- `[Story]`: Which user story this task belongs to (US1, US2, US3)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar el contexto operativo y la guia base para el despliegue gratuito desde GitHub.

- [X] T001 Consolidar prerrequisitos de despliegue gratuito y criterios de cierre en specs/004-deploy-gratuito-github/quickstart.md
- [X] T002 [P] Alinear el contrato de workflow con el flujo objetivo de GitHub Pages en specs/004-deploy-gratuito-github/contracts/deployment-workflow-contract.md
- [X] T003 [P] Alinear limites de configuracion publica y restringida para despliegue web en specs/004-deploy-gratuito-github/contracts/public-config-boundaries.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Montar la infraestructura minima de publicacion y validacion que bloquea todas las historias.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Crear workflow base de GitHub Pages para build y deploy en .github/workflows/deploy-pages.yml
- [X] T005 [P] Crear script de empaquetado del sitio estatico publicable en scripts/build-pages-artifact.js
- [X] T006 [P] Exponer comandos de empaquetado y validacion de publicacion en package.json
- [X] T007 Documentar configuracion global de despliegue, Pages y fuente oficial del sitio en README.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Publicar version en internet gratis (Priority: P1) 🎯 MVP

**Goal**: Obtener una URL publica gratuita accesible para home, registro y verificacion usando GitHub Pages.

**Independent Test**: Tras ejecutar el flujo definido desde GitHub, existe una URL publica funcional que carga `/`, `/register.html` y `/verify.html`.

### Implementation for User Story 1

- [X] T008 [US1] Implementar ensamblado del artefacto final de Pages con HTML, CSS, JS y config publica en scripts/build-pages-artifact.js
- [X] T009 [US1] Configurar publicacion del artefacto del frontend en GitHub Pages dentro de .github/workflows/deploy-pages.yml
- [X] T010 [P] [US1] Documentar primera publicacion gratuita paso a paso en README.md
- [X] T011 [US1] Definir checklist de validacion de URL publica y navegacion basica en specs/004-deploy-gratuito-github/quickstart.md

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Mantener despliegues repetibles desde GitHub (Priority: P2)

**Goal**: Hacer que las actualizaciones del sitio publicado se repitan desde GitHub sin pasos ocultos ni variaciones manuales.

**Independent Test**: Un cambio pequeno aprobado en el repositorio puede republicarse con el mismo flujo documentado y reflejarse en la URL publica.

### Implementation for User Story 2

- [X] T012 [US2] Añadir reglas de trigger, permisos y concurrencia para actualizaciones repetibles en .github/workflows/deploy-pages.yml
- [X] T013 [P] [US2] Hacer determinista el empaquetado del frontend para cada revision publicada en scripts/build-pages-artifact.js
- [X] T014 [P] [US2] Exponer comandos operativos repetibles de build/deploy docs en package.json
- [X] T015 [US2] Documentar flujo de actualizacion rutinaria desde cambios aprobados en GitHub en README.md
- [X] T016 [US2] Documentar rollback a una revision estable previa y reaplicacion de validacion en specs/004-deploy-gratuito-github/quickstart.md

**Checkpoint**: User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Proteger configuracion sensible en despliegue publico (Priority: P3)

**Goal**: Evitar que secretos o configuraciones locales indebidas lleguen al repositorio o al deploy publico.

**Independent Test**: Antes de publicar, el flujo rechaza configuracion insegura o incompleta y la documentacion deja claro que datos son publicos y cuales no.

### Implementation for User Story 3

- [X] T017 [US3] Crear validacion de configuracion publica requerida para Pages en scripts/validate-public-config.js
- [X] T018 [P] [US3] Integrar la validacion de configuracion publica antes del deploy en .github/workflows/deploy-pages.yml
- [X] T019 [P] [US3] Ajustar plantilla de runtime config publico para despliegues web en frontend/contract-config.template.json
- [X] T020 [US3] Reforzar exclusion y revision de archivos sensibles para publicacion en .gitignore
- [X] T021 [US3] Documentar reglas de seguridad, revision de secretos y fronteras de configuracion en README.md
- [X] T022 [P] [US3] Incorporar checklist de revision previa a publicacion segura en specs/004-deploy-gratuito-github/quickstart.md

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validar la solucion completa, dejar evidencia operativa y cerrar consistencia transversal.

- [X] T023 [P] Ejecutar regresion existente con npm run test:integration y registrar resultado en specs/004-deploy-gratuito-github/quickstart.md
- [X] T024 [P] Ejecutar regresion existente con npm run test:contract y registrar resultado en specs/004-deploy-gratuito-github/quickstart.md
- [ ] T025 Ejecutar validacion final post-deploy de URL publica, rutas y coherencia de configuracion en specs/004-deploy-gratuito-github/quickstart.md
- [X] T026 [P] Realizar revision final de consistencia entre README.md, .github/workflows/deploy-pages.yml y specs/004-deploy-gratuito-github/contracts/deployment-workflow-contract.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies - can start immediately.
- Foundational (Phase 2): Depends on Setup completion - BLOCKS all user stories.
- User Stories (Phase 3+): All depend on Foundational phase completion.
- Polish (Phase 6): Depends on all user stories being complete.

### User Story Dependencies

- User Story 1 (P1): Can start after Foundational - no dependency on other stories.
- User Story 2 (P2): Can start after Foundational - builds on the same workflow surface but remains independently testable through a republish cycle.
- User Story 3 (P3): Can start after Foundational - hardens configuration and publication safety around the same deploy path.

### Within Each User Story

- Implement workflow/script changes before final documentation for that story.
- Validate publish path before documenting it as the official maintainer flow.
- Complete each story's independent validation before moving to the next priority.

### Parallel Opportunities

- Phase 1: T002 and T003 can run in parallel with T001.
- Phase 2: T005 and T006 can run in parallel after T004 starts.
- US1: T010 can run in parallel with T008-T009.
- US2: T013 and T014 can run in parallel after T012.
- US3: T018, T019, and T022 can run in parallel after T017.
- Polish: T023, T024, and T026 can run in parallel; T025 after deploy path is stable.

---

## Parallel Example: User Story 1

```bash
Task: "T008 [US1] Implementar ensamblado del artefacto final de Pages en scripts/build-pages-artifact.js"
Task: "T010 [P] [US1] Documentar primera publicacion gratuita paso a paso en README.md"
```

---

## Parallel Example: User Story 2

```bash
Task: "T013 [P] [US2] Hacer determinista el empaquetado del frontend en scripts/build-pages-artifact.js"
Task: "T014 [P] [US2] Exponer comandos operativos repetibles de build/deploy docs en package.json"
```

---

## Parallel Example: User Story 3

```bash
Task: "T018 [P] [US3] Integrar la validacion de configuracion publica antes del deploy en .github/workflows/deploy-pages.yml"
Task: "T019 [P] [US3] Ajustar plantilla de runtime config publico en frontend/contract-config.template.json"
Task: "T022 [P] [US3] Incorporar checklist de revision previa a publicacion segura en specs/004-deploy-gratuito-github/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate that a public GitHub Pages URL serves the three main pages.

### Incremental Delivery

1. Deliver Setup + Foundational to make deployment possible.
2. Deliver US1 to obtain the first free public site.
3. Deliver US2 to make routine updates repeatable from GitHub.
4. Deliver US3 to harden public config boundaries and secret review.
5. Finish with regression and post-deploy validation evidence.

### Parallel Team Strategy

1. Developer A: workflow and publish automation in .github/workflows/deploy-pages.yml.
2. Developer B: artifact/config validation scripts in scripts/ and package.json.
3. Developer C: maintainer documentation and validation evidence in README.md and specs/004-deploy-gratuito-github/.

---

## Notes

- All tasks follow the required checklist format with sequential IDs, optional `[P]`, and `[USx]` labels only in story phases.
- Task descriptions include exact file paths and are directly actionable.
- Suggested MVP scope: complete Phases 1-3 to obtain the first public deployment.