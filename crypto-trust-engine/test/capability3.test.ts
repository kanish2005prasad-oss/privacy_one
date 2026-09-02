import { hashRecord } from "../src/integrity";

console.log("Test 3: Hash every important record\n");

const record1 = {
  prescriptionId: "RX-001",
  drug: "Medicine X",
  dose: "500mg"
};

// record2 has the exact same data but keys in a different order
const record2 = {
  dose: "500mg",
  prescriptionId: "RX-001",
  drug: "Medicine X"
};

console.log("Record 1:");
console.log(JSON.stringify(record1, null, 2));
const hash1 = hashRecord(record1);
console.log(`\nHash 1: ${hash1.hash}`);

console.log("\nRecord 2 (same data, keys reordered):");
console.log(JSON.stringify(record2, null, 2));
const hash2 = hashRecord(record2);
console.log(`\nHash 2: ${hash2.hash}`);

const deterministic = hash1.hash === hash2.hash;
const hasCorrectShape = typeof hash1.hash === "string" && Object.keys(hash1).length === 1;

console.log(`\nAre hashes deterministically identical? ${deterministic ? "✅ yes" : "❌ NO"}`);
console.log(`Valid shape returned? ${hasCorrectShape ? "✅ yes" : "❌ NO"}`);

if (deterministic && hasCorrectShape) {
  console.log("\n✅ Capability 3 (SHA-256 Hashing): PASS");
} else {
  console.log("\n❌ Capability 3: FAIL");
  process.exit(1);
}
