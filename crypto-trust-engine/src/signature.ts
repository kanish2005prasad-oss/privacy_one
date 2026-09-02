import { createSign, createVerify } from "crypto";
import { _getIdentityRecord, _getPublicKeys } from "./identity";
import { hashRecord, canonicalize } from "./integrity";
import { GenericSignedPayload } from "./types";

/**
 * Generic signature function used across the product.
 * (e.g. Patient signing consent, Doctor signing prescription).
 */
export function signPayload<T>(signerId: string, payload: T): GenericSignedPayload<T> {
  const identity = _getIdentityRecord(signerId);
  if (!identity) {
    throw new Error(`Signer identity not found for ID: ${signerId}`);
  }

  // Hash the payload for integrity tracking
  const hashed = hashRecord(payload);
  
  // Create signature over the canonicalized payload using ECDSA
  const sign = createSign("SHA256");
  sign.update(canonicalize(payload), "utf8");
  sign.end();
  
  const signature = sign.sign(identity.privateKey, "base64");

  return {
    payload,
    payloadHash: hashed.hash,
    signature,
    signerId,
    algorithm: "ECDSA-P256"
  };
}

/**
 * Generic verification function used to validate any signed payload.
 */
export function verifySignature<T>(signedPayload: GenericSignedPayload<T>): boolean {
  const publicKeys = _getPublicKeys(signedPayload.signerId);
  if (publicKeys.length === 0) {
    return false; // Signer identity unknown
  }

  // 1. Verify hash matches (Tamper detection)
  const currentHash = hashRecord(signedPayload.payload).hash;
  if (currentHash !== signedPayload.payloadHash) {
    return false; // Payload was modified
  }

  // 2. Verify cryptographic signature mathematically against any known key
  for (const pubKey of publicKeys) {
    const verify = createVerify("SHA256");
    verify.update(canonicalize(signedPayload.payload), "utf8");
    verify.end();
    if (verify.verify(pubKey, signedPayload.signature, "base64")) {
      return true; // Valid against one of the historical or active keys
    }
  }

  return false;
}
