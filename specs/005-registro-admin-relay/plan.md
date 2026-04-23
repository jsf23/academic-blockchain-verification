# Implementation Plan: Registro Administrativo con Relay

**Branch**: `005-add-github-pages-deploy` | **Date**: 2026-04-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-registro-admin-relay/spec.md`

## Summary

Agregar un flujo de registro administrativo sin MetaMask ni instalacion local, manteniendo la verificacion publica on-chain. La solucion se basa en: (1) conservar el frontend estatico para carga y verificacion, (2) desviar solo la escritura administrativa a un relay serverless gratuito con la cuenta institucional existente, y (3) separar rigurosamente configuracion publica del frontend y secretos restringidos del relay.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ESM para frontend; Node.js 22 para scripts y relay serverless  
**Primary Dependencies**: Web3.js 4.16, dotenv 16.4, frontend estatico existente, GitHub Pages para frontend, Vercel Functions Hobby para relay administrativo  
**Storage**: Persistencia operativa minima para solicitudes del relay (idempotency, estado y trazabilidad); configuracion publica runtime en `frontend/contract-config.json`  
**Testing**: Mocha + Chai para pruebas de logica y nuevas pruebas de relay; regresion con `tests/integration/ui-flow.test.js` y `tests/contract/registry.test.js`  
**Target Platform**: Navegadores modernos para operadores y verificadores; backend serverless Node en Vercel; red EVM compatible con el contrato actual  
**Project Type**: Web application con frontend estatico y backend relay administrativo de alcance estrecho  
**Performance Goals**: Registro inicial aceptado o rechazado en una sola interaccion web; respuesta inicial del relay en pocos segundos; verificacion publica sin degradacion perceptible  
**Constraints**: Mantener hosting gratuito, no requerir MetaMask ni software local para el operador, no exponer secretos en GitHub/GitHub Pages, no modificar la verificacion publica on-chain, no convertir el relay en proxy RPC generico  
**Scale/Scope**: Bajo volumen institucional, pocos operadores autenticados, una sola operacion protegida de escritura (`issueCertificate`) y seguimiento basico por solicitud

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `PASS`: Technical simplicity preservada al mantener el frontend actual y agregar un relay serverless minimo con solo dos endpoints de negocio.
- `PASS`: Cryptographic truth intacta; la autenticidad sigue dependiendo de la huella SHA-256 y del estado on-chain.
- `PASS WITH JUSTIFIED EXCEPTION`: Direct Web3 integration se conserva para la verificacion publica, pero el alta administrativa introduce un backend relay acotado porque el requerimiento exige eliminar MetaMask y la instalacion local para operadores.
- `PASS`: Contract-first respetado mediante contratos del endpoint administrativo, fronteras de configuracion y comportamiento de UI.
- `PASS`: Data sovereignty mantenida; no se agrega PII on-chain y los secretos del relay permanecen fuera del frontend publicado.
- `PASS`: Accessibility preservada; el operador sigue usando una web simple y el tercero verificador mantiene la consulta publica existente.

**Post-Design Re-Check**: PASS. La fase 0 y fase 1 mantienen la excepcion al principio de integracion directa limitada al flujo administrativo de escritura. La verificacion publica sigue directa sobre blockchain y no se introducen secretos en el cliente.

## Project Structure

### Documentation (this feature)

```text
specs/005-registro-admin-relay/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── administrative-relay-api-contract.md
│   └── frontend-relay-boundaries.md
└── tasks.md
```

### Source Code (repository root)

```text
api/
└── admin/
    ├── register-hash.js
    └── register-status.js

backend/
└── lib/
    ├── relay-auth.js
    ├── relay-config.js
    ├── relay-service.js
    ├── relay-storage.js
    └── relay-validation.js

frontend/
├── contract-config.template.json
├── register.html
├── verify.html
└── js/
    ├── app.js
    ├── blockchain-service.js
    ├── register-controller.js
    ├── register.js
    └── verify.js

scripts/
├── build-frontend-config.js
└── validate-public-config.js

tests/
├── contract/
│   └── registry.test.js
├── integration/
│   └── ui-flow.test.js
└── relay/
    ├── relay-service.test.js
    └── relay-validation.test.js
```

**Structure Decision**: Se mantiene `frontend/` como aplicacion estatica y se agrega una capa minima de relay en `api/` + `backend/lib/` para adaptarse al despliegue serverless gratuito. Las pruebas siguen centralizadas en `tests/` y la verificacion publica permanece en los modulos Web3 existentes del frontend.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Backend relay en un proyecto que favorece Web3 directo | El requerimiento exige registro administrativo sin MetaMask ni software local del operador | Mantener MetaMask o wallet in-browser incumple el requerimiento principal y deja la firma en el puesto operativo |
