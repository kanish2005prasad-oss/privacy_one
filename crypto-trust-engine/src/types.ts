/**
 * Shared JSON-shaped interfaces used across the Crypto Trust Engine.
 * Kept in one file so every module (identity, consent, signature, etc.)
 * agrees on the exact same shapes when data crosses a function boundary.
 */

// ---- Capability 1: Patient Cryptographic Identity ----

export interface CreateIdentityInput {
  patientId: string;
  name: string;
}

export interface PublicIdentity {
  patientId: string;
  publicKey: string; // PEM-encoded public key — safe to expose
  keyCreatedAt: string; // ISO 8601 timestamp
  algorithm: "ECDSA-P256";
}

/**
 * The full keypair, including the PRIVATE key.
 * This type only ever lives inside the engine's internal storage —
 * it must never be the return type of a public-facing API function.
 */
export interface IdentityRecord extends PublicIdentity {
  privateKey: string; // PEM-encoded private key — NEVER exposed via API
  archivedKeys?: { publicKey: string; privateKey: string; archivedAt: string }[];
}

// ---- Capability 2: Encrypt and decrypt medical data ----

export interface EncryptedRecord {
  ciphertext: string;
  iv: string;
  algorithm: "AES-256-GCM";
}

// ---- Capability 3: Hash every important record ----

export interface HashedRecord {
  hash: string;
}

// ---- Capability 4 & 6: Signatures and Consent ----

export interface ConsentRequest {
  patientId: string;
  requestId: string;
  requester: {
    id: string;
    name: string;
    organization: string;
  };
  requestedFields: string[];
  purpose: string;
  expiresAt: string;
}

export interface SignedConsent {
  consentId: string;
  payload: ConsentRequest; // Or just the fields without patientId? The spec shows payload: {}
  payloadHash: string;
  signature: string;
  algorithm: "ECDSA-P256";
  status: "VALID" | "INVALID";
}

export interface GenericSignedPayload<T> {
  payload: T;
  payloadHash: string;
  signature: string;
  signerId: string;
  algorithm: "ECDSA-P256";
}

// ---- Capability 5: Verify Consent ----

export interface VerifyAccessInput {
  consent: SignedConsent;
  requester: {
    id: string;
    name?: string;
    organization?: string;
  };
  requestedFields: string[];
}

export interface VerifyAccessResult {
  allowed: boolean;
  signatureValid: boolean;
  expired: boolean;
  requesterValid: boolean;
  scopeValid: boolean;
  reason: string;
}

// ---- Tier 2: QR Auth Session ----

export interface AuthSessionRequest {
  patientId: string;
  consentPayload: any;
}

export interface AuthSessionResponse {
  sessionId: string;
  nonce: string;
  expiresAt: string;
  authorizationUrl: string;
}

// ---- Tier 3: Ledger and Audit ----

export interface LedgerEvent {
  eventId: string;
  timestamp: string;
  eventType: string;
  eventData: any;
  previousHash: string;
  eventHash: string;
}
