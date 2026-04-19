# Project Constitution: Academic Authenticity Blockchain (AAB)

## 1. Vision & Purpose
To create a functional, low-complexity blockchain prototype (TRL 5) that demonstrates the immutable verification of academic degrees. The primary goal is to mitigate the risk of certificate forgery in public institutions through cryptographic transparency and decentralized validation.

## 2. Core Technical Principles
* **Technical Simplicity:** The system shall prioritize a lean architecture using native Windows development tools to ensure rapid deployment, stability, and ease of demonstration.
* **Cryptographic Truth:** Verification is based strictly on the **SHA-256 hashing algorithm**. If the digital fingerprint of a document matches the blockchain record, the document is considered authentic.

* **Direct Web3 Integration:** The frontend communicates directly with the decentralized ledger via **Web3.js**, eliminating the need for intermediary backend servers or complex external database synchronization.

## 3. Development & Engineering Standards
* **Contract-First Approach:** All system behaviors, data structures, and validation logic must be predefined via **Speckit** (or similar interface specifications) before implementation.
* **Local Validation:** Initial testing and readiness level (TRL 5) validation will be conducted using **Ganache UI** within a native Windows environment.
* **Data Sovereignty:** To ensure privacy, no personally identifiable information (PII) shall be stored on the blockchain. Only cryptographic proofs (hashes) will reside on the public ledger.

## 4. Operational Governance
* **Immutability:** Once a certificate hash is recorded, the protocol ensures it cannot be altered or deleted, providing a permanent audit trail.
* **Transparency:** All source code and smart contracts are managed via **GitHub** to ensure version control, integrity, and academic transparency.
* **Accessibility:** The verification interface must remain intuitive, allowing non-technical stakeholders to verify credentials without specialized blockchain knowledge.

## 5. Academic Compliance
This project is developed under the framework of the **UNAD Intellectual Property Statutes** (Agreement 06 of 2008), ensuring the balance between individual innovation and institutional academic standards.