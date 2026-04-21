# Research: Blockchain Degree Registry

## Decision 1: Use a single-purpose Solidity registry contract with JavaScript tooling

- **Decision**: Implement one Solidity 0.8.x contract for certificate issuance and verification, while using JavaScript for deployment scripts, tests, and frontend integration.
- **Rationale**: The user preference is to keep the stack as close to JavaScript as possible, but EVM execution still requires a smart contract language. A single contract keeps the unavoidable non-JS surface minimal while preserving contract clarity.
- **Alternatives considered**:
  - Pure JavaScript simulation of blockchain state: rejected because it breaks the goal of demonstrating real immutable blockchain validation.
  - Multiple contracts for roles and registry state: rejected because it adds operational and cognitive complexity without prototype value.

## Decision 2: Use Web3.js with direct browser-to-chain interaction and no backend

- **Decision**: Connect the frontend directly to Ganache through Web3.js, without an application server or API layer.
- **Rationale**: This aligns exactly with the constitution's direct Web3 integration rule and reduces moving parts for a Windows-native demo.
- **Alternatives considered**:
  - Express or another backend proxy: rejected because it violates the simplicity goal and duplicates contract behavior.
  - Ethers-based architecture: viable, but rejected because the constitution already names Web3.js explicitly.

## Decision 3: Compute SHA-256 fingerprints in the browser before submission

- **Decision**: Hash uploaded documents client-side using SHA-256 before any blockchain interaction, and submit only the resulting digest to the contract.
- **Rationale**: This preserves privacy, avoids transmitting raw academic documents to the chain, and directly satisfies the constitution's cryptographic truth rule.
- **Alternatives considered**:
  - Hashing server-side: rejected because there is no backend in the target architecture.
  - Storing document metadata on-chain: rejected because it risks exposing sensitive information and exceeds prototype scope.

## Decision 4: Build the UI as high-quality static HTML and CSS with focused JavaScript modules

- **Decision**: Implement the UI as static pages with semantic HTML, a custom CSS system, and small JavaScript modules for registration and verification flows.
- **Rationale**: This matches the user's preference, keeps the project easy to explain and deploy, and still allows a polished interface with clear states and accessible interactions.
- **Alternatives considered**:
  - React or another SPA framework: rejected because it adds build complexity not justified for two core screens.
  - A single unstructured HTML file with inline scripts: rejected because maintainability and UI quality would degrade quickly.

## Decision 5: Validate locally on Ganache UI with scripted deployment and seeded authorized issuers

- **Decision**: Use Ganache UI as the local blockchain, deploy through a Node.js script, and seed a small list of authorized issuer accounts for demo scenarios.
- **Rationale**: This gives a deterministic local environment for TRL 5 demonstrations, supports role-based acceptance scenarios, and fits native Windows workflows.
- **Alternatives considered**:
  - Public testnet deployment: rejected because it increases setup friction and introduces network variability.
  - Manual contract deployment only through UI tools: rejected because scripted deployment is more repeatable and auditable.

## Decision 6: Define contracts as human-readable interface specifications instead of API schemas

- **Decision**: Document the smart contract interface and frontend behavior in markdown contracts under `contracts/`.
- **Rationale**: There is no REST or RPC application API to describe beyond the blockchain interface, so ABI-oriented and UI interaction contracts are the most relevant contract-first artifacts.
- **Alternatives considered**:
  - OpenAPI specification: rejected because there is no HTTP backend.
  - ABI JSON only: rejected because it is too low-level for cross-functional planning and UI alignment.