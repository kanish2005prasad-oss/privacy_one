import { Prescription } from "../types/prescription";
import { PharmacyTransaction, FraudAlert, FraudRiskLevel } from "../types/pharmacy";
import { checkFraudDetection } from "./api";

export async function evaluateFraudRisk(
  prescription: Prescription,
  currentLocation: string,
  transactions: PharmacyTransaction[]
): Promise<{ isBlocked: boolean; alert: FraudAlert | null }> {
  
  // 1. Invalid Status (Deterministic rule)
  if (prescription.status === "REVOKED") {
    return {
      isBlocked: true,
      alert: {
        id: `FRAUD-${Date.now()}`,
        prescriptionId: prescription.id,
        timestamp: new Date().toISOString(),
        riskScore: 99,
        riskLevel: "CRITICAL",
        reason: "Prescription has been revoked by the issuer.",
        location: currentLocation,
        status: "BLOCKED"
      }
    };
  }

  // 2. Prepare data for AI model
  const previous = transactions.find(t => t.prescriptionId === prescription.id && t.status === "COMPLETED");
  const isDuplicate = !!previous;

  const transactionData = {
    prescription_location: "Chennai", // Simulated issuer location for demo
    dispensing_location: currentLocation,
    prescription_timestamp: prescription.createdAt,
    dispensing_timestamp: new Date().toISOString(),
    dosage_volume: 1, // simplified for demo
    duplicate_claim: isDuplicate ? 1 : 0
  };

  try {
    const aiResponse = await checkFraudDetection(transactionData);

    if (aiResponse.fraud_flag) {
      // Determine risk level based on score
      let riskLevel: FraudRiskLevel = "HIGH";
      if (aiResponse.anomaly_score >= 80) riskLevel = "CRITICAL";
      else if (aiResponse.anomaly_score <= 50) riskLevel = "MEDIUM";

      return {
        isBlocked: true,
        alert: {
          id: `FRAUD-${Date.now()}`,
          prescriptionId: prescription.id,
          timestamp: new Date().toISOString(),
          riskScore: aiResponse.anomaly_score,
          riskLevel: riskLevel,
          reason: aiResponse.reason,
          location: currentLocation,
          previousDispenseLocation: previous?.location,
          status: "BLOCKED"
        }
      };
    }

    // Safe
    return { isBlocked: false, alert: null };

  } catch (error) {
    console.error("Fraud Engine API Error:", error);
    
    // Fallback deterministic rules
    if (isDuplicate) {
      return {
        isBlocked: true,
        alert: {
          id: `FRAUD-${Date.now()}`,
          prescriptionId: prescription.id,
          timestamp: new Date().toISOString(),
          riskScore: 96,
          riskLevel: "CRITICAL",
          reason: "Duplicate dispense detected. Prescription has already been fulfilled. (Fallback Rule)",
          location: currentLocation,
          previousDispenseLocation: previous.location,
          status: "BLOCKED"
        }
      };
    }

    return { isBlocked: false, alert: null };
  }
}
