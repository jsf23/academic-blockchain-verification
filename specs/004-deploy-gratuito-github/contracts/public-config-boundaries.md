# Contract: Public Configuration Boundaries

## Purpose
Definir que configuracion puede publicarse y que configuracion debe permanecer fuera del repositorio o fuera del sitio publico.

## Publicly Acceptable Data
- `contractAddress`
- `chainId`
- `contractAbi`
- `institutionalIssuerAddress`
- URL publica del sitio

## Restricted Data
- Claves privadas
- Seed phrases
- Credenciales de wallet custodial
- Archivos locales de entorno no destinados al frontend publico

## Boundary Rules

### PCB-001 Public Frontend Assumption
- Todo valor entregado al navegador MUST tratarse como publico.

### PCB-002 Secret Exclusion
- El repositorio MUST excluir secretos y archivos locales no aptos para publicacion.
- El workflow de publicacion MUST fallar si la configuracion publica requerida no puede validarse.

### PCB-003 Review Before Publish
- Antes de desplegar, el mantenedor MUST revisar que no se hayan agregado secretos a archivos versionados.

### PCB-004 Runtime Consistency
- La configuracion publica usada por la app desplegada MUST corresponder al entorno blockchain previsto para la demo o publicacion.
- La ABI publicada MUST corresponder al contrato publico configurado para la URL desplegada.
