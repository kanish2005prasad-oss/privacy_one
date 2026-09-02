import { createIdentity } from "../src/identity";
import { signPayload, verifySignature } from "../src/signature";

console.log("Test 6: Prescription digital signature system\n");

// 1. Setup Doctor Identity
// We reuse createIdentity (internally keys by 'patientId', but it just maps ID -> KeyPair)
createIdentity({ patientId: "DR-001", name: "Dr Arun" });

const prescription = {
  prescriptionId: "RX-001",
  patientId: "PAT-001",
  drug: "Medicine X",
  dose: "500mg"
};

console.log("Original Prescription:");
console.log(JSON.stringify(prescription, null, 2));

// 2. Doctor signs prescription
const signedPrescription = signPayload("DR-001", prescription);

console.log("\nSigned Prescription:");
console.log(JSON.stringify(signedPrescription, null, 2));

// 3. Verify it (using the generic function built alongside signPayload)
const isValid = verifySignature(signedPrescription);
console.log(`\nSignature mathematically valid? ${isValid ? "✅ yes" : "❌ NO"}`);

if (isValid) {
  console.log("\n✅ Capability 6 (Prescription Digital Signature): PASS");
} else {
  console.log("\n❌ Capability 6: FAIL");
  process.exit(1);
}
