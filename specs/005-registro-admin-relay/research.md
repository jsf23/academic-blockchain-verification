# Research: Registro Administrativo con Relay

## Decision 0: Usar Vercel Functions Hobby como relay administrativo gratuito y mantener GitHub Pages para el frontend
- Decision: Mantener la publicacion del frontend estatico en GitHub Pages y desplegar el relay administrativo como funciones serverless Node en Vercel Hobby, con origen separado y secretos administrados por variables de entorno del proveedor.
- Rationale: El frontend actual ya esta preparado para hosting estatico y la verificacion publica no necesita backend. Vercel Functions encaja mejor que otras opciones gratuitas con el stack JavaScript/Node del repo, permite manejar secretos fuera de GitHub Pages y evita introducir infraestructura persistente mas pesada para un volumen administrativo bajo.
- Alternatives considered:
  - Netlify Functions: viable, pero menos alineado con el stack y ergonomia esperada para este repositorio.
  - Cloudflare Workers: atractivo en costo, pero con mayor friccion de compatibilidad para un relay EVM en runtime serverless restringido.
  - Managed relayers orientados a account abstraction: descartados por complejidad adicional o porque no cumplen bien el objetivo de costo cero y control simple del signer institucional.

## Decision 1: Exponer solo un endpoint de alta y un endpoint de estado, no un proxy RPC general
- Decision: Limitar el relay a un `POST /admin/register-hash` para aceptar solicitudes de registro y un `GET /admin/register-hash/{requestId}` para consultar estado operativo. El relay no debe exponer envio arbitrario de transacciones, firma de mensajes, lectura RPC generica ni parametros libres de contrato/metodo.
- Rationale: El frontend es estatico y la verificacion publica sigue siendo directa on-chain, asi que el backend solo necesita cubrir la operacion restringida de alta administrativa. Un endpoint estrecho reduce superficie de abuso, simplifica validacion y evita convertir el relay en un signer-as-a-service generico.
- Alternatives considered:
  - Exponer un proxy JSON-RPC autenticado: descartado por ampliar demasiado la superficie, dificultar controles de negocio y mezclar operaciones publicas con operaciones restringidas.
  - Exponer multiples endpoints por fase interna del registro: descartado por complejidad innecesaria para un flujo que solo necesita aceptar y consultar estado.

## Decision 2: Validar la carga con esquema estricto y reglas de negocio antes de firmar o transmitir
- Decision: El relay debe aceptar un payload minimo y versionado, por ejemplo `hash`, `fileName`, `mimeType`, `size`, `idempotencyKey` y un identificador de operador derivado de la sesion. Debe validar formato del hash, tamaño maximo, tipos permitidos, campos obligatorios, chain esperada y que la solicitud solo pueda invocar la operacion institucional prevista. Antes de transmitir, debe ejecutar validaciones de negocio: verificar que la cuenta emisora configurada siga autorizada, consultar si la huella ya existe y, cuando sea posible, simular/estimar la llamada para detectar reverts previsibles.
- Rationale: En un frontend estatico toda entrada del navegador debe tratarse como no confiable. La validacion de esquema evita payloads malformados; la validacion de negocio evita gastar gas en solicitudes invalidas o duplicadas. Mantener direccion de contrato, ABI y metodo fijados del lado servidor impide que el cliente elija destinos o calldata arbitrarios.
- Alternatives considered:
  - Confiar en el hash calculado por el cliente sin mas controles: descartado porque el navegador es manipulable y puede enviar cargas inconsistentes o incompletas.
  - Validar solo despues de transmitir y depender del revert on-chain: descartado porque empeora UX, desperdicia cuota/gas y complica la trazabilidad operativa.

## Decision 3: Prevenir abuso y duplicados con autenticacion ligera, rate limiting e idempotencia persistente
- Decision: Requerir autenticacion web para operadores internos y no depender solo de ocultar la URL del relay. Encima de eso, aplicar rate limiting por identidad y por IP, registrar auditoria minima y exigir un `idempotencyKey` generado por cliente para cada intento. El relay debe persistir el primer resultado por `idempotencyKey` y comparar parametros en reintentos; ademas debe mantener un bloqueo/logica de unicidad por `hash` para evitar carreras entre solicitudes concurrentes del mismo certificado.
- Rationale: Un relay custodial gratuito es un objetivo facil para spam si queda publico. La autenticacion reduce el universo de invocadores; el rate limiting limita abuso residual; la idempotencia evita dobles envios por refresh, reintentos de red o doble click; la unicidad por hash cubre el caso mas importante de negocio, que es la duplicidad semantica aunque cambie el `idempotencyKey`.
- Alternatives considered:
  - Proteger solo con CORS o validacion de `Origin`: descartado porque no autentica al operador y puede evadirse fuera del navegador.
  - Depender solo de la restriccion on-chain de duplicados: descartado porque deja carreras, mala experiencia y costos innecesarios en el relay.
  - No persistir idempotencia y confiar en la UI para deshabilitar el boton: descartado porque no sobrevive refrescos, reintentos automaticos ni concurrencia real.

