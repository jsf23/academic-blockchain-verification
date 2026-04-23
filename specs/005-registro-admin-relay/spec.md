# Feature Specification: Registro Administrativo con Relay

**Feature Branch**: `005-add-github-pages-deploy`  
**Created**: 2026-04-22  
**Status**: Draft  
**Input**: User description: "Quiero que el sistema permita registrar certificados de forma administrativa sin requerir MetaMask ni instalacion de software por parte del operador. Todo debe quedar preconfigurado para que el usuario solo abra la web, suba el archivo y registre la huella. El registro debe hacerse mediante un backend relay gratuito con la cuenta ya existente. La verificacion publica on-chain debe mantenerse"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registro administrativo sin instalaciones (Priority: P1)

Como operador administrativo, quiero abrir la web, subir el certificado y registrar su huella sin instalar software adicional ni conectar una billetera, para completar el proceso operativo con el menor rozamiento posible.

**Why this priority**: El valor principal del feature es eliminar la dependencia operativa de herramientas externas para que el registro pueda realizarse desde cualquier puesto autorizado con solo acceder al sitio.

**Independent Test**: Puede probarse en un navegador sin extensiones blockchain instaladas, completando un registro de certificado desde la web y verificando que el operador no deba instalar software ni aprobar acciones desde herramientas externas.

**Acceptance Scenarios**:

1. **Given** que el operador abre la web desde un navegador compatible, **When** sube un certificado valido y confirma el registro, **Then** la solicitud se procesa sin pedir instalacion de software adicional ni conexion manual de una cuenta.
2. **Given** que el operador dispone de un archivo de certificado valido, **When** completa el flujo de carga y registro, **Then** recibe confirmacion clara del resultado sin salir de la aplicacion web.

---

### User Story 2 - Emision institucional preconfigurada por relay (Priority: P2)

Como responsable institucional, quiero que todos los registros administrativos se emitan mediante un servicio relay preconfigurado con la cuenta oficial existente, para asegurar consistencia operativa y evitar errores humanos al elegir identidades emisoras.

**Why this priority**: La simplificacion operativa solo es confiable si el registro se ejecuta siempre bajo la identidad institucional correcta y sin depender de decisiones manuales del operador.

**Independent Test**: Puede probarse registrando varias huellas consecutivas y verificando que todas se emiten con la misma identidad institucional preconfigurada, sin exponer al operador datos sensibles ni opciones de seleccion de cuenta.

**Acceptance Scenarios**:

1. **Given** que existe una cuenta institucional valida asociada al servicio relay, **When** el operador registra una huella, **Then** el sistema la emite usando esa cuenta institucional preconfigurada.
2. **Given** que la configuracion administrativa del relay no esta disponible o no es valida, **When** el operador intenta registrar una huella, **Then** el sistema bloquea el envio y muestra una indicacion clara para escalar el problema.

---

### User Story 3 - Verificacion publica on-chain intacta (Priority: P3)

Como tercero verificador, quiero seguir consultando publicamente en blockchain si una huella fue registrada, para conservar transparencia y confianza sin depender del canal administrativo usado en el alta.

**Why this priority**: El cambio de experiencia para el operador no debe degradar la promesa principal del sistema: verificabilidad publica e independiente del registro emitido.

**Independent Test**: Puede probarse registrando una nueva huella mediante el flujo administrativo y luego verificando publicamente que esa misma huella aparece on-chain con el mismo comportamiento de consulta existente.

**Acceptance Scenarios**:

1. **Given** que una huella fue registrada exitosamente mediante el flujo administrativo, **When** cualquier usuario ejecuta la verificacion publica de esa huella, **Then** obtiene el mismo resultado on-chain esperado que en el flujo actual.
2. **Given** que una huella no registrada se consulta en la verificacion publica, **When** se realiza la consulta, **Then** el comportamiento de ausencia de registro se mantiene sin cambios por este feature.

### Edge Cases

