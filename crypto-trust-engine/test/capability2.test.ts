import { encryptRecord, decryptRecord } from "../src/encryption";

console.log("Test 2: Encrypt and decrypt medical data\n");

const originalRecord = {
  prescriptionId: "RX-001",
  drug: "Medicine X",
  dose: "500mg"
};

console.log("Original Record:");
console.log(JSON.stringify(originalRecord, null, 2));

const encrypted = encryptRecord(originalRecord);
console.log("\nEncrypted Record:");
console.log(JSON.stringify(encrypted, null, 2));

// Checks
const hasCiphertext = typeof encrypted.ciphertext === "string";
const hasIv = typeof encrypted.iv === "string";
const correctAlgorithm = encrypted.algorithm === "AES-256-GCM";
console.log(`\nValid shape returned? ${(hasCiphertext && hasIv && correctAlgorithm) ? "✅ yes" : "❌ NO"}`);

let decrypted: any;
let matchesOriginal = false;
try {
  decrypted = decryptRecord(encrypted);
  console.log("\nDecrypted Record:");
  console.log(JSON.stringify(decrypted, null, 2));
  matchesOriginal = JSON.stringify(decrypted) === JSON.stringify(originalRecord);
} catch (e) {
  console.log(`\n❌ Decryption failed: ${(e as Error).message}`);
}

console.log(`\nDecrypted matches original? ${matchesOriginal ? "✅ yes" : "❌ NO"}`);

// Check tamper detection in GCM
console.log("\nTesting tamper resistance...");
try {
  const parts = encrypted.ciphertext.split(":");
  const tamperedBase64 = Buffer.from(parts[0], "base64");
  tamperedBase64[0] ^= 1; // flip a bit in ciphertext
  const tamperedEncrypted = {
    ...encrypted,
    ciphertext: `${tamperedBase64.toString("base64")}:${parts[1]}`
  };
  decryptRecord(tamperedEncrypted);
  console.log("❌ NO (BUG: decryption succeeded after tampering)");
} catch (e) {
  console.log("✅ yes (Auth tag failed successfully)");
}

if (hasCiphertext && hasIv && correctAlgorithm && matchesOriginal) {
  console.log("\n✅ Capability 2 (AES-GCM encrypt/decrypt): PASS");
} else {
  console.log("\n❌ Capability 2: FAIL");
  process.exit(1);
}
