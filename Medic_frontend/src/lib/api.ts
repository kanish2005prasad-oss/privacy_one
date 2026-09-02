import { createClient } from "./supabase/client";

const AI_API_URL = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:5000/api";

// --- Clinical Safety Check ---
export async function checkClinicalSafety(patientProfile: {
  condition: string;
  current_medications: string[];
  allergies: string[];
}, newMedication: string) {
  try {
    const res = await fetch(`${AI_API_URL}/clinical-safety`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient_profile: patientProfile, new_medication: newMedication }),
    });
    if (!res.ok) throw new Error("AI API error");
    return await res.json();
  } catch {
    // Fallback deterministic result when AI not available
    return {
      risk_score: 25,
      severity: "Low",
      explanation: "AI engine unavailable. Manual clinical review required.",
      interactions: [],
      llm_status: "unavailable",
    };
  }
}

// --- Fraud Detection ---
export async function checkFraudDetection(transaction: {
  prescription_location: string;
  dispensing_location: string;
  prescription_timestamp: string;
  dispensing_timestamp: string;
  dosage_volume: number;
  duplicate_claim: number;
}) {
  try {
    const res = await fetch(`${AI_API_URL}/fraud-detection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });
    if (!res.ok) throw new Error("AI API error");
    return await res.json();
  } catch {
    return {
      fraud_flag: transaction.duplicate_claim === 1,
      anomaly_score: 0,
      reason: "AI engine unavailable. Deterministic check applied.",
    };
  }
}

// --- Audit Logging ---
export async function appendAuditEvent(event: {
  actorId: string;
  actorRole: string;
  eventType: string;
  description: string;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = createClient();
  
  // Simple sequential hash for demo
  const eventData = JSON.stringify(event);
  const encoder = new TextEncoder();
  const data = encoder.encode(eventData + Date.now());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const eventHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  const { error } = await supabase.from("audit_events").insert({
    actor_id: event.actorId,
    actor_role: event.actorRole,
    event_type: event.eventType,
    description: event.description,
    entity_id: event.entityId,
    entity_type: event.entityType,
    metadata: event.metadata,
    event_hash: eventHash,
  });

  if (error) console.error("Audit log error:", error);
  return eventHash;
}

// --- Consent Token Generator ---
export function generateConsentToken(params: {
  requestId: string;
  patientId: string;
  requesterId: string;
  categories: string[];
  purpose: string;
  durationHours: number;
}): { id: string; expiresAt: string; signature: string } {
  const expiresAt = new Date(Date.now() + params.durationHours * 3600000).toISOString();
  const payload = `${params.requestId}:${params.patientId}:${params.requesterId}:${params.categories.join(",")}:${expiresAt}`;
  
  // Simulated ECDSA signature for demo (real implementation would use WebCrypto)
  const signature = btoa(payload).replace(/=/g, "").substring(0, 64);
  const id = `CONSENT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  
  return { id, expiresAt, signature };
}

// --- Prescription ID Generator ---
export function generatePrescriptionId(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `RX-${year}-${random}`;
}

// --- Simple hash for prescription integrity ---
export async function hashPayload(payload: unknown): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
