import { generateKeyPairSync, KeyObject } from "crypto";
import { CreateIdentityInput, PublicIdentity, IdentityRecord } from "./types";

/**
 * In-memory identity store, keyed by patientId.
 * Holds the FULL record (including the private key) for internal use only
 * by other trust-engine modules (e.g. signature.ts needs the private key
 * to sign a consent on the patient's behalf).
 *
 * This Map is module-private — it is not exported, so nothing outside
 * identity.ts can reach into it directly. That is what enforces
 * "the private credential must never be exposed through the API":
 * there is no code path that returns a private key to a caller.
 *
 * In a real deployment this Map would be replaced by an HSM, a secure
 * enclave, or an encrypted-at-rest keystore — never plaintext in memory
 * long-term. For the hackathon demo, in-memory is fine and keeps the
 * module dependency-free.
 */
const identityStore = new Map<string, IdentityRecord>();

/**
 * Capability 1 — Patient Cryptographic Identity.
 *
 * Generates an ECDSA P-256 keypair for a patient and returns ONLY the
 * public identity. The private key is generated, stored internally,
 * and never returned.
 *
 * Why ECDSA-P256 specifically:
 * - It's the same curve behind WebAuthn/passkeys (Tier 2 of the plan),
 *   so if the phone-biometric flow is added later, the signature math
 *   is consistent across the whole system.
 * - Small keys/signatures compared to RSA — matters for QR payloads
 *   and for keeping consent JSON objects lightweight.
 *
 * What breaks if this step is skipped or done wrong:
 * - If you generate a NEW keypair every time instead of storing and
 *   reusing one per patientId, signatures from the same patient won't
 *   verify against each other — every consent would look like it came
 *   from a different, unrelated identity.
 * - If the private key is ever included in the return value (even
 *   accidentally, e.g. by spreading `...record` instead of picking
 *   fields), anyone who can call this function could forge that
 *   patient's signature. This is the single most important boundary
 *   in the whole engine — get it wrong here and every downstream
 *   consent/signature guarantee is void.
 */
export function createIdentity(input: CreateIdentityInput): PublicIdentity {
  const { publicKey, privateKey } = generateKeyPairSync("ec", {
    namedCurve: "P-256",
  });

  const publicKeyPem = keyToPem(publicKey);
  const privateKeyPem = keyToPem(privateKey);
  const keyCreatedAt = new Date().toISOString();

  const record: IdentityRecord = {
    patientId: input.patientId,
    publicKey: publicKeyPem,
    privateKey: privateKeyPem,
    keyCreatedAt,
    algorithm: "ECDSA-P256",
  };

  identityStore.set(input.patientId, record);

  // Explicitly construct the return value field-by-field rather than
  // spreading `record` — this is a deliberate guard so a future edit
  // to IdentityRecord (e.g. adding another sensitive field) can't
  // silently leak through this function.
  return {
    patientId: record.patientId,
    publicKey: record.publicKey,
    keyCreatedAt: record.keyCreatedAt,
    algorithm: record.algorithm,
  };
}

/**
 * Tier 3 — Key Rotation.
 * Archives the current active key and generates a new one.
 */
export function rotateIdentityKey(patientId: string): PublicIdentity {
  const existing = identityStore.get(patientId);
  if (!existing) {
    throw new Error(`Identity not found for ${patientId}`);
  }

  const archiveRecord = {
    publicKey: existing.publicKey,
    privateKey: existing.privateKey,
    archivedAt: new Date().toISOString()
  };

  const { publicKey, privateKey } = generateKeyPairSync("ec", {
    namedCurve: "P-256",
  });

  existing.publicKey = keyToPem(publicKey);
  existing.privateKey = keyToPem(privateKey);
  existing.keyCreatedAt = new Date().toISOString();
  existing.archivedKeys = existing.archivedKeys || [];
  existing.archivedKeys.push(archiveRecord);

  return {
    patientId: existing.patientId,
    publicKey: existing.publicKey,
    keyCreatedAt: existing.keyCreatedAt,
    algorithm: existing.algorithm
  };
}

/**
 * Internal-only accessor for other trust-engine modules that legitimately
 * need the private key (e.g. signature.ts, to sign on the patient's
 * behalf). NOT exported from index.ts — only usable by code inside this
 * package, never by an external API consumer.
 */
export function _getIdentityRecord(patientId: string): IdentityRecord | undefined {
  return identityStore.get(patientId);
}

/** Internal-only accessor for just the public key, used during verification. */
export function _getPublicKey(patientId: string): string | undefined {
  return identityStore.get(patientId)?.publicKey;
}

/** Internal-only accessor to get all public keys (active + archived). */
export function _getPublicKeys(patientId: string): string[] {
  const record = identityStore.get(patientId);
  if (!record) return [];
  const keys = [record.publicKey];
  if (record.archivedKeys) {
    keys.push(...record.archivedKeys.map(k => k.publicKey));
  }
  return keys;
}

function keyToPem(key: KeyObject): string {
  const type = key.type === "private" ? "pkcs8" : "spki";
  return key
    .export({ type: type as "pkcs8" | "spki", format: "pem" })
    .toString();
}
