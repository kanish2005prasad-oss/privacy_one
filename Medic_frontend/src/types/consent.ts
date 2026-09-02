import { RecordCategory } from "./health-record";

export type ConsentStatus = "pending" | "approved" | "denied" | "expired";

export interface AccessRequest {
  id: string;
  patientId: string;
  requesterName: string;
  requesterOrganization: string;
  clinicalPurpose: string;
  requestedCategories: RecordCategory[];
  durationMinutes: number;
  requestedAt: string;
  status: ConsentStatus;
}

export interface ConsentToken {
  id: string;
  requestId: string;
  patientId: string;
  issuedAt: string;
  expiresAt: string;
  authorizedCategories: RecordCategory[];
  clinicalPurpose: string;
  signatureFingerprint?: string;
}
