# Tasks: Blockchain Degree Registry

**Input**: Design documents from `/specs/001-blockchain-degree-registry/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include automated contract and integration tests because the implementation plan explicitly requires automated JavaScript testing in addition to manual Ganache validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the JavaScript project, smart contract tooling, static frontend scaffolding, and local development commands.

- [x] T001 Create base project folders `contracts/`, `scripts/`, `frontend/css/`, `frontend/js/`, `tests/contract/`, and `tests/integration/`
- [x] T002 Initialize `package.json` with JavaScript scripts for deploy, start, and test at `package.json`
- [x] T003 [P] Add project dependencies and developer tooling configuration in `package.json`
- [x] T004 [P] Create local environment template for Ganache RPC, contract address, and issuer accounts in `.env.example`
- [x] T005 Create static frontend entry pages in `frontend/index.html`, `frontend/register.html`, and `frontend/verify.html`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared blockchain, hashing, and deployment foundation required by all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 Create the core registry contract skeleton with issuer authorization state in `contracts/AcademicIntegrityRegistry.sol`
- [x] T007 [P] Implement deployment workflow that compiles and deploys the contract in `scripts/deploy.js`
- [x] T008 [P] Implement authorized issuer seed script in `scripts/seed-authorized-issuers.js`
- [x] T009 [P] Implement shared Web3 connection and contract access helpers in `frontend/js/blockchain-service.js`
- [x] T010 [P] Implement browser-side SHA-256 file hashing utilities in `frontend/js/hash-service.js`
- [x] T011 Create shared frontend bootstrap and configuration loading in `frontend/js/app.js`
- [x] T012 Establish reusable visual system, accessibility helpers, and status components in `frontend/css/app.css`
- [x] T013 Create contract deployment and UI startup documentation updates aligned with local Windows workflow in `README.md`

**Checkpoint**: Foundation ready. User story implementation can now begin.

---

## Phase 3: User Story 1 - Registrar huella de un titulo (Priority: P1) 🎯 MVP

**Goal**: Allow an authorized academic institution to hash a certificate client-side and register its fingerprint immutably on-chain.

**Independent Test**: An authorized issuer can upload a file, see the generated SHA-256 hash, submit it successfully, and observe that duplicate and unauthorized issuance attempts are rejected.

### Tests for User Story 1 ⚠️

> **NOTE**: Write these tests first and ensure they fail before implementation.

- [x] T014 [P] [US1] Add contract tests for authorized issuance, unauthorized rejection, and duplicate rejection in `tests/contract/registry.test.js`
- [x] T015 [P] [US1] Add integration test for the registration journey in `tests/integration/ui-flow.test.js`

### Implementation for User Story 1

- [x] T016 [US1] Implement `issueCertificate` logic, duplicate protection, and `NewRegistration` event emission in `contracts/AcademicIntegrityRegistry.sol`
- [x] T017 [US1] Extend deployment script to register initial authorized issuers and export contract metadata in `scripts/deploy.js`
- [x] T018 [P] [US1] Build registration page structure with upload, wallet, and confirmation sections in `frontend/register.html`
- [x] T019 [P] [US1] Implement registration-specific interaction styles and transaction feedback states in `frontend/css/app.css`
- [x] T020 [US1] Implement registration flow orchestration, file hashing, and issuance submission in `frontend/js/register.js`
- [x] T021 [US1] Integrate issuer authorization, duplicate error mapping, and confirmation rendering in `frontend/js/blockchain-service.js`
- [x] T022 [US1] Add sample demo instructions for issuer registration flow in `specs/001-blockchain-degree-registry/quickstart.md`

**Checkpoint**: User Story 1 should be fully functional and independently testable.

---

## Phase 4: User Story 2 - Verificar autenticidad de un titulo (Priority: P2)

**Goal**: Allow any verifier to submit a certificate hash and receive a clear authenticity result with issuer and issuance metadata.

**Independent Test**: A user can verify both a known hash and an unknown hash from the public screen without using any issuer privileges.

### Tests for User Story 2 ⚠️

- [x] T023 [P] [US2] Add contract tests for positive and negative verification lookups in `tests/contract/registry.test.js`
- [x] T024 [P] [US2] Add integration test for the public verification journey in `tests/integration/ui-flow.test.js`

### Implementation for User Story 2

- [x] T025 [US2] Implement `verifyCertificate` return behavior for found and missing records in `contracts/AcademicIntegrityRegistry.sol`
- [x] T026 [P] [US2] Build verification page structure with hash input and results panel in `frontend/verify.html`
- [x] T027 [P] [US2] Add verification result states and visual status treatments in `frontend/css/app.css`
- [x] T028 [US2] Implement verification input validation and result rendering in `frontend/js/verify.js`
- [x] T029 [US2] Extend blockchain query helpers and issuer metadata mapping in `frontend/js/blockchain-service.js`
- [x] T030 [US2] Add navigation entry points for public verification in `frontend/index.html`
- [x] T031 [US2] Update quickstart verification steps and expected results in `specs/001-blockchain-degree-registry/quickstart.md`

**Checkpoint**: User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Interpretar el resultado sin conocimientos tecnicos (Priority: P3)

**Goal**: Make the registration and verification experience understandable and trustworthy for non-technical users.

**Independent Test**: A non-technical user can complete registration or verification and correctly interpret the outcome using only on-screen guidance.

### Tests for User Story 3 ⚠️

- [x] T032 [P] [US3] Add integration assertions for plain-language messaging and visible status states in `tests/integration/ui-flow.test.js`

### Implementation for User Story 3

- [x] T033 [P] [US3] Add high-clarity landing content and step guidance in `frontend/index.html`
- [x] T034 [P] [US3] Refine typography, spacing, responsive layout, and visual hierarchy for accessibility in `frontend/css/app.css`
- [x] T035 [US3] Replace technical error wording with plain-language guidance in `frontend/js/register.js`
- [x] T036 [US3] Replace technical verification wording with plain-language guidance in `frontend/js/verify.js`
- [x] T037 [US3] Centralize reusable human-readable status and error messages in `frontend/js/app.js`
- [x] T038 [US3] Document non-technical demo script and interpretation guidance in `README.md`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, consistency, and acceptance validation across the whole feature.

- [x] T039 [P] Run full automated test pass and stabilize failures in `tests/contract/registry.test.js` and `tests/integration/ui-flow.test.js`
- [x] T040 [P] Validate local Ganache deployment flow and update any environment notes in `specs/001-blockchain-degree-registry/quickstart.md`
- [x] T041 Review contract and frontend outputs to confirm no PII is stored or displayed in `contracts/AcademicIntegrityRegistry.sol`, `frontend/js/register.js`, and `frontend/js/verify.js`
- [x] T042 [P] Perform code cleanup and final consistency pass across `scripts/deploy.js`, `scripts/seed-authorized-issuers.js`, `frontend/js/blockchain-service.js`, and `frontend/js/hash-service.js`
- [x] T043 [P] Update final implementation notes and usage guidance in `README.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies, can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and can start after or alongside US1, though demo flow benefits from US1 being available first.
- **User Story 3 (Phase 5)**: Depends on Foundational completion and should be applied after the core registration and verification screens exist.
- **Polish (Phase 6)**: Depends on all targeted user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other user stories.
- **User Story 2 (P2)**: No strict dependency on US1 for implementation, but its strongest acceptance test uses a hash produced by the registration flow.
- **User Story 3 (P3)**: Depends on the presence of registration and verification UI flows to refine messaging and usability.

