# Research: Deploy Gratuito GitHub

## Decision 1: Usar GitHub Pages como hosting gratuito principal
- Decision: Publicar el frontend estatico mediante GitHub Pages conectado al repositorio oficial en GitHub.
- Rationale: El proyecto ya es una app estatica servida desde `frontend/` con `http-server`, por lo que encaja bien con Pages sin requerir backend, costos ni runtime adicional.
- Alternatives considered:
  - Netlify/Vercel free tier: viables, pero GitHub Pages reduce dependencias externas y se alinea mejor con la prioridad de despliegue desde GitHub.
  - Hosting manual fuera de GitHub: descartado por menor repetibilidad.

## Decision 2: Mantener el despliegue como frontend-only con configuracion publica controlada
- Decision: Versionar solo configuracion publica necesaria para operacion web (ABI, contractAddress, chainId, institutionalIssuerAddress) y excluir archivos locales con valores no destinados al repo.
- Rationale: En una dApp frontend-only, la configuracion consumida por navegador debe asumirse publica. La seguridad real no puede depender de ocultar datos del cliente.
- Alternatives considered:
  - Intentar ocultar toda la configuracion blockchain en el frontend: descartado porque no es compatible con una app cliente pura.
  - Subir claves privadas o secretos de despliegue al repo: descartado por riesgo critico.

## Decision 3: Automatizar publicacion desde GitHub para despliegues repetibles
- Decision: Definir un flujo de publicacion basado en GitHub (manual o mediante GitHub Actions) que tome el contenido estatico listo para publicar y lo despliegue a la URL del proyecto.
- Rationale: Minimiza pasos manuales, hace el proceso repetible para cualquier mantenedor y reduce errores al actualizar la version publicada.
- Alternatives considered:
  - Publicacion local manual en cada cambio: descartado por fragilidad operativa.
  - Pipeline complejo con multiples entornos desde el inicio: descartado por exceder el alcance gratuito inicial.

## Decision 4: Validar post-deploy sobre navegacion y conectividad esperada
- Decision: Incluir una validacion posterior al despliegue que revise home, register, verify, y coherencia de red/configuracion visible para el entorno publico.
- Rationale: El riesgo principal no es compilar, sino publicar una version con URL valida pero configuracion incorrecta o comportamiento roto en navegador real.
- Alternatives considered:
  - Dar por valido el deploy solo porque GitHub publica la pagina: descartado por insuficiente.

## Decision 5: Definir rollback simple y gratuito
- Decision: Basar la recuperacion en revertir o republicar la ultima version estable conocida desde GitHub.
- Rationale: Para hosting estatico gratuito, el rollback mas simple y robusto es volver a una revision estable y republicar.
- Alternatives considered:
  - Estrategias avanzadas de rollback con infraestructura dedicada: descartadas por costo y complejidad.

## Resolved Clarifications

- El tipo de despliegue objetivo es frontend estatico gratuito conectado a GitHub.
- La opcion preferida para el plan es GitHub Pages por alineacion con repositorio y costo cero.
- La aplicacion sigue siendo cliente Web3 sin backend adicional.
