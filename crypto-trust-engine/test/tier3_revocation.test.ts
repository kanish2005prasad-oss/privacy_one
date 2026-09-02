import { createIdentity } from "../src/identity";
import { createConsent, verifyAccess, revokeConsent } from "../src/consent";

console.log("Tier 3: Consent Revocation\n");

createIdentity({ patientId: "PAT-REV", name: "Revocation Test Patient" });

const request = {
  patientId: "PAT-REV",
  requestId: "REQ-REV",
  requester: { id: "DR-001", name: "Dr Arun", organization: "ABC Hospital" },
  requestedFields: ["allergies", "activeMedications"],
  purpose: "Clinical Consultation",
  expiresAt: new Date(Date.now() + 3600000).toISOString()
};

const consent = createConsent(request);

console.log("Initial verification (should be allowed):");
const initialResult = verifyAccess({
  consent,
  requester: { id: "DR-001" },
  requestedFields: ["allergies"]
});
console.log(initialResult.allowed ? "✅ yes" : "❌ NO");

console.log("\nRevoking consent...");
revokeConsent(consent.consentId, "PAT-REV");

console.log("\nVerification after revocation (should be blocked):");
const revokedResult = verifyAccess({
  consent,
  requester: { id: "DR-001" },
  requestedFields: ["allergies"]
});

console.log(`Allowed? ${revokedResult.allowed ? "❌ YES (BUG)" : "✅ blocked successfully"}`);
console.log(`Reason: ${revokedResult.reason}`);

if (initialResult.allowed && !revokedResult.allowed && revokedResult.reason === "Consent has been revoked by the patient") {
  console.log("\n✅ Tier 3 (Consent Revocation): PASS");
} else {
  console.log("\n❌ Tier 3 (Consent Revocation): FAIL");
  process.exit(1);
}
