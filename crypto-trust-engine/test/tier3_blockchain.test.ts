import { appendEvent, getLedger } from "../src/ledger";
import { anchorLedgerToBlockchain } from "../src/blockchain";

console.log("Tier 3: Advanced Blockchain Integration\n");

// Ensure ledger has at least one event
appendEvent("SYSTEM_INIT", { status: "OK" });

const ledger = getLedger();
const tipHash = ledger[ledger.length - 1].eventHash;

console.log(`Anchoring Ledger Tip Hash: ${tipHash.substring(0, 16)}...`);

const anchorReceipt = anchorLedgerToBlockchain(ledger);

console.log("\nBlockchain Anchor Receipt:");
console.log(JSON.stringify(anchorReceipt, null, 2));

const hasTxId = anchorReceipt.txId.startsWith("0x");
const matchesTip = anchorReceipt.anchoredHash === tipHash;
const hasBlockNumber = typeof anchorReceipt.blockNumber === "number";

console.log(`\nValid transaction ID? ${hasTxId ? "✅ yes" : "❌ NO"}`);
console.log(`Anchored correct hash? ${matchesTip ? "✅ yes" : "❌ NO"}`);

if (hasTxId && matchesTip && hasBlockNumber) {
  console.log("\n✅ Tier 3 (Blockchain Integration): PASS");
} else {
  console.log("\n❌ Tier 3 (Blockchain Integration): FAIL");
  process.exit(1);
}
