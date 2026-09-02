import { AppAction } from "./actions";
import { UserRole, Patient } from "../types/patient";
import { HealthRecord } from "../types/health-record";
import { AccessRequest, ConsentToken } from "../types/consent";
import { Prescription } from "../types/prescription";
import { AuditEvent } from "../types/audit";
import { AIAssessment } from "../types/ai";
import { FraudAlert, PharmacyTransaction } from "../types/pharmacy";
import { Notification } from "../types/common";

import { 
  mockPatients, 
  mockHealthRecords, 
  mockAccessRequests, 
  mockConsentTokens, 
  mockPrescriptions, 
  mockAuditEvents, 
  mockPharmacyTransactions, 
  mockFraudAlerts 
} from "../data/mockData";

export interface AppState {
  currentRole: UserRole;
  patients: Patient[];
  healthRecords: HealthRecord[];
  accessRequests: AccessRequest[];
  consentTokens: ConsentToken[];
  prescriptions: Prescription[];
  auditEvents: AuditEvent[];
  aiAssessments: AIAssessment[];
  pharmacyTransactions: PharmacyTransaction[];
  fraudAlerts: FraudAlert[];
  notifications: Notification[];
}

export const initialState: AppState = {
  currentRole: "patient",
  patients: mockPatients,
  healthRecords: mockHealthRecords,
  accessRequests: mockAccessRequests,
  consentTokens: mockConsentTokens,
  prescriptions: mockPrescriptions,
  auditEvents: mockAuditEvents,
  aiAssessments: [],
  pharmacyTransactions: mockPharmacyTransactions,
  fraudAlerts: mockFraudAlerts,
  notifications: []
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_FULL_STATE":
      return action.payload;

    case "SET_ROLE":
      return { ...state, currentRole: action.payload };
      
    case "REGISTER_PATIENT":
      return { ...state, patients: [...state.patients, action.payload] };
      
    case "INITIALIZE_VAULT":
      return {
        ...state,
        patients: state.patients.map(p => 
          p.id === action.payload.patientId 
            ? { ...p, vaultEnabled: true, publicKeyFingerprint: action.payload.publicKeyFingerprint, keyAlgorithm: action.payload.keyAlgorithm } 
            : p
        )
      };
      
    case "CREATE_ACCESS_REQUEST":
      return { ...state, accessRequests: [action.payload, ...state.accessRequests] };
      
    case "APPROVE_ACCESS_REQUEST":
      return {
        ...state,
        accessRequests: state.accessRequests.map(r => 
          r.id === action.payload.requestId ? { ...r, status: "approved" } : r
        ),
        consentTokens: [action.payload.token, ...state.consentTokens]
      };
      
    case "DENY_ACCESS_REQUEST":
      return {
        ...state,
        accessRequests: state.accessRequests.map(r => 
          r.id === action.payload ? { ...r, status: "denied" } : r
        )
      };
      
    case "CREATE_PRESCRIPTION":
      return { ...state, prescriptions: [action.payload, ...state.prescriptions] };
      
    case "SIGN_PRESCRIPTION":
      return {
        ...state,
        prescriptions: state.prescriptions.map(p => 
          p.id === action.payload.prescriptionId 
            ? { ...p, status: "ACTIVE", signedAt: new Date().toISOString(), signature: action.payload.signature } 
            : p
        )
      };

    case "UPDATE_PRESCRIPTION_STATUS":
      return {
        ...state,
        prescriptions: state.prescriptions.map(p =>
          p.id === action.payload.id ? { ...p, status: action.payload.status } : p
        )
      };
      
    case "DISPENSE_PRESCRIPTION":
      return {
        ...state,
        pharmacyTransactions: [action.payload.transaction, ...state.pharmacyTransactions],
        prescriptions: state.prescriptions.map(p => 
          p.id === action.payload.transaction.prescriptionId ? { ...p, status: "DISPENSED" } : p
        )
      };

    case "ADD_PHARMACY_TRANSACTION":
      return {
        ...state,
        pharmacyTransactions: [action.payload, ...state.pharmacyTransactions]
      };
      
    case "FLAG_FRAUD":
    case "ADD_FRAUD_ALERT":
      return { ...state, fraudAlerts: [action.payload, ...state.fraudAlerts] };
      
    case "ADD_AUDIT_EVENT":
      return { ...state, auditEvents: [action.payload, ...state.auditEvents] };
      
    case "RESET_DEMO":
      return initialState;
      
    default:
      return state;
  }
}
