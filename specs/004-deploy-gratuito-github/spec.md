# Feature Specification: Deploy Gratuito GitHub

**Feature Branch**: `004-emisor-institucional-fijo`  
**Created**: 2026-04-21  
**Status**: Draft  
**Input**: User description: "Haz el spec para el deploy, para que se despliegue de forma gratuita"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Publicar version en internet gratis (Priority: P1)

Como responsable del proyecto, quiero publicar una version accesible en internet usando un plan gratuito conectado al repositorio para que cualquier persona pueda verificar certificados sin entorno local.

**Why this priority**: El principal valor inmediato es que el sistema sea accesible en linea sin costos de hosting.

**Independent Test**: Puede validarse desplegando una version desde el repositorio y confirmando que existe una URL publica funcional para navegar el home, registro y verificacion.

**Acceptance Scenarios**:

1. **Given** que el repositorio tiene el codigo listo para publicar, **When** se ejecuta el proceso de despliegue gratuito, **Then** se genera una URL publica accesible desde navegador.
2. **Given** que la URL publica esta activa, **When** un usuario externo abre la aplicacion, **Then** puede acceder a las paginas principales sin depender de ejecucion local.

---

### User Story 2 - Mantener despliegues repetibles desde GitHub (Priority: P2)

Como mantenedor, quiero un flujo repetible para actualizar la version publicada desde cambios en GitHub para reducir errores manuales y mantener el sitio actualizado.

**Why this priority**: Asegura continuidad operativa y evita procesos ad hoc cada vez que se publica una mejora.

**Independent Test**: Puede validarse aplicando un cambio menor en el repositorio y comprobando que la version publica se actualiza con el mismo flujo documentado.

**Acceptance Scenarios**:

1. **Given** un cambio aprobado en la rama de publicacion, **When** se ejecuta el flujo de despliegue definido, **Then** la version en internet refleja ese cambio.
2. **Given** que otra persona del equipo sigue la guia de despliegue, **When** repite el proceso, **Then** obtiene el mismo resultado sin pasos ocultos.

---

### User Story 3 - Proteger configuracion sensible en despliegue publico (Priority: P3)

Como responsable tecnico, quiero reglas claras para separar configuracion publica y secreta antes de publicar en GitHub para evitar exposicion de credenciales o datos sensibles.

**Why this priority**: Reduce riesgos de seguridad y evita incidentes por publicar informacion no destinada al repositorio.

**Independent Test**: Puede validarse revisando que los archivos versionados no contengan secretos y que la configuracion requerida para operar en internet este documentada por tipo de dato (publico vs restringido).

**Acceptance Scenarios**:

1. **Given** la configuracion de despliegue preparada, **When** se revisa el repositorio antes de publicar, **Then** no se encuentran secretos comprometidos en archivos versionados.
2. **Given** la aplicacion ya desplegada, **When** se valida su configuracion de red y contrato, **Then** funciona con valores publicos apropiados para un entorno de produccion ligero.

### Edge Cases

- Que ocurre si el proveedor gratuito alcanza limites de cuota o suspende temporalmente el despliegue.
- Que ocurre si la URL publica queda activa pero la configuracion de red no corresponde al entorno esperado.
- Que ocurre si el repositorio contiene accidentalmente un archivo de configuracion local no destinado a publicacion.
- Que ocurre si una actualizacion falla y se necesita volver a la ultima version estable publicada.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema de publicacion MUST permitir desplegar la aplicacion web en internet usando una modalidad gratuita vinculada al repositorio en GitHub.
- **FR-002**: El proyecto MUST incluir una guia de despliegue paso a paso para primera publicacion y actualizaciones posteriores.
- **FR-003**: El flujo de despliegue MUST producir una URL publica verificable para acceso de usuarios externos.
- **FR-004**: El flujo MUST definir que configuraciones pueden ser publicas y cuales no deben versionarse en GitHub.
- **FR-005**: El proceso MUST contemplar validacion posterior al despliegue para confirmar navegacion basica y conexion esperada con la red blockchain configurada.
- **FR-006**: El proyecto MUST incluir una estrategia de recuperacion ante fallo de despliegue para restaurar una version estable previa.
- **FR-007**: El despliegue MUST ser repetible por cualquier mantenedor autorizado siguiendo solo la documentacion oficial del repositorio.

### Key Entities *(include if feature involves data)*

- **Configuracion de Despliegue Publico**: Conjunto de parametros necesarios para publicar la app en internet; atributos clave: origen del codigo, valores publicos requeridos, valores restringidos excluidos.
- **Ejecucion de Despliegue**: Evento de publicacion de una version; atributos clave: version fuente, estado (exitoso/fallido), URL objetivo, fecha de publicacion.
- **Registro de Validacion Post-Deploy**: Evidencia de que la version publicada opera correctamente; atributos clave: chequeos ejecutados, resultado por chequeo, observaciones de incidentes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de despliegues exitosos generan una URL publica accesible para usuarios externos.
- **SC-002**: Un mantenedor nuevo puede completar su primer despliegue siguiendo la guia en menos de 30 minutos.
- **SC-003**: El 100% de publicaciones revisadas antes de despliegue no exponen secretos en archivos versionados.
- **SC-004**: Al menos 95% de actualizaciones rutinarias del sitio se publican sin requerir pasos manuales no documentados.

## Assumptions

- El repositorio en GitHub es el origen oficial para publicar versiones en internet.
- Se utilizara un proveedor de hosting gratuito compatible con publicacion desde GitHub.
- La aplicacion continuara siendo un frontend estatico con integracion blockchain desde el cliente.
- El equipo mantendra una revision minima de seguridad antes de cada publicacion.