- Que ocurre si el archivo cargado no puede procesarse para obtener una huella valida.
- Que ocurre si la huella ya fue registrada previamente y el operador intenta registrarla otra vez.
- Que ocurre si el servicio relay esta temporalmente no disponible despues de que el operador confirma el registro.
- Que ocurre si la cuenta institucional preconfigurada deja de estar autorizada para emitir.
- Que ocurre si el registro tarda mas de lo esperado en confirmarse y el operador necesita distinguir entre espera y fallo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir que el operador administrativo complete el registro de una huella de certificado usando solo la interfaz web.
- **FR-002**: El sistema MUST evitar cualquier requisito de instalacion de software adicional o conexion manual de herramientas externas por parte del operador para registrar una huella.
- **FR-003**: El sistema MUST calcular o recibir la huella del certificado cargado dentro del flujo web antes de iniciar el registro.
- **FR-004**: El sistema MUST enviar el registro administrativo a traves de un servicio relay preconfigurado para el entorno operativo.
- **FR-005**: El sistema MUST usar siempre la cuenta institucional existente asociada al servicio relay para emitir los registros administrativos.
- **FR-006**: El sistema MUST impedir que el operador seleccione, edite o sustituya manualmente la identidad emisora usada para registrar.
- **FR-007**: El sistema MUST informar al operador de forma clara si el registro fue aceptado, rechazado, duplicado o quedo pendiente de confirmacion.
- **FR-008**: El sistema MUST bloquear nuevos intentos de envio cuando falte configuracion administrativa esencial del relay o de la cuenta emisora.
- **FR-009**: El sistema MUST mantener la verificacion publica de huellas en blockchain sin requerir cambios en la experiencia de consulta existente.
- **FR-010**: El sistema MUST preservar trazabilidad suficiente del resultado de cada intento administrativo para que el operador pueda identificar si la huella quedo registrada o no.

### Key Entities *(include if feature involves data)*

- **Solicitud de Registro Administrativo**: Intento operativo de registrar la huella de un certificado desde la web; atributos clave: archivo origen, huella calculada, estado del intento, fecha operativa.
- **Configuracion de Relay Institucional**: Conjunto de parametros operativos que habilitan el envio administrativo preconfigurado; atributos clave: disponibilidad, estado de validez, identidad emisora asociada.
- **Resultado de Registro**: Evidencia mostrada al operador tras cada intento; atributos clave: estado final o pendiente, motivo visible, referencia de seguimiento cuando exista.
- **Consulta Publica de Verificacion**: Resultado de comprobar una huella registrada frente al registro publico; atributos clave: huella consultada, existencia del registro, identidad emisora visible, marca temporal registrada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de los registros administrativos exitosos pueden completarse desde la web sin instalar software adicional en el equipo del operador.
- **SC-002**: 0% de los registros administrativos requieren seleccion manual de cuenta o aprobacion desde herramientas externas por parte del operador.
- **SC-003**: Al menos 95% de operadores autorizados completan el flujo de carga y registro en menos de 2 minutos durante pruebas de aceptacion.
- **SC-004**: 100% de los errores por configuracion faltante, indisponibilidad del relay o duplicidad de huella muestran un mensaje accionable antes de que el operador abandone el flujo.
- **SC-005**: 100% de las huellas registradas por el flujo administrativo pueden verificarse publicamente on-chain con el mismo resultado esperado del flujo de consulta existente.

## Assumptions

- La institucion ya dispone de una cuenta emisora existente y autorizada para registrar huellas en el entorno objetivo.
- La administracion y custodia segura de la cuenta institucional y del servicio relay quedan fuera del alcance de este feature.
- El flujo administrativo se orienta a operadores internos autorizados, no a usuarios publicos anonimos.
- La verificacion publica de certificados ya funciona contra blockchain y debe conservarse como comportamiento base sin redefinir su alcance.
- El costo del servicio relay para este caso de uso se mantiene dentro de una modalidad gratuita aceptable para la operacion prevista.