import { createIdentity, rotateIdentityKey } from "../src/identity";
import { signPayload, verifySignature } from "../src/signature";

console.log("Tier 3: Key Rotation\n");

// 1. Create original identity
createIdentity({ patientId: "PAT-ROT", name: "Rotation Test Patient" });

// 2. Sign a payload with the original key
const payload1 = { message: "Signed with active key 1" };
const signed1 = signPayload("PAT-ROT", payload1);

console.log("Original Signature valid?", verifySignature(signed1) ? "✅ yes" : "❌ NO");

// 3. Rotate the key
console.log("\nRotating key...");
rotateIdentityKey("PAT-ROT");

// 4. Sign a new payload with the new key
const payload2 = { message: "Signed with active key 2" };
const signed2 = signPayload("PAT-ROT", payload2);

console.log("New Signature valid?", verifySignature(signed2) ? "✅ yes" : "❌ NO");

// 5. Verify the old signature is still valid (it should check against archived keys)
console.log("Old Signature still valid after rotation?", verifySignature(signed1) ? "✅ yes" : "❌ NO");

if (verifySignature(signed1) && verifySignature(signed2)) {
  console.log("\n✅ Tier 3 (Key Rotation): PASS");
} else {
  console.log("\n❌ Tier 3 (Key Rotation): FAIL");
  process.exit(1);
}
