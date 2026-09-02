import { createIdentity } from "../src/identity";
import { createConsent, verifyAccess } from "../src/consent";

console.log("Test 5: Verify consent and scope\n");

createIdentity({ patientId: "PAT-001", name: "Demo Patient" });

const request = {
  patientId: "PAT-001",
  requestId: "REQ-001",
  requester: { id: "DR-001", name: "Dr Arun", organization: "ABC Hospital" },
  requestedFields: ["allergies", "activeMedications"],
  purpose: "Clinical Consultation",
  expiresAt: new Date(Date.now() + 3600000).toISOString()
};

const consent = createConsent(request);

const verificationResult = verifyAccess({
  consent,
  requester: { id: "DR-001" },
  requestedFields: ["allergies"]
});

console.log("Verification Result:");
console.log(JSON.stringify(verificationResult, null, 2));

const expectedValid = verificationResult.allowed && verificationResult.signatureValid;
console.log(`\nIs consent fully valid and allowed? ${expectedValid ? "✅ yes" : "❌ NO"}`);

// Check expired scenario (part of the 7-test demo scenario)
console.log("\nTesting expired consent blocked...");
const expiredRequest = {
  ...request,
  expiresAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
};
const expiredConsent = createConsent(expiredRequest);
const expiredResult = verifyAccess({
  consent: expiredConsent,
  requester: { id: "DR-001" },
  requestedFields: ["allergies"]
});
console.log("Expired consent allowed?", expiredResult.allowed ? "❌ NO (BUG)" : "✅ blocked successfully");

if (expectedValid && !expiredResult.allowed) {
  console.log("\n✅ Capability 5 (Consent Verification): PASS");
} else {
  console.log("\n❌ Capability 5: FAIL");
  process.exit(1);
}
