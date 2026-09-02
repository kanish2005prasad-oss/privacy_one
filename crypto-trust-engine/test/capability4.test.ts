import { createIdentity } from "../src/identity";
import { createConsent } from "../src/consent";

console.log("Test 4: Create a signed patient consent\n");

// 1. Setup Patient Identity
createIdentity({ patientId: "PAT-001", name: "Demo Patient" });

// 2. Request Consent
const request = {
  patientId: "PAT-001",
  requestId: "REQ-001",
  requester: {
    id: "DR-001",
    name: "Dr Arun",
    organization: "ABC Hospital"
  },
  requestedFields: ["allergies", "activeMedications"],
  purpose: "Clinical Consultation",
  expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hr from now
};

const consent = createConsent(request);

console.log("Signed Consent Object:");
console.log(JSON.stringify(consent, null, 2));

const hasConsentId = typeof consent.consentId === "string";
const hasSignature = typeof consent.signature === "string";
const hasPayloadHash = typeof consent.payloadHash === "string";

console.log(`\nHas consent ID? ${hasConsentId ? "✅ yes" : "❌ NO"}`);
console.log(`Has signature? ${hasSignature ? "✅ yes" : "❌ NO"}`);
console.log(`Has payload hash? ${hasPayloadHash ? "✅ yes" : "❌ NO"}`);

if (hasConsentId && hasSignature && hasPayloadHash) {
  console.log("\n✅ Capability 4 (Patient Consent Signing): PASS");
} else {
  console.log("\n❌ Capability 4: FAIL");
  process.exit(1);
}
