export type UserRole = "patient" | "doctor" | "pharmacy";

export type SystemStatus = "active" | "inactive" | "suspended";

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  bloodGroup: string;
  gender: string;
  systemStatus: SystemStatus;
  vaultEnabled: boolean;
  publicKeyFingerprint?: string;
  keyAlgorithm?: string;
  lastAuthenticated?: string;
}
