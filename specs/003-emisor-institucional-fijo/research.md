# Research: Emisor Institucional Fijo

## Decision 1: Configurar un emisor institucional explicito en runtime
- Decision: Extender la configuracion runtime del frontend con un campo dedicado para la cuenta institucional emisora (por ejemplo `institutionalIssuerAddress`) en `frontend/contract-config.json` y en su template.
- Rationale: Evita hardcodear direcciones en UI, permite cambio por entorno (Ganache/Sepolia) y facilita validacion temprana de configuracion.
- Alternatives considered:
  - Hardcodear direccion en `register.js`: descartado por baja mantenibilidad y riesgo operativo.
  - Reusar lista de emisores autorizados y tomar el primero: descartado por ambiguedad.

## Decision 2: Eliminar seleccion manual de cuenta en el flujo de registro
- Decision: Sustituir carga/seleccion manual de cuentas por visualizacion de una cuenta institucional fija en modo solo lectura dentro de `register.html`.
- Rationale: Cumple el objetivo principal de reducir error humano y garantiza consistencia del emisor operativo.
- Alternatives considered:
  - Mantener selector con preseleccion automatica: descartado porque sigue permitiendo desvio manual.
  - Ocultar completamente la cuenta activa: descartado por falta de transparencia para el operador.

## Decision 3: Aplicar validacion por capas para errores de configuracion y autorizacion
- Decision: Validar en cliente antes del envio: existencia del emisor institucional, formato de direccion, y autorizacion en contrato; mantener mapeo de errores de red/transaccion existente.
- Rationale: Mejora UX al fallar temprano con mensajes accionables y evita intentos de transaccion innecesarios.
- Alternatives considered:
  - Depender solo de revert on-chain: descartado por mala experiencia de usuario.
  - Permitir continuar con advertencia: descartado por no cumplir bloqueo requerido.

## Decision 4: Mantener arquitectura frontend-only con caveat de seguridad explicito
- Decision: Tratar el emisor fijo como control operativo de UX, mientras la garantia final de autorizacion permanece en el contrato (validacion por `msg.sender` y `isAuthorizedIssuer`).
- Rationale: Preserva principios del proyecto (Web3 directo, sin backend) y delimita correctamente responsabilidades de seguridad.
- Alternatives considered:
  - Mover firmado a backend custodial: descartado por salir del alcance y romper arquitectura actual.

## Decision 5: Reusar estrategia de pruebas vigente
- Decision: Extender pruebas de flujo en `tests/integration/ui-flow.test.js` para casos de emisor fijo y errores de configuracion, manteniendo regresion de contrato en `tests/contract/registry.test.js`.
- Rationale: El repositorio ya tiene patrones de prueba estables con controladores inyectables y cobertura de contrato.
- Alternatives considered:
  - Introducir framework E2E nuevo: descartado por complejidad innecesaria para este alcance.

## Resolved Clarifications

- No quedan `NEEDS CLARIFICATION` en el contexto tecnico del feature.
- La cuenta institucional sera una sola por entorno y no seleccionable en UI.
- El flujo de verificacion publica permanece sin cambios funcionales.
