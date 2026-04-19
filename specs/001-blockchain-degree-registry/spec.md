# Feature Specification: Blockchain Degree Registry

**Feature Branch**: `[001-blockchain-degree-registry]`  
**Created**: 2026-04-18  
**Status**: Draft  
**Input**: User description: "AcademicIntegritySystem: Sistema integral para el registro y validación de títulos en blockchain."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar huella de un titulo (Priority: P1)

Como institucion academica autorizada, quiero registrar la huella digital unica de un titulo para dejar una constancia inmutable de su emision y reducir el riesgo de falsificacion.

**Why this priority**: El valor principal del sistema depende de poder registrar constancias autenticas de manera confiable. Sin este flujo, no existe fuente oficial para la verificacion posterior.

**Independent Test**: Puede probarse de forma independiente cuando una institucion autorizada registra la huella de un documento valido y el sistema la conserva con fecha de emision, entidad emisora y estado vigente.

**Acceptance Scenarios**:

1. **Given** una institucion autorizada y una huella digital de titulo que no existe previamente, **When** registra el documento, **Then** el sistema guarda el registro con la institucion emisora, la fecha de registro y estado valido.
2. **Given** una institucion no autorizada, **When** intenta registrar una huella digital de titulo, **Then** el sistema rechaza la operacion y no crea ningun registro.
3. **Given** una huella digital ya registrada, **When** una institucion autorizada intenta registrarla nuevamente, **Then** el sistema evita duplicados y comunica que el registro ya existe.

---

### User Story 2 - Verificar autenticidad de un titulo (Priority: P2)

Como verificador externo, quiero consultar una huella digital de titulo para confirmar si existe un registro autentico y conocer la institucion emisora y la fecha de registro sin depender de procesos manuales.

**Why this priority**: La verificacion publica materializa el beneficio para empleadores, entidades publicas y ciudadanos, permitiendo validar credenciales con rapidez y transparencia.

**Independent Test**: Puede probarse de forma independiente consultando una huella digital registrada y otra inexistente para confirmar que el sistema entrega un resultado claro en ambos casos.

**Acceptance Scenarios**:

1. **Given** una huella digital previamente registrada, **When** cualquier usuario la consulta, **Then** el sistema informa que el titulo existe, muestra la institucion emisora y la fecha de registro.
2. **Given** una huella digital no registrada, **When** cualquier usuario la consulta, **Then** el sistema informa claramente que no existe evidencia de autenticidad.
3. **Given** una consulta publica, **When** se muestra el resultado, **Then** el sistema no expone datos personales del titular del titulo.

---

### User Story 3 - Interpretar el resultado sin conocimientos tecnicos (Priority: P3)

Como usuario no tecnico, quiero una interfaz simple de registro y validacion para completar el proceso sin conocimientos especializados sobre blockchain ni terminologia criptografica.

**Why this priority**: La constitucion del proyecto exige accesibilidad para actores no tecnicos. Esto mejora adopcion y reduce errores operativos en demostraciones y validaciones academicas.

**Independent Test**: Puede probarse de forma independiente observando si un usuario no tecnico completa el registro o la validacion siguiendo las instrucciones de pantalla y comprende el resultado final sin apoyo experto.

**Acceptance Scenarios**:

1. **Given** un usuario en la interfaz de registro, **When** carga un documento y solicita su registro, **Then** el sistema presenta instrucciones claras, confirma el resultado y evita pasos ambiguos.
2. **Given** un usuario en la interfaz de validacion, **When** ingresa o pega una huella digital, **Then** el sistema muestra un estado visual claro de autenticidad o no autenticidad.

---

### Edge Cases

- Que ocurre cuando el documento suministrado no puede convertirse en una huella digital valida o la entrada esta vacia.
- Como responde el sistema cuando la misma huella digital ya fue registrada previamente por una institucion autorizada.
- Como responde el sistema cuando una consulta publica se realiza sobre una huella con formato invalido.
- Que informacion se muestra cuando la consulta devuelve un registro existente pero no vigente.
- Como mantiene el sistema la privacidad cuando un usuario intenta incluir informacion personal dentro de los datos de registro.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir que solo instituciones academicas autorizadas registren la huella digital unica de un titulo.
- **FR-002**: El sistema MUST almacenar cada registro de titulo de forma inmutable junto con la institucion emisora, la fecha de registro y su estado de vigencia.
- **FR-003**: El sistema MUST impedir el registro duplicado de una huella digital que ya exista en el registro oficial.
- **FR-004**: El sistema MUST ofrecer una consulta publica para verificar si una huella digital corresponde a un titulo registrado.
- **FR-005**: El sistema MUST mostrar en cada verificacion positiva la existencia del registro, la institucion emisora, la fecha de registro y el estado de vigencia.
- **FR-006**: El sistema MUST mostrar en cada verificacion negativa un resultado claro que indique que no existe evidencia de autenticidad para la huella consultada.
- **FR-007**: El sistema MUST proteger la privacidad del titular del titulo evitando almacenar o exponer informacion personal identificable en el registro oficial.
- **FR-008**: El sistema MUST proporcionar una experiencia de uso comprensible para personas sin conocimientos tecnicos especializados.
- **FR-009**: El sistema MUST mantener un historial permanente de los registros emitidos para fines de auditoria y trazabilidad.
- **FR-010**: El sistema MUST comunicar de forma clara los errores de autorizacion, formato invalido y duplicidad de registro.

### Key Entities *(include if feature involves data)*

- **Registro de titulo**: Evidencia oficial de autenticidad asociada a una huella digital unica, con institucion emisora, fecha de registro y estado de vigencia.
- **Institucion autorizada**: Entidad academica con permiso para emitir registros oficiales dentro del sistema.
- **Resultado de validacion**: Respuesta entregada a un verificador que indica si existe un registro autentico y que metadatos publicos pueden consultarse.
- **Huella digital de documento**: Identificador criptografico unico derivado del contenido del titulo, utilizado como referencia de verificacion sin almacenar el documento original.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los registros creados por instituciones autorizadas quedan consultables con su institucion emisora, fecha y estado dentro del mismo flujo de demostracion.
- **SC-002**: Al menos el 95% de las verificaciones publicas muestran un resultado comprensible en menos de 10 segundos durante pruebas controladas del prototipo.
- **SC-003**: Al menos el 90% de los usuarios de prueba sin perfil tecnico completan una verificacion exitosa en su primer intento sin asistencia externa.
- **SC-004**: El sistema evita el 100% de los intentos de registro duplicado de una misma huella digital durante las pruebas funcionales.
- **SC-005**: El 100% de las consultas publicas y registros evaluados en pruebas de aceptacion se realizan sin almacenar ni mostrar informacion personal identificable del titular.

## Assumptions

- El alcance de la version inicial se limita al registro y validacion de titulos mediante huellas digitales, sin gestionar el ciclo de vida academico completo del estudiante.
- Las instituciones que emiten registros ya fueron autorizadas por un proceso externo de gobernanza antes de usar el sistema.
- Los usuarios disponen de una copia digital del titulo o de su huella digital para iniciar el flujo de registro o validacion.
- La evidencia oficial de autenticidad se basa en la coincidencia exacta entre la huella digital consultada y el registro oficial inmutable.
- El prototipo prioriza simplicidad operativa y demostrabilidad sobre integraciones administrativas adicionales.