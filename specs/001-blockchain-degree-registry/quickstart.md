# Quickstart: Blockchain Degree Registry

## Goal

Run the local TRL 5 prototype on Windows with Ganache UI, issue a certificate hash, and verify it from the public portal.

## Prerequisites

- Node.js 22 LTS installed
- Ganache UI installed and available on Windows
- A modern desktop browser
- Repository cloned locally

> Tested with Node.js 24 LTS and Ganache UI 2.x (`http://127.0.0.1:7545`, chainId 1337).

## 1. Prepare the local blockchain

1. Open Ganache UI.
2. Create or open a local workspace with an RPC endpoint available on the local machine.
3. Keep at least two funded accounts available:
   - one account acting as the contract owner or setup account
   - one or more accounts acting as authorized universities

## 2. Install project dependencies

From the repository root:

```powershell
npm install
```

## 2b. Configure environment variables

1. Copy `.env.example` into `.env`.
2. Set `GANACHE_RPC_URL`, `CHAIN_ID`, and `DEPLOYER_PRIVATE_KEY` from your active Ganache workspace.
3. Set `AUTHORIZED_ISSUERS` to one Ganache account you plan to use as issuer (for example, account[1]).

## 3. Compile and deploy the registry contract

From the repository root:

```powershell
npm run deploy
```

Expected outcome:

- The registry contract is deployed to the local Ganache network.
- The deployment output records the contract address and the authorized issuer accounts for demo use.

Then seed authorized issuers on-chain:

```powershell
npm run seed:issuers
```

## 4. Start the frontend locally

From the repository root:

```powershell
npm run start
```

Expected outcome:

- A local static server hosts the frontend pages.
- The registration and verification screens are available in the browser.

## 5. Registration flow

1. Open the registration screen.
2. Enter an authorized issuer wallet address.
3. Upload a sample certificate file.
4. Confirm that the browser generates a SHA-256 hash before submission.
5. Submit the issuance transaction.
6. Wait for transaction confirmation and note the returned hash and timestamp.

Expected outcome:

- The new certificate hash is recorded on-chain.
- The UI confirms the issuer, transaction outcome, and registration time in clear language.
- Unauthorized wallet addresses are rejected before transaction submission.

## 6. Verification flow

1. Open the public verification screen.
2. Paste the certificate hash produced during registration.
3. Run the verification.

Expected outcome:

- The UI displays whether the certificate exists.
- For valid results, it shows institution, date, and status.
- For unknown hashes, it clearly states that no authenticity proof exists.

## 7. Acceptance checks

- Verify that a duplicate registration attempt is rejected.
- Verify that an unauthorized account cannot issue a certificate.
- Verify that no PII is visible in blockchain state or UI outputs.
- Verify that a non-technical user can interpret the result without blockchain terminology.

## 8. Run automated tests

```powershell
npm test
```

Expected: all tests pass (contract + integration suites). Tests use an in-process Ganache instance and do not require Ganache UI to be running.

> **Tip for registration**: Use the "Use Ganache account" button on the registration page to pick an active account directly, with no manual address copy-pasting.

> **Tip for verification**: A valid certificate shows a green "Authentic certificate" badge with issuer address, registration date, and validity status. An unknown hash shows a yellow "No record found" badge with a plain-language explanation.
