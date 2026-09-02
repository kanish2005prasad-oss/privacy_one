import { createIdentity, _getIdentityRecord } from "../src/identity";

console.log("Test 1: Create patient identity");

const identity = createIdentity({ patientId: "PAT-001", name: "Demo Patient" });

console.log(JSON.stringify(identity, null, 2));

// Check 1: private key must NOT be present on the returned object
const leaked = "privateKey" in (identity as unknown as Record<string, unknown>);
console.log(`Private key leaked in API response? ${leaked ? "❌ YES (BUG)" : "✅ no"}`);

// Check 2: the internal record DOES have the private key, and it's a valid PEM
const record = _getIdentityRecord("PAT-001");
const hasPrivateKey = !!record?.privateKey.includes("PRIVATE KEY");
console.log(`Private key exists internally?         ${hasPrivateKey ? "✅ yes" : "❌ NO (BUG)"}`);

// Check 3: two identities for two different patients must have different public keys
const identity2 = createIdentity({ patientId: "PAT-002", name: "Second Patient" });
const different = identity.publicKey !== identity2.publicKey;
console.log(`Two patients get different keys?        ${different ? "✅ yes" : "❌ NO (BUG)"}`);

if (!leaked && hasPrivateKey && different) {
  console.log("\n✅ Capability 1 (Patient Cryptographic Identity): PASS");
} else {
  console.log("\n❌ Capability 1: FAIL");
  process.exit(1);
}
