export type PrescriptionStatus = "DRAFT" | "PENDING_SIGNATURE" | "ACTIVE" | "DISPENSED" | "REVOKED";

export interface Prescription {
  id: string;
  patientId: string;
  prescriberName: string;
  medication: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  quantity: string;
  instructions: string;
  status: PrescriptionStatus;
  createdAt: string;
  signedAt?: string;
  signature?: string;
  overrideJustificationCode?: string;
  overrideExplanation?: string;
}
