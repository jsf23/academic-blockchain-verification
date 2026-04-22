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
- `npm run validate:public-config`
- `npm run build:pages`
- `npm run prepare:pages`
- `npm run start`
- `npm test`

## Flujo local

1. Configurar `.env` a partir de `.env.example` con `RPC_URL`, `CHAIN_ID`, `DEPLOYER_PRIVATE_KEY`, `AUTHORIZED_ISSUERS`, `CONTRACT_ADDRESS` e `INSTITUTIONAL_ISSUER_ADDRESS`.
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
- `institutionalIssuerAddress` define la cuenta institucional fija usada para registrar certificados desde el frontend.

## Deploy gratuito con GitHub Pages

La publicacion gratuita recomendada para este repositorio es GitHub Pages.

### Fuente oficial de despliegue

- El repositorio GitHub es la fuente oficial de cada publicacion.
- El workflow de despliegue vive en `.github/workflows/deploy-pages.yml`.
- La rama recomendada para publicacion automatica es `main`.

### Variables publicas requeridas en GitHub

Configura estas Repository Variables antes del primer deploy:

- `PUBLIC_RPC_URL`
- `PUBLIC_CHAIN_ID`
- `PUBLIC_CONTRACT_ADDRESS`
- `PUBLIC_CONTRACT_ABI_JSON`
- `PUBLIC_INSTITUTIONAL_ISSUER_ADDRESS`
- `PUBLIC_PREFER_WALLET_PROVIDER` 

Todos esos valores deben tratarse como publicos porque terminan en `contract-config.json` dentro del sitio publicado.

### Primera publicacion

1. En GitHub, abre `Settings > Pages` y selecciona `GitHub Actions` como source.
2. En `Settings > Secrets and variables > Actions`, crea las Repository Variables publicas listadas arriba.
3. Verifica localmente el empaquetado antes de subir cambios:
	- `npm run validate:public-config`
	- `npm run build:pages`
4. Sube a `main` o ejecuta manualmente el workflow `Deploy Frontend to GitHub Pages`.
5. Cuando el job termine, toma la URL publicada desde el environment `github-pages`.

### Actualizaciones rutinarias

1. Aplica y revisa el cambio en el repositorio.
2. Ejecuta localmente `npm test` y `npm run prepare:pages`.
3. Publica el cambio en `main` o lanza `workflow_dispatch`.
4. Valida `/`, `/register.html` y `/verify.html` en la URL publica.

### Rollback operativo

1. Identifica el ultimo commit estable publicado.
2. Reviértelo o vuelve a publicar esa revision.
3. Ejecuta de nuevo la validacion post-deploy.

### Seguridad y limites de configuracion

- No publiques claves privadas, seed phrases ni credenciales custodiales.
- `frontend/contract-config.json` es un archivo publico por definicion cuando se despliega.
- Si necesitas cambiar red, direccion o ABI, actualiza las Repository Variables y vuelve a ejecutar el workflow.

La planificacion detallada del proyecto y features vive en `specs/`.

## Demo no tecnico (guion rapido)

1. Abre la pagina principal y explica que solo se guardan huellas SHA-256, no documentos ni datos personales.
2. Ve a **Register certificate**.
3. Carga una muestra de certificado y genera la huella.
4. Verifica que la cuenta institucional configurada sea la autorizada y registra la huella.
5. Muestra el resultado: huella, emisor, fecha y transaccion.
6. Ve a **Verify certificate**, pega la misma huella y ejecuta la verificacion.
7. Muestra el estado **Authentic certificate**.
8. Cambia un caracter de la huella y verifica otra vez para mostrar **No record found**.

## Criterios de interpretacion para usuarios

- **Authentic certificate**: la huella existe en el registro y coincide con una institucion emisora.
- **No record found**: no hay evidencia en cadena para esa huella.
- **Could not verify**: hubo un problema de conexion o configuracion local y se debe revisar Ganache/contrato.