## Decision 4: Separar estado pendiente de estado confirmado y devolver seguimiento inmediato
- Decision: El `POST` de registro debe devolver rapido un resultado operativo inicial, no esperar indefinidamente a la confirmacion final. Los estados minimos recomendados son `rejected`, `duplicate`, `accepted_pending_submission`, `submitted_pending_confirmation`, `confirmed` y `failed`. Cuando la transaccion se transmite, la respuesta debe incluir `requestId` y `txHash`; el frontend consulta el endpoint de estado hasta resolucion. La verificacion publica sigue siendo la fuente final de verdad, pero el relay mantiene trazabilidad operativa hasta al menos una confirmacion, o mas si el entorno requiere mayor margen.
- Rationale: En EVM hay una diferencia real entre transaccion enviada, minada y suficientemente confirmada. Tratar todo como exito inmediato produce falsos positivos; tratar todo como fallo por timeout produce falsos negativos. Un estado explicito y consultable permite al operador distinguir espera, rechazo, duplicado y confirmacion sin cambiar la promesa de verificabilidad publica on-chain.
- Alternatives considered:
  - Bloquear la peticion HTTP hasta la confirmacion final: descartado por timeouts, fragilidad en serverless y peor UX.
  - Marcar exito apenas exista `txHash`: descartado porque una transaccion puede seguir pendiente, revertir o quedar reemplazada.
  - Mantener el estado solo en memoria: descartado porque se pierde en reinicios, despliegues o escalado horizontal.

## Decision 5: Mantener una separacion estricta entre configuracion publica del frontend y secretos del relay
- Decision: Publicar en el frontend solo configuracion asumida como publica: `contractAddress`, `chainId`, ABI necesaria para lectura y `institutionalIssuerAddress`. Mantener fuera del repo publico y fuera de GitHub Pages toda clave privada, API keys de RPC restringidas, secretos de autenticacion del relay y cualquier credencial de almacenamiento. El relay debe obtener esos valores desde variables de entorno o un secret manager del proveedor de hosting.
- Rationale: Todo lo que llega al navegador debe considerarse publico. Intentar ocultar secretos en una web estatica es inseguro por definicion. Separar configuracion publica y restringida conserva el modelo actual de verificacion directa on-chain y evita convertir el sitio publicado en una fuga de credenciales.
- Alternatives considered:
  - Inyectar secretos en archivos JSON del frontend durante el build: descartado porque terminan publicados al navegador.
  - Reutilizar un solo archivo de configuracion para frontend y relay: descartado porque mezcla fronteras de seguridad y aumenta el riesgo de filtracion accidental.

## Decision 6: Aceptar que el relay minimo sigue necesitando un almacenamiento operativo pequeno y descartable
- Decision: Incorporar una persistencia minima para `requestId`, `idempotencyKey`, `hash`, estado, timestamps, operador, `txHash` y motivo visible. Puede ser una tabla ligera o KV con TTL para solicitudes terminales, pero debe sobrevivir reinicios y concurrencia basica.
- Rationale: Sin persistencia no hay manera robusta de implementar idempotencia, diferenciar pendiente vs confirmado, ni dar trazabilidad al operador. El almacenamiento operativo puede ser pequeno y de bajo costo, pero no debe omitirse si el relay firma y transmite transacciones reales.
- Alternatives considered:
  - Relay puramente stateless: descartado porque no resuelve duplicados, seguimiento ni recuperacion tras fallos de red.
  - Base de datos grande con modelado complejo: descartado por exceder el objetivo de relay minimo para una sola operacion administrativa.

## Resolved Clarifications

- El relay gratuito recomendado para el feature es Vercel Functions Hobby, separado del frontend publicado en GitHub Pages.
- La verificacion publica debe seguir consultando directamente la blockchain y no pasar por el relay.
- El relay recomendado es administrativo y de alcance estrecho: registrar una huella con la cuenta institucional ya existente.
- La ausencia de instalacion para el operador no implica ausencia de autenticacion; implica eliminar wallet/software blockchain del puesto operativo.