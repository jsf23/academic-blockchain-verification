# Data Model: Blockchain Degree Registry

## 1. CertificateRecord

Represents the immutable on-chain proof associated with a certificate fingerprint.

### Fields

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| certificateHash | bytes32-equivalent string | SHA-256 digest of the academic document | Required; must be a valid 32-byte hash; unique in registry |
| issuerAddress | blockchain address | Authorized institution that issued the record | Required; must belong to authorized issuer set |
| issuedAt | unsigned integer timestamp | Registration timestamp captured on-chain | Required; set by contract execution time |
| isValid | boolean | Current validity status of the certificate record | Required; defaults to `true` on issuance |

### Relationships

- Created by one `AuthorizedIssuer`.
- Queried through one `VerificationResult` per lookup.

### State Transitions

- `nonexistent -> active`: when an authorized issuer registers a new unique hash.
- `active -> inactive`: reserved for future revocation or invalidation flow if introduced later.
- `nonexistent -> nonexistent`: when an unauthorized, malformed, or duplicate submission is attempted.

## 2. AuthorizedIssuer

Represents an academic institution allowed to create certificate records.

### Fields

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| issuerAddress | blockchain address | Account permitted to issue certificates | Required; unique |
| displayName | string | Human-readable institution name shown in UI | Required for UI friendliness; stored off-chain or derived from deployment metadata |
| status | enum-like string | Operational authorization state | Must be `authorized` for issuance |

### Relationships

- Can create many `CertificateRecord` entries.
- Is referenced by `VerificationResult` display data.

### State Transitions

- `pending -> authorized`: when governance approves issuer for demo use.
- `authorized -> suspended`: if issuer should no longer issue new certificates.

## 3. VerificationResult

Represents the public response generated when a user checks a certificate hash.

### Fields

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| certificateHash | bytes32-equivalent string | Hash provided by the verifier | Required |
| exists | boolean | Indicates whether a matching on-chain record exists | Derived from lookup |
| issuerAddress | blockchain address or null | Address of issuing institution when found | Present only when `exists = true` |
| issuerDisplayName | string or null | Friendly institution label for UI | Present when mapping data is available |
| issuedAt | unsigned integer or null | On-chain issuance timestamp | Present only when `exists = true` |
| isValid | boolean | Validity flag returned to the UI | Defaults to `false` when record absent |
| message | string | Plain-language explanation shown in the interface | Required for UX clarity |

### Relationships

- Reads from one `CertificateRecord` if present.
- May enrich issuer data from `AuthorizedIssuer` metadata.

## 4. RegistrationSubmission

Represents the frontend-side request prepared before sending a blockchain transaction.

### Fields

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| sourceFileName | string | Local file selected by the issuer | Optional display-only value; never stored on-chain |
| sourceFileSize | integer | File size used for client-side validation feedback | Must be greater than zero |
| certificateHash | bytes32-equivalent string | SHA-256 digest generated in browser | Required |
| walletAddress | blockchain address | Active connected wallet used to submit issuance | Required |
| submitState | enum-like string | UI state of the submission | One of `idle`, `hashing`, `ready`, `submitting`, `confirmed`, `failed` |

### Relationships

- Produces one attempted `CertificateRecord` creation.

## Validation Rules Summary

- Only SHA-256 hashes are acceptable as registry keys.
- Duplicate hashes are rejected before or during transaction execution.
- Unauthorized issuer addresses cannot create records.
- No entity includes student names, document numbers, grades, or other PII in on-chain storage.
- UI display data must remain understandable to non-technical users and avoid raw blockchain jargon where possible.