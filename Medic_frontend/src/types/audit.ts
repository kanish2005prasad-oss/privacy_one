export type AuditEventType = 
  | "IDENTITY_CREATED"
  | "VAULT_INITIALIZED"
  | "ACCESS_REQUEST_CREATED"
  | "CONSENT_REVIEWED"
  | "BIOMETRIC_AUTH"
  | "CONSENT_TOKEN_GENERATED"
  | "RECORDS_DECRYPTED"
  | "PRESCRIPTION_CREATED"
  | "AI_RISK_ASSESSMENT"
  | "OVERRIDE_SIGNED"
  | "PRESCRIPTION_ISSUED"
  | "PHARMACY_VERIFICATION"
  | "PRESCRIPTION_DISPENSED"
  | "FRAUD_ANALYSIS";

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  eventType: AuditEventType;
  description: string;
  referenceId?: string;
  status: "SUCCESS" | "BLOCKED" | "WARNING" | "INFO";
}