### Within Each User Story

- Tests must be written and fail before implementation.
- Smart contract behavior before UI wiring that depends on it.
- HTML and CSS scaffolding before flow-specific JavaScript polish.
- Update quickstart and docs after the feature behavior is stable.

### Parallel Opportunities

- `T003`, `T004`, and `T005` can run in parallel after project initialization starts.
- `T007`, `T008`, `T009`, `T010`, and `T012` can run in parallel after the contract skeleton exists.
- In US1, `T018` and `T019` can run in parallel while contract work proceeds.
- In US2, `T026` and `T027` can run in parallel while query logic is implemented.
- In US3, `T033` and `T034` can run in parallel before message integration tasks.
- Polish tasks `T039`, `T040`, `T042`, and `T043` can run in parallel once implementation stabilizes.

---

## Parallel Example: User Story 1

```bash
# Parallel test and UI scaffolding work for User Story 1
Task: "Add contract tests for authorized issuance, unauthorized rejection, and duplicate rejection in tests/contract/registry.test.js"
Task: "Add integration test for the registration journey in tests/integration/ui-flow.test.js"
Task: "Build registration page structure with upload, wallet, and confirmation sections in frontend/register.html"
Task: "Implement registration-specific interaction styles and transaction feedback states in frontend/css/app.css"
```

---

## Parallel Example: User Story 2

```bash
# Parallel verification UI work after foundational services exist
Task: "Add contract tests for positive and negative verification lookups in tests/contract/registry.test.js"
Task: "Build verification page structure with hash input and results panel in frontend/verify.html"
Task: "Add verification result states and visual status treatments in frontend/css/app.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Validate that authorized issuance works and duplicate or unauthorized issuance fails.
5. Demo the prototype as an issuer-only MVP if needed.

### Incremental Delivery

1. Setup + Foundational create a stable blockchain and frontend base.
2. Add User Story 1 to deliver on-chain issuance.
3. Add User Story 2 to deliver public verification.
4. Add User Story 3 to improve clarity, trust, and usability for non-technical audiences.
5. Finish with cross-cutting validation against quickstart and constitution constraints.

### Parallel Team Strategy

With multiple developers:

1. One developer handles contract and deployment foundation.
2. One developer handles frontend structure and visual system.
3. Once the foundation is complete:
   - Developer A: US1 issuance flow
   - Developer B: US2 verification flow
   - Developer C: US3 usability and content refinement

---

## Notes

- All tasks follow the required checklist format with IDs, optional parallel markers, story labels where required, and exact file paths.
- The task order preserves contract-first implementation while still enabling incremental UI delivery.
- The MVP scope is User Story 1 only.
- The highest-value demo path is: deploy locally, issue a certificate hash, verify that hash publicly, then refine the UX for non-technical stakeholders.