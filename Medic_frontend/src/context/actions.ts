import { UserRole, Patient } from "../types/patient";
import { AccessRequest, ConsentToken } from "../types/consent";
import { Prescription } from "../types/prescription";
import { AuditEvent } from "../types/audit";
import { FraudAlert, PharmacyTransaction } from "../types/pharmacy";
import { AppState } from "./reducer";

export type AppAction =
  | { type: "SET_FULL_STATE"; payload: AppState }
  | { type: "SET_ROLE"; payload: UserRole }
  | { type: "REGISTER_PATIENT"; payload: Patient }
  | { type: "INITIALIZE_VAULT"; payload: { patientId: string; publicKeyFingerprint: string; keyAlgorithm: string } }
  | { type: "CREATE_ACCESS_REQUEST"; payload: AccessRequest }
  | { type: "APPROVE_ACCESS_REQUEST"; payload: { requestId: string; token: ConsentToken } }
  | { type: "DENY_ACCESS_REQUEST"; payload: string }
  | { type: "CREATE_PRESCRIPTION"; payload: Prescription }
  | { type: "SIGN_PRESCRIPTION"; payload: { prescriptionId: string; signature: string } }
  | { type: "UPDATE_PRESCRIPTION_STATUS"; payload: { id: string; status: "ACTIVE" | "DISPENSED" | "REVOKED" } }
  | { type: "DISPENSE_PRESCRIPTION"; payload: { transaction: PharmacyTransaction } }
  | { type: "ADD_PHARMACY_TRANSACTION"; payload: PharmacyTransaction }
  | { type: "FLAG_FRAUD"; payload: FraudAlert }
  | { type: "ADD_FRAUD_ALERT"; payload: FraudAlert }
  | { type: "ADD_AUDIT_EVENT"; payload: AuditEvent }
  | { type: "RESET_DEMO"; payload?: undefined };
