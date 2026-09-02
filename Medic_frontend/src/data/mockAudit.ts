import { AuditEvent } from "../types/audit";

export const mockAuditEvents: AuditEvent[] = [
  {
    id: "AUD-001",
    timestamp: "2026-09-02T09:42:00+05:30",
    actor: "System",
    eventType: "IDENTITY_CREATED",
    description: "Patient cryptographic identity established.",
    status: "SUCCESS"
  }
];
