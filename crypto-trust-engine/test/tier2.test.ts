import { createAuthSession } from "../src/auth-session";

console.log("Tier 2: Mobile phone / QR part - Auth Session\n");

const request = {
  patientId: "PAT-001",
  consentPayload: {
    requestedFields: ["allergies"]
  }
};

const session = createAuthSession(request);

console.log("Auth Session Response:");
console.log(JSON.stringify(session, null, 2));

// Checks
const hasSessionId = typeof session.sessionId === "string" && session.sessionId.startsWith("SESSION-");
const hasNonce = typeof session.nonce === "string";
const hasExpiresAt = typeof session.expiresAt === "string";
const hasAuthUrl = session.authorizationUrl === `/mobile-authorize/${session.sessionId}`;

console.log(`\nValid shape returned? ${(hasSessionId && hasNonce && hasExpiresAt && hasAuthUrl) ? "✅ yes" : "❌ NO"}`);

if (hasSessionId && hasNonce && hasExpiresAt && hasAuthUrl) {
  console.log("\n✅ Tier 2 (QR Auth Session): PASS");
} else {
  console.log("\n❌ Tier 2: FAIL");
  process.exit(1);
}
