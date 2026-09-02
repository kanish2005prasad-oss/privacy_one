import { randomBytes } from "crypto";
import { LedgerEvent } from "./types";
import { hashRecord } from "./integrity";

// In-memory ledger
const ledger: LedgerEvent[] = [];

/**
 * Genesis hash used as the `previousHash` for the very first event in the ledger.
 */
const GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

export function appendEvent(eventType: string, eventData: any): LedgerEvent {
  const previousEvent = ledger.length > 0 ? ledger[ledger.length - 1] : null;
  const previousHash = previousEvent ? previousEvent.eventHash : GENESIS_HASH;

  const eventId = `EVT-${randomBytes(6).toString("hex").toUpperCase()}`;
  const timestamp = new Date().toISOString();

  // We hash everything EXCEPT the eventHash field itself, which is computed below
  const payloadToHash = {
    eventId,
    timestamp,
    eventType,
    eventData,
    previousHash
  };

  const eventHash = hashRecord(payloadToHash).hash;

  const newEvent: LedgerEvent = {
    ...payloadToHash,
    eventHash
  };

  ledger.push(newEvent);
  return newEvent;
}

export function getLedger(): LedgerEvent[] {
  return [...ledger]; // Return a shallow copy so the array reference can't be modified
}

export function verifyLedger(): boolean {
  for (let i = 0; i < ledger.length; i++) {
    const event = ledger[i];
    
    // 1. Verify previous hash matches the previous event's hash
    if (i === 0) {
      if (event.previousHash !== GENESIS_HASH) return false;
    } else {
      if (event.previousHash !== ledger[i-1].eventHash) return false;
    }

    // 2. Verify the hash of the current event is mathematically correct
    const payloadToHash = {
      eventId: event.eventId,
      timestamp: event.timestamp,
      eventType: event.eventType,
      eventData: event.eventData,
      previousHash: event.previousHash
    };

    if (hashRecord(payloadToHash).hash !== event.eventHash) return false;
  }
  
  return true;
}
