# Contract: Deployment Workflow for Free GitHub Publishing

## Purpose
Definir el comportamiento esperado del flujo de despliegue gratuito conectado al repositorio GitHub.

## Scope
- Fuente: repositorio GitHub oficial del proyecto.
- Destino: hosting gratuito de GitHub Pages.
- Artefacto publicado: sitio estatico del frontend.

## Workflow Contract

### DWC-001 Source of Truth
- El repositorio GitHub MUST ser la fuente oficial del contenido publicado.
- La revision publicada MUST poder rastrearse a una rama o commit concreto.

### DWC-002 Free Publish Path
- El proyecto MUST poder publicarse mediante GitHub Pages sin infraestructura paga adicional.
- El flujo MUST estar documentado para primera publicacion y actualizaciones.
- El flujo SHOULD poder ejecutarse mediante `workflow_dispatch` y mediante cambios aprobados en la rama oficial de publicacion.

### DWC-003 Public URL
- Un despliegue exitoso MUST producir una URL publica accesible.
- Esa URL MUST servir el home y las vistas publicas de la aplicacion.

### DWC-004 Post-Deploy Validation
- Tras cada publicacion, el mantenedor MUST verificar navegacion basica y consistencia de configuracion publica.
- Una publicacion no se considera estable hasta completar esa validacion.
- La validacion MUST confirmar acceso a `/`, `/register.html` y `/verify.html`.

### DWC-005 Rollback
- El flujo MUST permitir volver a una revision estable previa usando GitHub como fuente.
- El rollback MUST dejar trazabilidad de la revision restaurada.

## Out of Scope
- Backend dedicado de despliegue.
- Infraestructura paga.
- Secret management avanzado fuera de capacidades gratuitas del repositorio/hosting elegido.
