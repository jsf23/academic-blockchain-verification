# Feature Specification: Emisor Institucional Fijo

**Feature Branch**: `003-run-git-feature`  
**Created**: 2026-04-21  
**Status**: Draft  
**Input**: User description: "La idea es que esto lo use la universidad (teoricamente), lo mejor no seria que la cuenta no se seleccione sino que siempre sea una? y que esa cuenta sea la de la universidad?"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registro con cuenta institucional unica (Priority: P1)

Como funcionario de la universidad, quiero que el registro use siempre una cuenta emisora institucional predefinida para evitar seleccionar cuentas equivocadas y garantizar consistencia del emisor.

**Why this priority**: El valor principal del sistema depende de que cada registro quede asociado a una identidad institucional confiable y consistente.

**Independent Test**: Puede probarse registrando una huella de certificado y confirmando que el emisor mostrado en el resultado coincide siempre con la cuenta institucional predefinida, sin seleccion manual de cuenta.

**Acceptance Scenarios**:

1. **Given** que existe una cuenta institucional configurada, **When** el usuario registra una huella valida, **Then** el registro se procesa usando esa cuenta como emisor.
2. **Given** que el usuario intenta registrar una huella valida, **When** inicia el proceso de registro, **Then** no se le solicita elegir una cuenta emisora alternativa.

---

### User Story 2 - Transparencia de la identidad emisora (Priority: P2)

Como funcionario de la universidad, quiero ver claramente la cuenta institucional que se usara para registrar, para confirmar que estoy operando bajo la identidad oficial.

**Why this priority**: Mejora confianza operativa y reduce errores humanos antes de enviar un registro a blockchain.

**Independent Test**: Puede probarse entrando al flujo de registro y verificando que la cuenta emisora institucional sea visible y no editable manualmente por el operador.

**Acceptance Scenarios**:

1. **Given** que el usuario abre el formulario de registro, **When** revisa el bloque de emisor, **Then** ve la cuenta institucional activa como referencia operativa.
2. **Given** que la cuenta institucional no esta configurada, **When** el usuario intenta registrar, **Then** recibe un mensaje claro para corregir la configuracion antes de continuar.

---

### User Story 3 - Validacion de autorizacion institucional (Priority: P3)

Como responsable de cumplimiento, quiero que solo la cuenta institucional autorizada pueda completar registros para mantener integridad y trazabilidad de emision.

**Why this priority**: Refuerza control institucional y evita registros firmados por identidades no autorizadas.

**Independent Test**: Puede probarse con una cuenta institucional autorizada y otra no autorizada, verificando resultados esperados de aceptacion o rechazo.

**Acceptance Scenarios**:

1. **Given** que la cuenta institucional esta autorizada en el registro, **When** se envia una huella valida, **Then** el sistema confirma el registro exitosamente.
2. **Given** que la cuenta institucional no esta autorizada, **When** se envia una huella valida, **Then** el sistema rechaza el registro con orientacion clara para el operador.

### Edge Cases

- Que ocurre si no existe cuenta institucional configurada al cargar el formulario.
- Que ocurre si la cuenta institucional configurada tiene formato invalido.
- Que ocurre si la cuenta institucional esta configurada pero no autorizada en el contrato.
- Que ocurre si la transaccion es rechazada por el proveedor de wallet o red.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST utilizar una unica cuenta emisora institucional predefinida para todas las operaciones de registro de huellas.
- **FR-002**: El sistema MUST impedir la seleccion manual de cuentas emisoras alternativas dentro del flujo de registro.
- **FR-003**: El sistema MUST mostrar al operador la cuenta institucional activa antes de enviar el registro.
- **FR-004**: El sistema MUST bloquear el envio de registro cuando no exista una cuenta institucional valida configurada.
- **FR-005**: El sistema MUST validar que la cuenta institucional este autorizada para emitir antes de confirmar el registro.
- **FR-006**: El sistema MUST informar mensajes comprensibles cuando el registro falle por falta de configuracion, falta de autorizacion o rechazo de transaccion.
- **FR-007**: El sistema MUST mantener el flujo actual de generacion de huella y registro sin requerir cambios en el proceso de verificacion de certificados.

### Key Entities *(include if feature involves data)*

- **Cuenta Institucional Emisora**: Identidad oficial unica usada para registrar huellas; atributos clave: direccion de cuenta, estado de configuracion, estado de autorizacion.
- **Solicitud de Registro**: Intento de registrar una huella de certificado bajo la identidad institucional; atributos clave: huella, emisor aplicado, resultado, mensaje al operador.
- **Resultado de Registro**: Evidencia del resultado operativo de cada solicitud; atributos clave: estado (confirmado/fallido), motivo en caso de fallo, identificador de transaccion cuando exista.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de los registros exitosos muestran la misma cuenta emisora institucional configurada para el entorno.
- **SC-002**: 0% de los registros requieren seleccion manual de cuenta emisora por parte del operador.
- **SC-003**: Al menos 95% de operadores identifican correctamente la cuenta emisora activa antes de enviar un registro durante pruebas de aceptacion.
- **SC-004**: 100% de intentos sin cuenta institucional valida reciben un mensaje de bloqueo claro antes de intentar registrar.

## Assumptions

- El sistema esta orientado a una operacion institucional unica (universidad) por entorno de despliegue.
- La universidad administra y protege la cuenta emisora oficial fuera del alcance de este feature.
- La autorizacion de la cuenta institucional en el registro blockchain se mantiene mediante los procesos administrativos existentes.
- El flujo de verificacion publica de certificados no cambia y sigue consultando la huella en blockchain como hasta ahora.
