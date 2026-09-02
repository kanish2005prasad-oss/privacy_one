import { Prescription } from "../types/prescription";
import { PharmacyTransaction, FraudAlert, FraudRiskLevel } from "../types/pharmacy";

export function evaluateFraudRisk(
  prescription: Prescription,
  currentLocation: string,
  transactions: PharmacyTransaction[]
): { isBlocked: boolean; alert: FraudAlert | null } {
  
  // 1. Duplicate Dispense
  if (prescription.status === "DISPENSED") {
    const previous = transactions.find(t => t.prescriptionId === prescription.id && t.status === "COMPLETED");
    return {
      isBlocked: true,
      alert: {
        id: `FRAUD-${Date.now()}`,
        prescriptionId: prescription.id,
        timestamp: new Date().toISOString(),
        riskScore: 96,
        riskLevel: "CRITICAL",
        reason: "Duplicate dispense detected. Prescription has already been fulfilled.",
        location: currentLocation,
        previousDispenseLocation: previous?.location,
        status: "BLOCKED"
      }
    };
  }
  
  // 2. Invalid Status
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

  // 3. Geographic Anomaly (Simulation)
  // For the hackathon demo, if the location is "Delhi" and it's a specific prescription, flag it
  if (currentLocation.toLowerCase() === "delhi" && prescription.id.includes("184")) {
    return {
      isBlocked: true,
      alert: {
        id: `FRAUD-${Date.now()}`,
        prescriptionId: prescription.id,
        timestamp: new Date().toISOString(),
        riskScore: 85,
        riskLevel: "HIGH",
        reason: "Geographic anomaly detected. Dispensing attempt location (Delhi) is implausibly distant from issuing location (Chennai) within time window.",
        location: currentLocation,
        previousDispenseLocation: "Chennai", // simulated issuer location
        status: "BLOCKED"
      }
    };
  }

  // Safe
  return { isBlocked: false, alert: null };
}
