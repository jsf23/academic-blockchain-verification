# academic-blockchain-verification

Prototipo TRL 5 para registrar y verificar titulos academicos mediante huellas SHA-256 en blockchain (por ejemplo Sepolia).

## Requisitos

- Node.js (preferiblemente usando `nvm`)
- Un endpoint RPC (por ejemplo Alchemy en Sepolia)
- Una wallet compatible (por ejemplo MetaMask)

## Configuracion recomendada con nvm

Este repositorio incluye `.nvmrc` con la version recomendada.

1. `nvm install`
2. `nvm use`
3. `node -v`
4. `npm -v`

## Comandos

- `npm install`
- `npm run deploy`
- `npm run seed:issuers`
- `npm run config:frontend`
- `npm run start`
- `npm test`

## Flujo local

1. Configurar `.env` a partir de `.env.example` con `RPC_URL`, `CHAIN_ID`, `DEPLOYER_PRIVATE_KEY`, `AUTHORIZED_ISSUERS` y `CONTRACT_ADDRESS`.
2. Ejecutar `npm install`.
3. Ejecutar `npm run deploy` para compilar y desplegar el contrato.
4. Ejecutar `npm run config:frontend` para generar `frontend/contract-config.json` desde `.env` y `artifacts`.
5. Ejecutar `npm run start` para servir el frontend estatico.

## Configuracion runtime del frontend

- `frontend/contract-config.json` es el archivo runtime consumido por la app web.
- Ese archivo esta en `.gitignore` para no versionar endpoints ni claves.
- Usa `npm run config:frontend` para regenerarlo cuando cambie red/contrato.
- Puedes usar `frontend/contract-config.template.json` como referencia.
- `preferWalletProvider=true` hace que el frontend use MetaMask primero (si existe) y use `rpcUrl` como fallback.

La planificacion detallada del feature vive en `specs/001-blockchain-degree-registry/`.

## Demo no tecnico (guion rapido)

1. Abre la pagina principal y explica que solo se guardan huellas SHA-256, no documentos ni datos personales.
2. Ve a **Register certificate**.
3. Carga una muestra de certificado y genera la huella.
4. Usa **Use Ganache account** para elegir una cuenta autorizada y registra la huella.
5. Muestra el resultado: huella, emisor, fecha y transaccion.
6. Ve a **Verify certificate**, pega la misma huella y ejecuta la verificacion.
7. Muestra el estado **Authentic certificate**.
8. Cambia un caracter de la huella y verifica otra vez para mostrar **No record found**.

## Criterios de interpretacion para usuarios

- **Authentic certificate**: la huella existe en el registro y coincide con una institucion emisora.
- **No record found**: no hay evidencia en cadena para esa huella.
- **Could not verify**: hubo un problema de conexion o configuracion local y se debe revisar Ganache/contrato.