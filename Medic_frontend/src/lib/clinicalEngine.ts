import { HealthRecord } from "../types/health-record";
import { AIAssessment, RiskLevel, Finding, Alternative } from "../types/ai";
import { Prescription } from "../types/prescription";
import { checkClinicalSafety } from "./api";

export async function evaluatePrescription(
  prescription: Partial<Prescription>,
  patientRecords: HealthRecord[]
): Promise<AIAssessment> {
  
  // Format patient profile from records
  const allergies = patientRecords.filter(r => r.category === "allergies").map(r => (r as any).name);
  const conditions = patientRecords.filter(r => r.category === "diagnoses").map(r => (r as any).condition);
  const medications = patientRecords.filter(r => r.category === "medications" && (r as any).status === "Active").map(r => (r as any).name);
  
  const patientProfile = {
    condition: conditions.join(", ") || "Unknown",
    current_medications: medications,
    allergies: allergies
  };

  const medicationName = prescription.medication || "";

  try {
    const aiResponse = await checkClinicalSafety(patientProfile, medicationName);
    
    // Convert backend risk score to risk level
    let riskLevel: RiskLevel = "low";
    if (aiResponse.risk_score >= 80) riskLevel = "critical";
    else if (aiResponse.risk_score >= 60) riskLevel = "high";
    else if (aiResponse.risk_score >= 40) riskLevel = "moderate";

    const findings: Finding[] = aiResponse.interactions.map((interaction: any, i: number) => ({
      id: `F-AI-${i}`,
      description: `[${interaction.type.toUpperCase()}] ${interaction.description}`
    }));

    if (findings.length === 0) {
      findings.push({
        id: "F-SAFE-01",
        description: aiResponse.explanation || "No significant contraindications, allergies, or severe interactions detected."
      });
    }

    // Backend doesn't currently return alternatives, but we can structure it if it did
    const alternatives: Alternative[] = [];

    return {
      riskScore: aiResponse.risk_score,
      riskLevel: riskLevel,
      findings,
      alternatives,
      evaluatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Clinical Engine API Error:", error);
    
    // Fallback if API is down
    return {
      riskScore: 50,
      riskLevel: "moderate",
      findings: [{ id: "ERR", description: "AI engine unavailable. Proceed with caution." }],
      alternatives: [],
      evaluatedAt: new Date().toISOString()
    };
  }
}
