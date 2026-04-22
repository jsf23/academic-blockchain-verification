# Implementation Plan: Deploy Gratuito GitHub

**Branch**: `004-emisor-institucional-fijo` | **Date**: 2026-04-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-deploy-gratuito-github/spec.md`

## Summary

Definir y preparar un flujo de despliegue gratuito para la aplicacion web usando GitHub como origen oficial y GitHub Pages como hosting principal. El enfoque tecnico se limita a publicacion de frontend estatico, documentacion del proceso, separacion entre configuracion publica y datos restringidos, y validacion posterior a la publicacion.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ESM; Node.js 22 para scripts y validacion local  
**Primary Dependencies**: Frontend estatico en `frontend/`, `http-server` para ejecucion local, GitHub repository hosting, GitHub Pages  
**Storage**: N/A (sitio estatico; configuracion runtime publica consumida por navegador)  
**Testing**: Validacion manual post-deploy + regresion existente con `npm run test:integration` y `npm run test:contract`  
**Target Platform**: Navegadores modernos; hosting estatico gratuito conectado a GitHub  
**Project Type**: Web application (frontend estatico con integracion Web3 directa)  
**Performance Goals**: Carga inicial ligera propia de sitio estatico; sin degradacion perceptible frente al entorno local  
**Constraints**: Mantener costo cero de hosting, no agregar backend pago, no exponer secretos en GitHub, conservar compatibilidad con Sepolia/MetaMask/Alchemy  
**Scale/Scope**: Alcance acotado a flujo de publicacion, configuracion publica, documentacion y verificacion de despliegue del frontend

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `PASS`: Technical simplicity mantenida al elegir hosting estatico gratuito sin nueva infraestructura compleja.
- `PASS`: Cryptographic truth no se modifica; el deploy no altera logica de hash ni verificacion on-chain.
- `PASS`: Direct Web3 integration preservada; la app desplegada sigue conectando directo desde frontend.
- `PASS`: Contract-first respetado mediante contratos de workflow y limites de configuracion publica.
- `PASS`: Data sovereignty mantenida; el plan explicita exclusion de secretos y ausencia de PII on-chain.
- `PASS`: Accessibility preservada al mantener la app como sitio web publico navegable sin barreras nuevas.

**Post-Design Re-Check**: PASS. Los artefactos de investigacion y diseno mantienen el enfoque en despliegue estatico gratuito, sin backend adicional ni violaciones constitucionales.

## Project Structure

### Documentation (this feature)

```text
specs/004-deploy-gratuito-github/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── deployment-workflow-contract.md
│   └── public-config-boundaries.md
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
├── index.html
├── register.html
├── verify.html
├── contract-config.template.json
└── js/
    ├── app.js
    ├── register.js
    └── verify.js

scripts/
└── build-frontend-config.js

tests/
├── contract/
│   └── registry.test.js
└── integration/
    └── ui-flow.test.js

.github/
└── copilot-instructions.md
```

**Structure Decision**: Se mantiene la arquitectura de web app estatica existente. El feature se enfoca en publicacion del contenido de `frontend/` y en documentar/configurar el camino de despliegue gratuito desde GitHub, sin introducir backend ni runtime nuevo.

## Complexity Tracking

No constitutional violations identified.
