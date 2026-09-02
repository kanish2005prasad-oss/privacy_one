export type FraudRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface FraudAlert {
  id: string;
  prescriptionId: string;
  timestamp: string;
  riskScore: number;
  riskLevel: FraudRiskLevel;
  reason: string;
  location?: string;
  previousDispenseLocation?: string;
  status: "BLOCKED" | "REVIEW_REQUIRED" | "CLEARED";
}

export interface PharmacyTransaction {
  id: string;
  prescriptionId: string;
  pharmacistId?: string;
  pharmacistName?: string;
  location: string;
  timestamp: string;
  status: "COMPLETED" | "BLOCKED" | "PENDING";
  fraudAlertId?: string;
}
