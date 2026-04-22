# Quickstart: Feature 004 - Deploy Gratuito GitHub

## Goal
Publicar la aplicacion web en internet sin costo usando GitHub como origen de despliegue y validar que la version publica opere correctamente.

## Prerequisites
- Repositorio disponible en GitHub.
- Rama `main` disponible para publicacion o acceso para lanzar `workflow_dispatch`.
- GitHub Pages configurado para usar GitHub Actions.
- Frontend estatico listo en el proyecto.
- Configuracion runtime publica validada para el entorno a publicar.

## Required Repository Variables
- `PUBLIC_RPC_URL`
- `PUBLIC_CHAIN_ID`
- `PUBLIC_CONTRACT_ADDRESS`
- `PUBLIC_CONTRACT_ABI_JSON`
- `PUBLIC_INSTITUTIONAL_ISSUER_ADDRESS`
- `PUBLIC_PREFER_WALLET_PROVIDER`

## Recommended Free Deployment Path
1. Preparar la configuracion publica del frontend.
2. Confirmar que no se versionen archivos sensibles.
3. Ejecutar `npm run prepare:pages` para validar y empaquetar el sitio.
4. Publicar el sitio estatico usando GitHub Pages.
4. Validar la URL publica resultante.

## Pre-Publish Checklist
1. Revisar que `frontend/contract-config.json` no se suba accidentalmente si contiene valores locales no deseados.
2. Confirmar que `contractAddress`, `chainId`, `contractAbi` e `institutionalIssuerAddress` correspondan al entorno publico esperado.
3. Confirmar que no existan claves privadas, seed phrases ni secretos en archivos versionados.
4. Ejecutar validacion y empaquetado del despliegue:
   - `npm run validate:public-config`
   - `npm run build:pages`
5. Ejecutar pruebas base del proyecto antes de publicar:
   - `npm run test:integration`
   - `npm run test:contract`

## GitHub Pages Publish Flow
1. Confirmar que el workflow `Deploy Frontend to GitHub Pages` existe en `.github/workflows/deploy-pages.yml`.
2. Confirmar que las Repository Variables publicas estan cargadas en GitHub.
3. Publicar en `main` o ejecutar manualmente `workflow_dispatch`.
4. Esperar la finalizacion de los jobs `build` y `deploy`.
5. Guardar la URL generada por el environment `github-pages`.

## Publish Validation
1. Abrir la URL publica del sitio.
2. Verificar acceso a:
   - `/`
   - `/register.html`
   - `/verify.html`
3. Confirmar que la app muestra la configuracion esperada para la red publica elegida.
4. Confirmar que MetaMask puede conectarse en el entorno publicado cuando el usuario lo desee.
5. Confirmar que la publicacion puede trazarse al commit o revision desplegada.

## Recovery Path
1. Identificar la ultima revision estable publicada.
2. Revertir o republicar esa revision desde GitHub.
3. Repetir la validacion post-deploy.

## Security Review Before Publish
1. Confirmar que `.env`, claves privadas y seed phrases no estan versionadas.
2. Confirmar que `PUBLIC_CONTRACT_ABI_JSON` y las demas variables cargadas en GitHub corresponden al contrato publico esperado.
3. Confirmar que cualquier valor entregado al navegador puede considerarse publico.
4. Si hay duda sobre un dato, no publicarlo hasta reclasificarlo.

## Completion Criteria
- Existe una URL publica gratuita accesible.
- El proceso de publicacion queda documentado y repetible.
- Los archivos sensibles siguen excluidos del repositorio.
- La validacion post-deploy confirma navegacion y configuracion correctas.

## Evidence Log

- Public config validation (`npm run validate:public-config`): PASS
- Pages artifact build (`npm run build:pages`): PASS
- Regression (`npm run test:integration`): PASS
- Regression (`npm run test:contract`): PASS (con fallback no bloqueante de µWS/Ganache en Windows)
- Local packaged artifact validated (`/`, `/register.html`, `/verify.html` via `http-server dist/pages -p 4174`): PASS
- GitHub Pages URL validated (`/`, `/register.html`, `/verify.html`): PENDING - requiere ejecutar el workflow en GitHub
- Commit/revision traceability checked: PENDING - depende del deploy real en GitHub Pages
