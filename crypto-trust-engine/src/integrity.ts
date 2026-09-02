import { createHash } from "crypto";
import { HashedRecord } from "./types";

/**
 * Deterministic, canonical serialization of a JSON object.
 * Sorts all keys recursively so that { "a": 1, "b": 2 } and { "b": 2, "a": 1 }
 * always produce the exact same JSON string.
 */
export function canonicalize(data: any): string {
  if (data === null || typeof data !== "object") {
    return JSON.stringify(data) ?? "null"; // Handle undefined primitives gracefully
  }

  if (Array.isArray(data)) {
    const arrayElements = data.map((item) => {
      if (item === undefined) return "null";
      return canonicalize(item);
    });
    return `[${arrayElements.join(",")}]`;
  }

  const keys = Object.keys(data).sort();
  const keyVals = keys.map((key) => {
    const value = data[key];
    if (value === undefined) return ""; // JSON.stringify ignores undefined in objects
    return `${JSON.stringify(key)}:${canonicalize(value)}`;
  }).filter((kv) => kv !== ""); // Filter out undefined properties

  return `{${keyVals.join(",")}}`;
}

/**
 * Capability 3 — Hash every important record.
 * Uses SHA-256 and the deterministic canonicalization function
 * to produce a stable hash for any JSON object.
 */
export function hashRecord(data: any): HashedRecord {
  const canonicalString = canonicalize(data);
  const hash = createHash("sha256").update(canonicalString, "utf8").digest("hex");
  return { hash };
}
