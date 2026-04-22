# Data Model: Mejorar Frontend Home

## Overview
Este feature no introduce persistencia nueva ni entidades de dominio on-chain. Se define un modelo de contenido/presentacion para guiar implementacion y pruebas del home.

## Entities

### 1. HomePageSection
- Purpose: Representar bloques renderizados en la portada.
- Fields:
  - `id` (string): identificador unico de seccion.
  - `type` (enum): `hero | author | info-grid`.
  - `order` (number): posicion relativa en el flujo vertical.
  - `visible` (boolean): indica si la seccion debe mostrarse.
- Validation Rules:
  - Debe existir exactamente una seccion `author` visible.
  - La seccion `author` debe ubicarse despues de `hero` y antes de la primera `info-grid`.

### 2. AuthorIdentityContent
- Purpose: Contenido academico obligatorio en el home.
- Fields:
  - `fullName` (string): nombre completo del autor.
  - `institution` (string): institucion academica.
  - `projectContext` (string): tipo de proyecto.
- Validation Rules:
  - `fullName` MUST ser exactamente `Juan Camilo Sierra Florez`.
  - `institution` MUST contener `UNAD`.
  - `projectContext` MUST contener `proyecto de grado`.

### 3. VisualStyleConstraint
- Purpose: Restringir cambios visuales para mantener identidad.
- Fields:
  - `paletteLocked` (boolean): indica que se mantiene paleta existente.
  - `layoutCoherence` (boolean): coherencia entre author card y cards existentes.
  - `responsiveReadable` (boolean): legibilidad garantizada en desktop/movil.
- Validation Rules:
  - `paletteLocked` MUST ser `true`.
  - `layoutCoherence` MUST ser `true` antes de cierre del feature.
  - `responsiveReadable` MUST ser `true` en validacion manual final.

## Relationships
- `HomePageSection(type=author)` contiene exactamente un `AuthorIdentityContent`.
- `HomePageSection` esta sujeto a `VisualStyleConstraint` para aprobacion de calidad visual.

## State Transitions

### Author Section Lifecycle
1. `defined` -> Seccion modelada en spec/plan.
2. `styled` -> Seccion con estilos integrados al sistema visual.
3. `validated` -> Seccion verificada en desktop y movil con contenido obligatorio intacto.
