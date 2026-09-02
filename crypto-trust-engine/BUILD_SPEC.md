# Crypto Trust Engine — Build Spec (7 Capabilities)

Since all three of you are working independently, you should build your module as a self-contained security service, not wait for Pooja's frontend or Aadhesh's AI.

Your goal is:

If their modules are connected later, yours should plug in immediately. If they aren't ready yet, you should still be able to demonstrate your entire cryptographic workflow independently.

Based on the workflow document, your responsibility should cover the trust, consent, signature, integrity, and security-event flow.

## What you should do now

Build a Cryptographic Trust Engine independently.

Don't build UI-dependent code. Build APIs/functions around clear JSON inputs and outputs.

Your complete module should have 7 working capabilities

### 1. Patient cryptographic identity

Input:
```json
{
  "patientId": "PAT-001",
  "name": "Demo Patient"
}
```

Output:
```json
{
  "patientId": "PAT-001",
  "publicKey": "...",
  "keyCreatedAt": "...",
  "algorithm": "ECDSA-P256"
}
```

The private credential must never be exposed through your API.

### 2. Encrypt and decrypt medical data

Build this independently.

```
Medical Record
      ↓
AES-GCM Encrypt
      ↓
Encrypted Record
      ↓
AES-GCM Decrypt
      ↓
Original Record
```

Your functions:
- `encryptRecord(record)`
- `decryptRecord(encryptedRecord)`

Return a clean structure:
```json
{
  "ciphertext": "...",
  "iv": "...",
  "algorithm": "AES-256-GCM"
}
```

### 3. Hash every important record

Create: `hashRecord(data)`

Use SHA-256.

Input:
```json
{
  "prescriptionId": "RX-001",
  "drug": "Medicine X",
  "dose": "500mg"
}
```

Output:
```json
{
  "hash": "7f83a1..."
}
```

This gives you tamper detection.

The workflow explicitly uses hashes plus issuer identity and timestamps as provenance metadata for records.

### 4. Create a signed patient consent

This should be your main API.

Input:
```json
{
  "patientId": "PAT-001",
  "requestId": "REQ-001",
  "requester": {
    "id": "DR-001",
    "name": "Dr Arun",
    "organization": "ABC Hospital"
  },
  "requestedFields": ["allergies", "activeMedications"],
  "purpose": "Clinical Consultation",
  "expiresAt": "..."
}
```

Your engine should create:
```json
{
  "consentId": "CONSENT-001",
  "payload": {},
  "payloadHash": "...",
  "signature": "...",
  "algorithm": "ECDSA-P256",
  "status": "VALID"
}
```

The consent structure should bind the patient, requester, requested fields, purpose, expiry, timestamp, consent ID and signature together.

### 5. Verify consent and scope

This is a separate function.

```
verifyAccess({
    consent,
    requester,
    requestedFields
})
```

It checks:
1. Signature valid?
2. Consent expired?
3. Correct requester?
4. Requested fields allowed?
5. Payload modified?

Output:
```json
{
  "allowed": true,
  "signatureValid": true,
  "expired": false,
  "requesterValid": true,
  "scopeValid": true,
  "reason": "Verified patient consent"
}
```

This maps directly to the document's requirement that doctors see only authorized information and that access must respect the consent scope.

### 6. Prescription digital signature system

This should be a separate capability from patient consent.

Remember: there are two different signatures in your product.

**Patient signature** — used for: "I authorize this organization to access these fields."

**Doctor signature** — used for: "I issued this prescription and this exact prescription data has not changed."

So build generic functions:
- `createIdentity()`
- `signPayload()`
- `verifySignature()`

Then they can be used by:
- Patient → Consent Signature
- Doctor → Prescription Signature
- Pharmacy → Transaction Verification

The workflow specifically requires finalized prescriptions to carry a cryptographic signature and integrity hash so later modification can be detected.

### 7. Tamper detection

You should have a complete attack scenario ready.

Original:
```json
{ "drug": "Medicine X", "dose": "500mg" }
```

Sign it.

Then modify:
```json
{ "drug": "Medicine X", "dose": "1000mg" }
```

Run `verifySignature()`.

Output:
```
❌ SIGNATURE INVALID
Reason: Payload integrity compromised.
Original signed content does not match current content.
Action: BLOCK TRANSACTION
CREATE SECURITY ALERT
```

This is explicitly one of the workflow's fraud scenarios.

## Mobile phone / QR part

Since you want your work to be complete, build the phone authorization as an independent service flow too. Don't make the QR dependent on Pooja's frontend.

Create:

`POST /auth-session`

Input:
```json
{
  "patientId": "PAT-001",
  "consentPayload": {}
}
```

Output:
```json
{
  "sessionId": "SESSION-xyz",
  "nonce": "...",
  "expiresAt": "...",
  "authorizationUrl": "/mobile-authorize/SESSION-xyz"
}
```

Pooja can later convert that URL into a QR code, or you can generate the QR yourself for testing. The QR should contain only a short-lived reference/nonce, not medical data.

## Ideal architecture

```
                    CRYPTO TRUST ENGINE
                           │
        ┌──────────────────┼───────────────────┐
        │                  │                   │
        ▼                  ▼                   ▼
  IDENTITY SERVICE    CONSENT SERVICE    SIGNATURE SERVICE
        │                  │                   │
        ▼                  ▼                   ▼
 Patient Key       Scoped Consent      Sign / Verify
 Management        + Expiry            Any Transaction
        └──────────────────┼───────────────────┘
                           ▼
                    INTEGRITY SERVICE
                           │
                   Hash + Tamper Check
                           │
                           ▼
                     AUDIT EVENTS
```

This can later plug into: Pooja's Frontend → Your Crypto APIs → Aadhesh's AI Engine.

## Priority tiers

**Tier 1 — MUST WORK**
- ECDSA key generation
- SHA-256 hashing
- AES-GCM encryption
- Patient consent signing
- Doctor prescription signing
- Signature verification
- Scope + expiry validation
- Tamper detection

**Tier 2 — HIGH VALUE**
- QR authorization session
- Mobile authorization page
- WebAuthn/passkey biometric authentication

**Tier 3 — ONLY IF TIME**
- Append-only hash-chain audit ledger
- Key rotation
- Consent revocation
- Advanced blockchain integration

Do not spend time trying to integrate biometric fingerprint perfectly if it risks the core cryptography. The document itself treats phone biometric authentication as part of the QR fallback, while the core security model also emphasizes scoped access, signatures, hashes, and audit events.

## Test plan (module is "done" when all 7 pass)

1. Create patient identity → success.
2. Create access consent → signed.
3. Verify consent → valid.
4. Modify requested fields → invalid signature.
5. Prescription signed by doctor → valid.
6. Modify dosage → tampering detected.
7. Expired consent → access blocked.
