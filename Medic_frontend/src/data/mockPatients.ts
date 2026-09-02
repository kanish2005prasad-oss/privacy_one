import { Patient } from "../types/patient";

export const mockPatients: Patient[] = [
  {
    id: "PSN-IND-2048-7F92A1",
    name: "Ananya Rao",
    dateOfBirth: "1998-04-17",
    bloodGroup: "O+",
    gender: "Female",
    systemStatus: "active",
    vaultEnabled: true,
    publicKeyFingerprint: "SHA256:8F:21:AC:77:4D:91:02",
    keyAlgorithm: "ECDSA P-256",
    lastAuthenticated: "2026-09-02T09:42:00+05:30"
  },
  {
    id: "PSN-IND-2055-1B33C9",
    name: "Vikram Singh",
    dateOfBirth: "1985-11-03",
    bloodGroup: "A-",
    gender: "Male",
    systemStatus: "active",
    vaultEnabled: false,
  }
];
