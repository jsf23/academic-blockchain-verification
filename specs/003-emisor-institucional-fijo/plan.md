# Implementation Plan: Emisor Institucional Fijo

**Branch**: `003-run-git-feature` | **Date**: 2026-04-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-emisor-institucional-fijo/spec.md`

## Summary

Implementar un flujo de registro con emisor institucional unico y fijo por entorno, eliminando la seleccion manual de cuenta en UI. La solucion se centra en: (1) configuracion runtime explicita del emisor institucional, (2) bloqueo temprano cuando la configuracion no es valida o no autorizada, y (3) mantenimiento del flujo actual de hash y verificacion sin cambios en contrato.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ESM (Node.js 22 para scripts)  
**Primary Dependencies**: Web3.js 4.16, dotenv 16.4, frontend estatico existente  
**Storage**: N/A (sin persistencia nueva; configuracion runtime en `frontend/contract-config.json`)  
**Testing**: Mocha + Chai (`tests/integration/ui-flow.test.js`, `tests/contract/registry.test.js`)  
**Target Platform**: Navegadores modernos en desktop y movil, red EVM (Ganache/Sepolia)  
**Project Type**: Web application (frontend estatico con integracion directa Web3)  
**Performance Goals**: Mantener latencia percibida actual; validaciones de emisor en cliente sin demoras perceptibles adicionales  
**Constraints**: No agregar backend custodial, no modificar smart contract, no introducir seleccion manual de emisor, mantener mensajes comprensibles  
**Scale/Scope**: Cambios acotados a `frontend/register.html`, `frontend/js/register.js`, `frontend/js/app.js`, `scripts/build-frontend-config.js`, y pruebas relacionadas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `PASS`: Technical simplicity preservada, cambios limitados a UI/configuracion y logica de presentacion.
- `PASS`: Cryptographic truth intacta; se mantiene hash SHA-256 y validacion on-chain existente.
- `PASS`: Direct Web3 integration preservada; no se introduce backend intermediario.
- `PASS`: Contract-first respetado; se documentan contratos de comportamiento UI/config del feature.
- `PASS`: Data sovereignty intacta; no se agrega PII ni almacenamiento adicional en cadena.
- `PASS`: Accessibility mantenida; la identidad institucional se muestra de forma clara y no editable.

**Post-Design Re-Check**: PASS. Los artefactos de fase 0 y 1 mantienen el alcance sin violaciones constitucionales y sin dependencias nuevas fuera del stack vigente.

## Project Structure

### Documentation (this feature)

```text
specs/003-emisor-institucional-fijo/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── frontend-institutional-issuer-behavior.md
│   └── frontend-runtime-config-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
├── contract-config.template.json
├── register.html
├── js/
│   ├── app.js
│   ├── register.js
│   └── blockchain-service.js

scripts/
└── build-frontend-config.js

tests/
├── contract/
│   └── registry.test.js
└── integration/
    └── ui-flow.test.js
```

**Structure Decision**: Se mantiene estructura de web app estatica existente y se implementa el feature en capa UI/configuracion, con pruebas de logica por controladores y regresion de contrato sin crear nuevos modulos de infraestructura.

## Complexity Tracking

No constitutional violations identified.
