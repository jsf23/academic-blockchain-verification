# Contract: Frontend Visual Guidelines

## Purpose
Definir reglas visuales para mejorar naturalidad sin alterar identidad cromatica.

## Scope
- Archivos objetivo principales:
  - `frontend/css/app.css`
  - `frontend/index.html`

## Visual Contract

### CVG-001 Palette Preservation
- Existing base palette MUST remain the dominant palette of the home.
- No new dominant color family may be introduced.
- Any extra visual depth MUST be created with opacity/gradient layers derived from existing palette variables.

### CVG-002 Naturalness Improvement
- Home presentation MUST improve perceived naturalness through composition changes (typography hierarchy, spacing rhythm, card integration, subtle depth/texture).
- Motion feedback MUST stay restrained (short transitions, no aggressive animation patterns).

### CVG-003 Coherence
- New author section MUST align with existing card language (borders, radius family, spacing logic, and readable contrast levels).
- Hero, author card, and info cards MUST preserve a consistent spatial rhythm.

### CVG-004 Responsive Readability
- Home content, including author section, MUST remain readable on desktop and mobile breakpoints used by the project.
- Text MUST not overlap, clip, or become illegible under standard zoom levels.
- Zoom at 125% MUST keep all required texts readable and within container bounds.

## Verification
- Visual review in desktop and mobile viewport sizes.
- Manual checklist comparison against previous baseline.
- Verify required strings remain visible in author section after responsive changes.
