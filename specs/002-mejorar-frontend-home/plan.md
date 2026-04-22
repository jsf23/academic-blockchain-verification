# Implementation Plan: Mejorar Frontend Home

**Branch**: `002-before-specify-hook` | **Date**: 2026-04-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-mejorar-frontend-home/spec.md`

## Summary

Refinar la experiencia visual del frontend para que se perciba menos artificial sin alterar la paleta de color existente, y agregar en el home una seccion explicita de identidad academica con el contenido solicitado (Juan Camilo Sierra Florez, UNAD, proyecto de grado). El enfoque tecnico se limita a ajustes de estructura HTML y sistema visual CSS en la portada, preservando los flujos funcionales de registro y verificacion.

## Technical Context

**Language/Version**: HTML5, CSS3 y JavaScript ESM (Node.js 22 LTS para scripts de soporte)  
**Primary Dependencies**: Frontend estatico propio en `frontend/`, hoja de estilos global `frontend/css/app.css`, scripts de UI existentes en `frontend/js/`  
**Storage**: N/A para este feature (sin nuevos datos persistentes)  
**Testing**: Validacion manual visual en home + pruebas de no regresion ejecutando `npm run test:integration`  
**Target Platform**: Navegadores modernos en escritorio y movil (frontend estatico servido localmente)  
**Project Type**: Web application (frontend estatico + smart contract existente, sin cambios de contrato en este feature)  
**Performance Goals**: Mantener carga inicial del home sin degradacion perceptible y transiciones ligeras (<250ms) cuando apliquen  
**Constraints**: Mantener la paleta actual, no introducir backend nuevo, no modificar logica blockchain ni contrato, conservar accesibilidad basica y responsive  
**Scale/Scope**: Cambios acotados al home (`frontend/index.html`) y estilos compartidos (`frontend/css/app.css`) con impacto visual controlado

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `PASS`: Technical simplicity se mantiene al limitar el cambio a capa de presentacion (HTML/CSS) sin nueva infraestructura.
- `PASS`: Cryptographic truth no se altera porque no hay cambios en hash SHA-256 ni en verificaciones.
- `PASS`: Direct Web3 integration permanece intacta al no tocar servicios de blockchain ni contratos.
- `PASS`: Contract-first se respeta documentando contratos de comportamiento UI para contenido/estilo del home.
- `PASS`: Data sovereignty se mantiene: no se agregan datos personales on-chain ni almacenamiento nuevo.
- `PASS`: Accessibility se refuerza con reglas de legibilidad, jerarquia tipografica y comportamiento responsive.

**Post-Design Re-Check**: PASS. Los artefactos de diseno (`research.md`, `data-model.md`, `contracts/`, `quickstart.md`) preservan simplicidad, no introducen dependencias de backend ni cambios de contrato, y mantienen el alcance en experiencia visual del home.

## Project Structure

### Documentation (this feature)

```text
specs/002-mejorar-frontend-home/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── frontend-home-content.md
│   └── frontend-visual-guidelines.md
└── tasks.md
```

### Source Code (repository root)

```text
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
    ├── register-controller.js
    ├── verify-controller.js
    ├── blockchain-service.js
    └── hash-service.js

tests/
├── contract/
│   └── registry.test.js
└── integration/
    └── ui-flow.test.js
```

**Structure Decision**: Se mantiene una estructura de web app estatica con estilos centralizados. Este feature modifica principalmente `frontend/index.html` y `frontend/css/app.css`, sin cambios en contrato ni scripts de despliegue.

## Complexity Tracking

No constitutional violations identified.
