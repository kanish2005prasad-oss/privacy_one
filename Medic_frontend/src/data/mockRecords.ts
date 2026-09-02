import { HealthRecord } from "../types/health-record";

export const mockHealthRecords: HealthRecord[] = [
  {
    id: "REC-ALL-001",
    category: "allergies",
    date: "2010-05-12",
    name: "Penicillin",
    severity: "Severe",
    reaction: "Anaphylaxis",
    provider: "Dr. Sharma"
  },
  {
    id: "REC-MED-001",
    category: "medications",
    date: "2025-01-10",
    name: "Metformin",
    dose: "500 mg",
    frequency: "Twice daily",
    status: "Active",
    provider: "Dr. Vikram Narayan"
  },
  {
    id: "REC-MED-002",
    category: "medications",
    date: "2025-06-22",
    name: "Atorvastatin",
    dose: "20 mg",
    frequency: "Once daily",
    status: "Active",
    provider: "Dr. Vikram Narayan"
  },
  {
    id: "REC-LAB-001",
    category: "labs",
    date: "2026-08-28",
    name: "Creatinine",
    value: "1.42",
    unit: "mg/dL",
    referenceRange: "0.6–1.1",
    status: "high",
    provider: "Apollo Diagnostics"
  },
  {
    id: "REC-LAB-002",
    category: "labs",
    date: "2026-08-28",
    name: "eGFR",
    value: "51",
    unit: "mL/min/1.73m²",
    referenceRange: "> 90",
    status: "low",
    provider: "Apollo Diagnostics"
  },
  {
    id: "REC-LAB-003",
    category: "labs",
    date: "2026-08-28",
    name: "HbA1c",
    value: "6.8",
    unit: "%",
    referenceRange: "< 5.7",
    status: "high",
    provider: "Apollo Diagnostics"
  },
  {
    id: "REC-DIA-001",
    category: "diagnoses",
    date: "2020-03-15",
    condition: "Type 2 diabetes mellitus",
    status: "Active",
    provider: "Dr. Vikram Narayan"
  },
  {
    id: "REC-DIA-002",
    category: "diagnoses",
    date: "2022-11-04",
    condition: "Hypertension",
    status: "Active",
    provider: "Dr. Vikram Narayan"
  },
  {
    id: "REC-NOT-001",
    category: "clinical-notes",
    date: "2026-08-30",
    title: "Follow-up Consultation",
    content: "Patient reports mild fatigue. Blood pressure is stable. Renal function shows slight decline (Creatinine 1.42). Need to review medications, particularly avoiding nephrotoxic agents. Will request full access to medication history.",
    provider: "Dr. Vikram Narayan"
  }
];
