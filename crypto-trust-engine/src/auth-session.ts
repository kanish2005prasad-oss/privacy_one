import { randomBytes } from "crypto";
import { AuthSessionRequest, AuthSessionResponse } from "./types";

/**
 * Tier 2 — Mobile phone / QR authorization session.
 * Generates a short-lived session and nonce for a mobile device to authenticate
 * a pending consent request, without passing the full medical payload in the URL/QR.
 */
export function createAuthSession(request: AuthSessionRequest): AuthSessionResponse {
  // Generate a random 12-character hex ID for the session
  const sessionId = `SESSION-${randomBytes(6).toString("hex").toUpperCase()}`;
  
  // Nonce for cryptographic challenge-response to prevent replay attacks
  const nonce = randomBytes(16).toString("base64");
  
  // Session is strictly short-lived (e.g., 5 minutes)
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  
  // The URL the mobile app/browser should navigate to
  const authorizationUrl = `/mobile-authorize/${sessionId}`;

  return {
    sessionId,
    nonce,
    expiresAt,
    authorizationUrl
  };
}
