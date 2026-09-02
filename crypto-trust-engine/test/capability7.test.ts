import { createIdentity } from "../src/identity";
import { signPayload, verifySignature } from "../src/signature";

console.log("Test 7: Tamper detection\n");

createIdentity({ patientId: "DR-001", name: "Dr Arun" });

const originalPrescription = {
  prescriptionId: "RX-001",
  patientId: "PAT-001",
  drug: "Medicine X",
  dose: "500mg"
};

const signedPrescription = signPayload("DR-001", originalPrescription);
console.log("Original signed prescription signature valid?", verifySignature(signedPrescription) ? "✅ yes" : "❌ NO");

// Tamper with the payload (e.g. malicious intermediary alters the dose)
const tamperedPrescription = {
  ...signedPrescription,
  payload: {
    ...signedPrescription.payload,
    dose: "1000mg" // malicious modification
  }
};

console.log("\nTampered Payload:");
console.log(JSON.stringify(tamperedPrescription.payload, null, 2));

const isTamperedValid = verifySignature(tamperedPrescription);

if (!isTamperedValid) {
  console.log("\n❌ SIGNATURE INVALID");
  console.log("Reason: Payload integrity compromised.");
  console.log("Original signed content does not match current content.");
  console.log("Action: BLOCK TRANSACTION");
  console.log("CREATE SECURITY ALERT");
  console.log("\n✅ Capability 7 (Tamper Detection): PASS");
} else {
  console.log("\n❌ Capability 7: FAIL (Tampering was not detected)");
  process.exit(1);
}
