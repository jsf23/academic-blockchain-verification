# Contract: Frontend Home Content

## Purpose
Definir el contenido obligatorio del home para el feature 002.

## Scope
- Archivo objetivo principal: `frontend/index.html`
- Seccion contractual: bloque de identidad academica del autor en la portada
- Estructura semantica esperada: encabezado + metadatos de institucion/contexto

## Required Content Contract

### CHC-001 Author Section Presence
- The home MUST include one dedicated author identity section.

### CHC-002 Mandatory Strings
- The author identity section MUST include the exact visible strings:
  - `Juan Camilo Sierra Florez`
  - `UNAD`
  - `proyecto de grado`

### CHC-003 Relative Placement
- The author identity section MUST be placed after the hero block and before the first informational grid.

### CHC-004 Visibility
- The section MUST be visible on first render without requiring interaction.

### CHC-005 Semantic Structure
- The section MUST expose semantic identity content through:
  - one heading with author name
  - one metadata structure for institution and project context

### CHC-006 Accessibility
- The section MUST include an `aria-label` that clearly identifies it as author/project information.

## Verification
- Manual UI verification on homepage.
- DOM/content assertion in integration test (future scope).
- Check that visible strings and structure remain present after responsive reflow.
