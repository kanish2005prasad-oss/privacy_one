import { HealthRecord } from "../types/health-record";
import { AIAssessment, RiskLevel, Finding, Alternative } from "../types/ai";
import { Prescription } from "../types/prescription";

// Deterministic mock rules for hackathon
export function evaluatePrescription(
  prescription: Partial<Prescription>,
  patientRecords: HealthRecord[]
): AIAssessment {
  
  const findings: Finding[] = [];
  const alternatives: Alternative[] = [];
  let riskScore = 15; // Base low risk
  let riskLevel: RiskLevel = "low";
  
  const medicationName = prescription.medication?.toLowerCase() || "";
  
  // Extract specific record types
  const allergies = patientRecords.filter(r => r.category === "allergies") as any[];
  const labs = patientRecords.filter(r => r.category === "labs") as any[];
  
  // 1. ALLERGY RULE (e.g. Amoxicillin / Penicillin)
  const hasPenicillinAllergy = allergies.some(a => a.name.toLowerCase().includes("penicillin"));
  const isPenicillinClass = medicationName.includes("amoxicillin") || medicationName.includes("penicillin");
  
  if (hasPenicillinAllergy && isPenicillinClass) {
    findings.push({
      id: "F-ALLERGY-01",
      description: "Patient has documented severe penicillin allergy. Proposed medication belongs to the flagged allergy class."
    });
    alternatives.push(
      { medicationName: "Azithromycin", rationale: "No matching allergy detected for macrolide class." },
      { medicationName: "Doxycycline", rationale: "Safe alternative for respiratory infections." }
    );
    riskScore = 97;
    riskLevel = "critical";
  }
  
  // 2. RENAL FUNCTION RULE
  const abnormalRenal = labs.some(l => 
    (l.name.toLowerCase().includes("creatinine") && l.status === "high") ||
    (l.name.toLowerCase().includes("egfr") && l.status === "low")
  );
  const isNephrotoxic = medicationName.includes("ibuprofen") || medicationName.includes("lisinopril");
  
  if (abnormalRenal && isNephrotoxic && riskLevel !== "critical") {
    findings.push({
      id: "F-RENAL-01",
      description: "Patient has documented abnormal renal function (elevated creatinine). Medication requires dosage adjustment or avoidance in renal impairment."
    });
    alternatives.push(
      { medicationName: "Acetaminophen", rationale: "Hepatic metabolism, safer for renal impairment." }
    );
    riskScore = 82;
    riskLevel = "high";
  }

  // 3. DRUG INTERACTION RULE
  // For demo, let's say Atorvastatin + Azithromycin = Moderate/High
  const activeMeds = patientRecords.filter(r => r.category === "medications" && r.status === "Active") as any[];
  const takesStatin = activeMeds.some(m => m.name.toLowerCase().includes("statin"));
  
  if (takesStatin && medicationName.includes("azithromycin") && riskLevel !== "critical" && riskLevel !== "high") {
    findings.push({
      id: "F-INTERACTION-01",
      description: "Potential interaction with active statin therapy. May increase risk of myopathy."
    });
    riskScore = 65;
    riskLevel = "moderate";
  }

  // Safe Prescription
  if (findings.length === 0) {
    findings.push({
      id: "F-SAFE-01",
      description: "No significant contraindications, allergies, or severe interactions detected based on available patient data."
    });
  }

  return {
    riskScore,
    riskLevel,
    findings,
    alternatives,
    evaluatedAt: new Date().toISOString()
  };
}
