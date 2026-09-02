export type RecordCategory =
  | "demographics"
  | "medications"
  | "allergies"
  | "labs"
  | "diagnoses"
  | "imaging"
  | "clinical-notes";

export interface HealthRecordBase {
  id: string;
  category: RecordCategory;
  date: string;
  provider?: string;
}

export interface AllergyRecord extends HealthRecordBase {
  category: "allergies";
  name: string;
  severity: "Mild" | "Moderate" | "Severe";
  reaction: string;
}

export interface MedicationRecord extends HealthRecordBase {
  category: "medications";
  name: string;
  dose: string;
  frequency: string;
  status: "Active" | "Completed" | "Discontinued";
}

export interface LabResultRecord extends HealthRecordBase {
  category: "labs";
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: "normal" | "high" | "low" | "critical";
}

export interface DiagnosisRecord extends HealthRecordBase {
  category: "diagnoses";
  condition: string;
  status: "Active" | "Resolved";
}

export interface ClinicalNoteRecord extends HealthRecordBase {
  category: "clinical-notes";
  title: string;
  content: string;
}

export type HealthRecord =
  | AllergyRecord
  | MedicationRecord
  | LabResultRecord
  | DiagnosisRecord
  | ClinicalNoteRecord;
