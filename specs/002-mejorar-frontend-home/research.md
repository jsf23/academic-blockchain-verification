# Research: Mejorar Frontend Home

## Decision 1: Mantener la paleta actual y mejorar naturalidad con jerarquia, ritmo y textura sutil
- Decision: Conservar los mismos colores base del sistema y mejorar la percepcion visual mediante jerarquia tipografica mas clara, espaciado consistente, formas coherentes y capas visuales suaves.
- Rationale: El requerimiento exige mantener colorimetria; por lo tanto, la mejora de naturalidad debe venir de composicion visual (tipografia, ritmo, profundidad y contraste interno), no de nuevos colores.
- Alternatives considered:
  - Cambiar paleta o agregar acento dominante nuevo: descartado por violar FR-004.
  - Mantener estilos actuales con ajustes minimos de texto: impacto visual insuficiente para cumplir FR-003.

## Decision 2: Introducir una tarjeta de identidad academica integrada al flujo del home
- Decision: Agregar una seccion de identidad del autor entre el hero y la primera grilla informativa, siguiendo el lenguaje visual de las tarjetas existentes.
- Rationale: Da contexto academico temprano sin competir con los CTA del hero y cumple directamente FR-001/FR-002.
- Alternatives considered:
  - Banner superior: compite con el encabezado principal.
  - Footer-only: baja descubribilidad del contenido requerido.
  - Modal/tooltip: no asegura visibilidad permanente.

## Decision 3: Aplicar reglas responsive y legibilidad explicitas para la nueva seccion
- Decision: Definir comportamiento en movil para la seccion personal (padding, line-height, jerarquia textual) y validar su integracion con breakpoints existentes.
- Rationale: El spec exige coherencia visual y legibilidad en escritorio/movil (FR-005/FR-006, SC-003).
- Alternatives considered:
  - Reusar estilos sin ajustes responsive: riesgo de saturacion visual en pantallas pequenas.
  - Crear layout independiente solo para author-card: complejidad innecesaria frente a estructura actual.

## Decision 4: Limitar alcance a capa de presentacion, sin cambios funcionales blockchain
- Decision: El feature se implementa solo en `frontend/index.html` y `frontend/css/app.css`, sin cambios de contrato, Web3 ni scripts de despliegue.
- Rationale: Preserva simplicidad constitucional, reduce riesgo de regresion funcional y alinea el cambio con la intencion del usuario.
- Alternatives considered:
  - Cambios transversales en vistas de registro/verificacion: fuera de alcance del requerimiento.
  - Ajustes en servicios JS para estados visuales: no necesarios para cumplir el objetivo principal.

## Final Implementation Notes

- Se adopto una `author-card` integrada entre hero e info-grid para cumplir el contexto academico temprano.
- Se mantuvo la paleta actual y la mejora de naturalidad se logro via jerarquia tipografica, ritmo de espaciado y profundidad sutil por capas/opacidad.
- Se reforzo legibilidad responsive con ajustes para <=900px y <=640px, incluyendo preservacion de contenido en zoom 125%.
- No se realizaron cambios funcionales en flujos de registro/verificacion ni en contrato blockchain.
