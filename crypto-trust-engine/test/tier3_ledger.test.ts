import { appendEvent, verifyLedger, getLedger } from "../src/ledger";

console.log("Tier 3: Append-only hash-chain audit ledger\n");

// Add events
const event1 = appendEvent("CONSENT_CREATED", { consentId: "CONSENT-123" });
const event2 = appendEvent("PRESCRIPTION_SIGNED", { prescriptionId: "RX-123" });

console.log("Ledger Chain:");
const chain = getLedger();
chain.forEach((evt, idx) => {
  console.log(`[Event ${idx + 1}] ${evt.eventType}`);
  console.log(`  Prev: ${evt.previousHash.substring(0, 16)}...`);
  console.log(`  Hash: ${evt.eventHash.substring(0, 16)}...`);
});

const isValid = verifyLedger();
console.log(`\nIs ledger cryptographically valid? ${isValid ? "✅ yes" : "❌ NO"}`);

// Tamper test
console.log("\nTesting ledger tamper detection...");
chain[0].eventData.consentId = "CONSENT-999"; // malicious change to past event

const isTamperedValid = verifyLedger();
console.log(`Tampered ledger valid? ${isTamperedValid ? "❌ NO (BUG)" : "✅ detected correctly"}`);

if (isValid && !isTamperedValid) {
  console.log("\n✅ Tier 3 (Audit Ledger): PASS");
} else {
  console.log("\n❌ Tier 3 (Audit Ledger): FAIL");
  process.exit(1);
}
