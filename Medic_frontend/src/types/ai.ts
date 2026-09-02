export type RiskLevel = "low" | "moderate" | "high" | "critical";

export interface Finding {
  id: string;
  description: string;
}

export interface Alternative {
  medicationName: string;
  rationale: string;
}

export interface AIAssessment {
  riskScore: number;
  riskLevel: RiskLevel;
  findings: Finding[];
  alternatives: Alternative[];
  evaluatedAt: string;
}
