import { randomBytes } from "crypto";
import { ConsentRequest, SignedConsent, VerifyAccessInput, VerifyAccessResult, GenericSignedPayload } from "./types";
import { signPayload, verifySignature } from "./signature";

// In-memory revocation list storing revoked consent IDs
const revokedConsents = new Set<string>();

/**
 * Capability 4 — Create a signed patient consent.
 * Binds the patient, requester, requested fields, purpose, and expiry together.
 */
export function createConsent(input: ConsentRequest): SignedConsent {
  // The patient signs their own consent payload
  const signed = signPayload(input.patientId, input);

  return {
    consentId: `CONSENT-${randomBytes(4).toString("hex").toUpperCase()}`,
    payload: signed.payload,
    payloadHash: signed.payloadHash,
    signature: signed.signature,
    algorithm: signed.algorithm,
    status: "VALID"
  };
}

/**
 * Tier 3 — Consent Revocation.
 * Explicitly revokes a consent before its natural expiry.
 */
export function revokeConsent(consentId: string, patientId: string): void {
  // In a real system, you'd verify the caller is the patient who owns the consent.
  // For the hackathon demo, we just add the consentId to the revocation list.
  revokedConsents.add(consentId);
}

/**
 * Capability 5 — Verify consent and scope.
 */
export function verifyAccess(input: VerifyAccessInput): VerifyAccessResult {
  const { consent, requester, requestedFields } = input;
  
  // 1 & 5. Verify cryptographic signature and payload integrity
  const genericPayload: GenericSignedPayload<any> = {
    payload: consent.payload,
    payloadHash: consent.payloadHash,
    signature: consent.signature,
    signerId: consent.payload.patientId, // Patient signs their own consent
    algorithm: consent.algorithm
  };
  
  const signatureValid = verifySignature(genericPayload);
  
  // 2. Check Expiry
  const now = new Date();
  const expiresAt = new Date(consent.payload.expiresAt);
  const expired = now > expiresAt;
  
  // 3. Check Requester
  const requesterValid = consent.payload.requester.id === requester.id;
  
  // 4. Check Scope
  const scopeValid = requestedFields.every(field => 
    consent.payload.requestedFields.includes(field)
  );

  // 6. Check Revocation (Tier 3)
  const isRevoked = revokedConsents.has(consent.consentId);
  
  const allowed = signatureValid && !expired && requesterValid && scopeValid && !isRevoked;
  
  let reason = "Verified patient consent";
  if (!signatureValid) reason = "Signature or payload integrity check failed";
  else if (isRevoked) reason = "Consent has been revoked by the patient";
  else if (expired) reason = "Consent has expired";
  else if (!requesterValid) reason = "Requester ID does not match consent";
  else if (!scopeValid) reason = "Requested fields exceed consent scope";
  
  return {
    allowed,
    signatureValid,
    expired,
    requesterValid,
    scopeValid,
    reason
  };
}
