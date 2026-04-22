# Contract: Frontend Institutional Issuer Behavior

## Scope
Define el comportamiento observable del flujo `register` cuando el emisor es institucional fijo.

## Actors
- Operador institucional (usuario del formulario de registro).
- Frontend de registro (`register.html` + `register.js`).
- Contrato blockchain de registro (sin cambios en ABI).

## Preconditions
- Existe configuracion runtime cargada (`contract-config.json`).
- El formulario de registro esta disponible en `register.html`.

## Behavioral Contract

### BC-001: Emisor fijo no seleccionable
- El frontend MUST eliminar o deshabilitar cualquier mecanismo de carga/seleccion manual de cuentas emisoras en la vista de registro.
- El frontend MUST usar una unica direccion emisora institucional proveniente de configuracion runtime.

### BC-002: Transparencia operativa
- El frontend MUST mostrar la direccion emisora institucional activa antes del envio.
- El campo mostrado al usuario MUST ser de solo lectura y no editable manualmente.
- Si la cuenta institucional no existe o es invalida, el frontend MUST informar el estado en el mismo bloque de emisor.

### BC-003: Bloqueo por configuracion invalida
- Si no existe direccion institucional configurada, el frontend MUST bloquear el envio y mostrar mensaje claro de correccion.
- Si la direccion institucional no tiene formato valido, el frontend MUST bloquear el envio y mostrar mensaje de formato esperado.

### BC-004: Validacion de autorizacion
- Antes de confirmar registro, el frontend MUST verificar que la direccion institucional este autorizada en contrato.
- Si no esta autorizada, el frontend MUST rechazar el flujo con mensaje comprensible.

### BC-005: Integridad de resultado
- En un registro exitoso, el resultado mostrado MUST incluir emisor y transaccion.
- El emisor mostrado en resultado MUST coincidir con la direccion institucional usada en la solicitud.

## Error Semantics
- `WALLET_UNAVAILABLE`: no hay emisor institucional utilizable.
- `UNAUTHORIZED`: emisor institucional no autorizado en contrato.
- `INVALID_HASH`: huella no valida para registro.
- `TRANSACTION_REJECTED`: fallo transaccional o rechazo de firma.

## Out of Scope
- Cambios al contrato inteligente.
- Cambios al flujo de verificacion publica de certificados.
- Custodia de claves institucionales o backend de firmado.
