import { randomBytes, createCipheriv, createDecipheriv } from "crypto";
import { EncryptedRecord } from "./types";

/**
 * Internal master symmetric key for encrypting/decrypting records.
 * In a real deployment, this would be backed by a KMS or secure enclave.
 * For this module, it is kept in memory.
 */
const MASTER_KEY = randomBytes(32); // 256-bit key

export function encryptRecord(record: any): EncryptedRecord {
  const data = JSON.stringify(record);
  const iv = randomBytes(12); // 96-bit IV recommended for GCM
  
  const cipher = createCipheriv("aes-256-gcm", MASTER_KEY, iv);
  const encryptedText = Buffer.concat([cipher.update(data, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  // We append the auth tag to the ciphertext to fit the exact JSON shape required
  // Format: <encrypted_base64>:<authtag_base64>
  const ciphertextStr = `${encryptedText.toString("base64")}:${authTag.toString("base64")}`;

  return {
    ciphertext: ciphertextStr,
    iv: iv.toString("base64"),
    algorithm: "AES-256-GCM"
  };
}

export function decryptRecord(encryptedRecord: EncryptedRecord): any {
  if (encryptedRecord.algorithm !== "AES-256-GCM") {
    throw new Error(`Unsupported algorithm: ${encryptedRecord.algorithm}`);
  }

  const parts = encryptedRecord.ciphertext.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid ciphertext format. Missing or malformed auth tag.");
  }

  const [encryptedBase64, authTagBase64] = parts;
  const encryptedText = Buffer.from(encryptedBase64, "base64");
  const authTag = Buffer.from(authTagBase64, "base64");
  const iv = Buffer.from(encryptedRecord.iv, "base64");

  const decipher = createDecipheriv("aes-256-gcm", MASTER_KEY, iv);
  decipher.setAuthTag(authTag);

  const decryptedText = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  
  return JSON.parse(decryptedText.toString("utf8"));
}
