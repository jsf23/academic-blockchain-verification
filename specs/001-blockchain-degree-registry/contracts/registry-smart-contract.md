# Contract: Academic Integrity Registry Smart Contract

## Purpose

Define the blockchain-facing interface for registering and verifying certificate fingerprints.

## State Model

### Certificate

| Field | Type | Description |
|-------|------|-------------|
| issuer | address | Authorized institution that registered the certificate hash |
| timestamp | uint256 | Block timestamp recorded at issuance |
| isValid | bool | Validity flag for the certificate record |

### Registry Index

`mapping(bytes32 => Certificate)`

The hash is the sole registry key and must be the SHA-256 fingerprint of the certificate document.

## Roles

### Contract Owner

- Seeds or manages the initial authorized issuer set for the prototype.

### Authorized Issuer

- Can issue new certificate hashes.
- Cannot overwrite an existing certificate hash.

### Public Verifier

- Can query certificate existence and visible metadata.

## Functions

### `issueCertificate(bytes32 hash)`

Registers a new certificate fingerprint.

**Preconditions**

- Caller is an authorized issuer.
- `hash` is not zero.
- `hash` does not already exist in the registry.

**Postconditions**

- A new `Certificate` record exists at `registry[hash]`.
- `issuer` equals the caller address.
- `timestamp` equals the block timestamp of the successful transaction.
- `isValid` equals `true`.

**Failure Conditions**

- Reject unauthorized callers.
- Reject duplicate hashes.
- Reject empty or malformed hash input.

### `verifyCertificate(bytes32 hash) returns (bool exists, uint256 date, address institution, bool isValid)`

Public lookup for registry state.

**Preconditions**

- `hash` is provided in a valid bytes32 format.

**Postconditions**

- Returns `exists = true` when the hash is registered.
- Returns issuance timestamp and institution address when a record exists.
- Returns zero values when no record exists.
- Returns `isValid` to support future invalidation workflows.

## Events

### `NewRegistration(bytes32 hash, address issuer, uint256 date)`

Emitted after successful issuance.

## Privacy Rules

- No student names, IDs, grades, or document contents are stored on-chain.
- The only certificate identifier persisted on-chain is the SHA-256 hash.

## Invariants

- A certificate hash maps to at most one on-chain record.
- Once recorded, a certificate hash cannot be modified in place.
- Public verification never requires privileged access.