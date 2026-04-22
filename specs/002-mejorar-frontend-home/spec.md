# Feature Specification: Frontend Mas Natural Con Seccion Personal

**Feature Branch**: `002-before-specify-hook`  
**Created**: 2026-04-21  
**Status**: Draft  
**Input**: User description: "Quiero mejorar el frontend, spec: que se vea menos artificial, usando los mismos colores, y en el home agrega una seccion que diga mi nombre, Juan Camilo Sierra Florez, UNAD y proyecto de grado"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Home con identidad del proyecto (Priority: P1)

Como visitante del sitio, quiero ver en la pagina principal una seccion de presentacion del autor y contexto academico para identificar claramente el origen del proyecto.

**Why this priority**: Es el requerimiento explicito principal del usuario y aporta contexto inmediato de autoria y finalidad academica del prototipo.

**Independent Test**: Puede probarse accediendo al home y verificando que exista una seccion visible con el texto solicitado del autor y del proyecto.

**Acceptance Scenarios**:

1. **Given** una persona abre la pagina de inicio, **When** carga el contenido principal, **Then** encuentra una seccion dedicada al autor del proyecto.
2. **Given** la seccion del autor esta visible, **When** revisa su contenido, **Then** ve exactamente "Juan Camilo Sierra Florez", "UNAD" y "proyecto de grado".

---

### User Story 2 - Apariencia menos artificial manteniendo identidad visual (Priority: P2)

Como usuario del prototipo, quiero una interfaz mas natural y menos rigida para percibir una experiencia visual mas humana sin perder los colores institucionales actuales.

**Why this priority**: Mejora la percepcion de calidad del producto sin alterar la identidad visual ya definida por el proyecto.

**Independent Test**: Puede evaluarse comparando el estilo visual general antes y despues, confirmando mayor naturalidad y verificando que la paleta base siga siendo la misma.

**Acceptance Scenarios**:

1. **Given** una vista del frontend actual, **When** se aplica la mejora visual, **Then** la interfaz se percibe menos artificial en su composicion, jerarquia y presentacion.
2. **Given** los estilos actualizados, **When** se revisan los colores usados en la interfaz, **Then** se mantiene la misma paleta principal definida previamente por el proyecto.

---

### User Story 3 - Coherencia visual en la portada (Priority: P3)

Como visitante, quiero que la nueva seccion personal del home se vea integrada con el resto de la pagina para mantener una lectura fluida y profesional.

**Why this priority**: Garantiza que el nuevo contenido no parezca un agregado aislado y conserve consistencia con el resto de bloques informativos.

**Independent Test**: Puede probarse revisando el home en escritorio y movil y confirmando que la seccion nueva se integra en el flujo visual sin romper legibilidad ni alineaciones.

**Acceptance Scenarios**:

1. **Given** la nueva seccion del home, **When** se visualiza junto al resto de tarjetas, **Then** conserva coherencia de espaciado, contraste y legibilidad.
2. **Given** la pagina en pantallas pequenas, **When** la seccion personal se reacomoda, **Then** sigue siendo legible y mantiene jerarquia visual clara.

---

### Edge Cases

- Que sucede si el texto del autor no cabe en una sola linea en pantallas pequenas?
- Como se comporta la nueva seccion si el navegador tiene zoom alto (125% o superior)?
- Que pasa si se elimina accidentalmente una parte del texto requerido en futuras actualizaciones de contenido?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar en el home una seccion dedicada al autor del proyecto.
- **FR-002**: La seccion del home MUST incluir de forma visible los textos "Juan Camilo Sierra Florez", "UNAD" y "proyecto de grado".
- **FR-003**: El sistema MUST mejorar la presentacion visual general del frontend para que se perciba menos artificial.
- **FR-004**: El sistema MUST conservar la misma paleta cromatica base ya usada en el frontend actual.
- **FR-005**: El home MUST mantener coherencia visual entre la nueva seccion personal y las secciones informativas existentes.
- **FR-006**: La interfaz actualizada MUST conservar legibilidad y estructura clara en escritorio y movil.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las visitas al home muestran una seccion visible con el nombre del autor, la institucion y el contexto de proyecto de grado.
- **SC-002**: Al menos 90% de revisores internos identifican la pagina como "menos artificial" frente a la version anterior en una evaluacion visual comparativa.
- **SC-003**: El 100% de los bloques principales del home mantienen legibilidad correcta sin solapamientos en resoluciones de escritorio y movil objetivo del proyecto.
- **SC-004**: El 100% de los elementos visuales principales del home conservan la paleta base definida para el producto, sin introducir una nueva familia de color dominante.

## Assumptions

- La mejora solicitada se centra en la portada y el estilo global del frontend, sin requerir cambios funcionales de blockchain.
- "Usar los mismos colores" significa mantener la paleta principal ya establecida por el proyecto como referencia visual dominante.
- La nueva seccion personal del home no requiere interacciones adicionales, solo presentacion informativa.
- La validacion de "menos artificial" se realizara mediante revision visual del equipo o del autor del proyecto.
