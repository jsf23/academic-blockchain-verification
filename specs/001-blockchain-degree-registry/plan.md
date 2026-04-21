# Implementation Plan: Blockchain Degree Registry

**Branch**: `[001-blockchain-degree-registry]` | **Date**: 2026-04-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-blockchain-degree-registry/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Construir un prototipo TRL 5 para registro y validacion de titulos academicos sobre blockchain local, con un contrato inteligente de registro inmutable, una interfaz web estatica de alta calidad para emision y verificacion, y una integracion directa por Web3.js sin backend intermedio. La solucion prioriza simplicidad operativa en Windows, privacidad mediante almacenamiento exclusivo de hashes SHA-256, y una UX clara para usuarios no tecnicos.

## Technical Context

**Language/Version**: JavaScript (Node.js 22 LTS) para tooling y frontend; Solidity 0.8.x para el contrato inteligente  
**Primary Dependencies**: Web3.js, Ganache UI, Solidity compiler toolchain, lightweight static server for local UI hosting  
**Storage**: Blockchain state on local Ganache network; static frontend assets on filesystem; no external database  
**Testing**: Automated contract/integration tests in JavaScript plus manual acceptance validation in Ganache UI on Windows  
**Target Platform**: Windows desktop for local demonstration, modern desktop browser with injected wallet or local provider access  
**Project Type**: Web application with smart contract and static frontend  
**Performance Goals**: Verification result rendered in under 10 seconds end-to-end during local prototype testing; registration feedback returned within a single transaction confirmation cycle  
**Constraints**: No backend intermediary, no PII on-chain, SHA-256 as the only document fingerprint algorithm, native Windows-friendly workflow, low-complexity architecture, accessible UX for non-technical users  
**Scale/Scope**: Single-institution-to-multi-institution prototype on local blockchain, low transaction volume for demonstrations, two main UI flows, one core contract, one local network

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `PASS`: Technical simplicity preserved through a static frontend, one registry contract, and no backend service.
- `PASS`: Cryptographic truth preserved by standardizing all certificate fingerprints on SHA-256 before on-chain submission.
- `PASS`: Direct Web3 integration preserved by connecting the UI directly to the local blockchain via Web3.js.
- `PASS`: Contract-first approach preserved by defining smart contract interfaces and UI interaction contracts in `contracts/` before implementation.
- `PASS`: Local validation preserved by targeting Ganache UI on Windows for acceptance and demonstration.
- `PASS`: Data sovereignty preserved because only hashes and issuer metadata are stored on-chain; no PII is part of the design.
- `PASS`: Accessibility preserved by requiring plain-language feedback, visible status states, and minimal technical jargon in the UI.

**Post-Design Re-Check**: PASS. The designed artifacts (`research.md`, `data-model.md`, `contracts/`, and `quickstart.md`) keep the architecture lean, maintain direct Web3.js usage, constrain the ledger to SHA-256 proofs only, and avoid introducing backend persistence or PII exposure.

## Project Structure

### Documentation (this feature)

```text
specs/001-blockchain-degree-registry/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── registry-smart-contract.md
│   └── frontend-behavior.md
└── tasks.md
```

### Source Code (repository root)

```text
contracts/
└── AcademicIntegrityRegistry.sol

scripts/
├── deploy.js
└── seed-authorized-issuers.js

frontend/
├── index.html
├── register.html
├── verify.html
├── css/
│   └── app.css
└── js/
    ├── app.js
    ├── register.js
    ├── verify.js
    ├── blockchain-service.js
    └── hash-service.js

tests/
├── contract/
│   └── registry.test.js
└── integration/
    └── ui-flow.test.js
```

**Structure Decision**: Se adopta una aplicacion web estatica con un contrato inteligente y scripts Node.js de soporte. Esta estructura mantiene el sistema pequeno, permite usar JavaScript en casi toda la solucion, y deja Solidity como una dependencia acotada e inevitable del entorno EVM.

## Complexity Tracking

No constitutional violations identified.
