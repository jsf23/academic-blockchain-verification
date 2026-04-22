# Quickstart: Feature 002 - Mejorar Frontend Home

## Goal
Validar que el home se perciba menos artificial, conserve la paleta actual y muestre la seccion de identidad academica requerida.

## Prerequisites
- Node.js instalado (version recomendada por `.nvmrc` del proyecto).
- Dependencias instaladas con `npm install`.

## Run Locally
1. Iniciar servidor estatico:
   - `npm run start`
2. Abrir en navegador:
   - `http://localhost:4173`

## Phase-by-Phase Execution

1. Setup
- Confirmar que el feature trabaja solo sobre `frontend/index.html` y `frontend/css/app.css`.
- Usar este quickstart como checklist unico de validacion funcional/visual.

2. Foundational
- Verificar jerarquia tipografica y ritmo de espaciado en el home.
- Verificar que la paleta sigue dominada por variables existentes (`--accent`, `--secondary`, `--unad-blue`, neutrales actuales).

3. US1 (MVP)
- Verificar bloque de identidad del autor visible en el home.
- Confirmar presencia exacta de textos requeridos:
  - `Juan Camilo Sierra Florez`
  - `UNAD`
  - `proyecto de grado`

4. US2
- Comparar visualmente contra baseline previo y validar menor sensacion de rigidez artificial.
- Verificar que no se introdujo una nueva familia de color dominante.

5. US3
- Confirmar coherencia visual de la author section entre hero e info-grid.
- Validar responsive en desktop/movil y con zoom 125%.

6. Polish
- Ejecutar regresion automatizada existente.
- Registrar evidencia final de cumplimiento de criterios.

## Validation Checklist
1. Home content
- Verificar presencia de una seccion dedicada al autor.
- Confirmar texto visible:
  - `Juan Camilo Sierra Florez`
  - `UNAD`
  - `proyecto de grado`

2. Visual quality
- Confirmar que la interfaz se percibe menos rigida/artificial que la version previa.
- Confirmar que no aparece una nueva familia de color dominante fuera de la paleta existente.

3. Responsive behavior
- Validar lectura y jerarquia en escritorio.
- Validar lectura y jerarquia en movil (ancho <= 640px).
- Validar que no haya solapamientos ni cortes de texto en el bloque de autor.
- Validar zoom del navegador al 125% sin perdida de legibilidad.

4. Regression safety
- Ejecutar pruebas automatizadas existentes:
  - `npm run test:integration`

## Evidence Log

- Regression (`npm run test:integration`): PASS
- Manual visual review desktop: PASS
- Manual visual review mobile (<=640px): PASS
- Manual visual review zoom 125%: PASS
- Required content strings present: PASS

## Completion Criteria
- Todos los checks anteriores en estado conforme.
- Sin cambios funcionales en flujos de registro/verificacion blockchain.
