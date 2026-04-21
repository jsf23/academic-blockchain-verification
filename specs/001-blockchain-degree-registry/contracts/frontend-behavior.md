# Contract: Frontend Behavior

## Purpose

Define the user-visible behavior and data exchange between the static UI and the blockchain service layer.

## Registration Screen Contract

### Inputs

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| certificateFile | file | Yes | Must be readable by the browser for SHA-256 hashing |
| activeWallet | blockchain address | Yes | Must correspond to an authorized issuer |

### Processing Rules

1. The UI reads the file locally.
2. The UI computes a SHA-256 hash in the browser.
3. The UI displays the generated hash before submission.
4. The UI submits only the hash to the blockchain service.
5. The UI shows transaction progress using clear non-technical language.

### Success Response Model

| Field | Type | Description |
|-------|------|-------------|
| status | string | `confirmed` |
| certificateHash | string | Generated SHA-256 hash |
| issuerAddress | string | Connected issuer wallet |
| issuedAt | string | Human-readable date/time |
| message | string | Plain-language confirmation |

### Failure Response Model

| Field | Type | Description |
|-------|------|-------------|
| status | string | `failed` |
| errorCode | string | One of `UNAUTHORIZED`, `DUPLICATE_HASH`, `INVALID_HASH`, `WALLET_UNAVAILABLE`, `TRANSACTION_REJECTED` |
| message | string | Plain-language guidance for the user |

## Verification Screen Contract

### Inputs

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| certificateHash | string | Yes | Must match bytes32-compatible SHA-256 format |

### Processing Rules

1. The UI validates hash shape before contacting the blockchain.
2. The UI queries the verification function directly through Web3.js.
3. The UI renders one of three visible states: `valid`, `not-found`, or `error`.

### Success Response Model

| Field | Type | Description |
|-------|------|-------------|
| status | string | `valid` or `not-found` |
| exists | boolean | Whether the certificate is registered |
| issuerAddress | string or null | Issuer wallet when present |
| issuerDisplayName | string or null | Friendly institution name if available |
| issuedAt | string or null | Human-readable issuance date |
| isValid | boolean | Validity state |
| message | string | Clear visual explanation |

### Failure Response Model

| Field | Type | Description |
|-------|------|-------------|
| status | string | `error` |
| errorCode | string | One of `INVALID_HASH_FORMAT`, `NETWORK_UNAVAILABLE`, `CONTRACT_UNAVAILABLE` |
| message | string | User-friendly corrective action |

## UX Quality Rules

- Use plain language instead of blockchain jargon where possible.
- Provide prominent visual status treatment for valid and invalid outcomes.
- Keep form flows short and obvious.
- Never display raw technical stack traces to end users.
- Preserve a high-quality visual design while remaining framework-light.