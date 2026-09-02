import axios from 'axios';
import { createIdentity } from './src/identity';
import { createConsent, verifyAccess } from './src/consent';
import { signPayload, verifySignature } from './src/signature';
import { appendEvent, getLedger, verifyLedger } from './src/ledger';
import { anchorLedgerToBlockchain } from './src/blockchain';

const AI_API_URL = 'http://localhost:5000/api';

async function runDemo() {
  console.log("============================================================");
  console.log(" MEDICAL TRUST NETWORK: AI & CRYPTO INTEGRATION DEMO");
  console.log("============================================================\n");

  // Step 1: Patient Registration (Crypto)
  console.log("[1] Registering Patient Identity...");
  const patient = createIdentity({ patientId: "PAT-100", name: "Integration Test Patient" });
  appendEvent("PATIENT_REGISTERED", { patientId: patient.patientId });
  console.log(`✅ Created Identity for (${patient.patientId})\n`);

  // Step 2: Doctor Requests Consent (Crypto)
  console.log("[2] Doctor requests consent for Clinical Consultation...");
  const consentReq = {
    patientId: patient.patientId,
    requestId: "REQ-100",
    requester: { id: "DR-001", name: "Dr. Arun", organization: "ABC Hospital" },
    requestedFields: ["allergies", "current_medications", "condition"],
    purpose: "Clinical Consultation",
    expiresAt: new Date(Date.now() + 3600000).toISOString()
  };
  const consent = createConsent(consentReq);
  appendEvent("CONSENT_CREATED", { consentId: consent.consentId });
  console.log(`✅ Signed Consent generated: ${consent.consentId}\n`);

  // Step 3: Verify Access before Doctor reads data (Crypto)
  console.log("[3] Verifying Doctor Access...");
  const accessResult = verifyAccess({
    consent,
    requester: { id: "DR-001" },
    requestedFields: ["allergies", "current_medications", "condition"]
  });
  if (!accessResult.allowed) {
    console.error("❌ Access Denied!", accessResult.reason);
    return;
  }
  console.log("✅ Access Granted to Doctor.\n");

  // Step 4: Doctor prescribes medication, check AI Safety (AI Model)
  console.log("[4] Doctor proposes new prescription. Running AI Clinical Safety check...");
  const patientProfile = {
    condition: "Hypertension",
    current_medications: ["Lisinopril 20mg"],
    allergies: []
  };
  const newMedication = "Ibuprofen 800mg";
  
  try {
    const safetyRes = await axios.post(`${AI_API_URL}/clinical-safety`, {
      patient_profile: patientProfile,
      new_medication: newMedication
    });
    console.log(`🧠 AI Risk Score: ${safetyRes.data.risk_score} (Severity: ${safetyRes.data.severity})`);
    console.log(`🧠 AI Explanation: ${safetyRes.data.explanation}`);
    appendEvent("AI_SAFETY_CHECK", { risk_score: safetyRes.data.risk_score, severity: safetyRes.data.severity });
  } catch (error: any) {
    console.error("❌ Failed to reach AI API:", error.message);
  }
  console.log();

  // Step 5: Doctor signs finalized prescription (Crypto)
  console.log("[5] Doctor overrides/accepts and signs the prescription cryptographically...");
  createIdentity({ patientId: "DR-001", name: "Dr. Arun" }); // register doctor
  const prescriptionPayload = {
    patientId: patient.patientId,
    drug: newMedication,
    dose: "800mg",
    frequency: "2/day",
    duration: "7 days"
  };
  const signedRx = signPayload("DR-001", prescriptionPayload);
  appendEvent("PRESCRIPTION_SIGNED", { rxHash: signedRx.payloadHash });
  console.log("✅ Prescription Cryptographically Signed.\n");

  // Step 6: Pharmacy Dispenses, check AI Fraud (AI Model)
  console.log("[6] Pharmacy dispensing transaction. Running AI Fraud Detection...");
  
  // Verify signature before dispensing
  if (!verifySignature(signedRx)) {
    console.error("❌ Prescription signature is invalid! Tampering detected!");
    return;
  }

  const transaction = {
    prescription_location: "Chennai",
    dispensing_location: "Delhi",
    prescription_timestamp: "10:00",
    dispensing_timestamp: "11:15",
    dosage_volume: 180,
    duplicate_claim: 1
  };

  try {
    const fraudRes = await axios.post(`${AI_API_URL}/fraud-detection`, {
      ...transaction
    });
    console.log(`🧠 AI Fraud Flag: ${fraudRes.data.fraud_flag}`);
    console.log(`🧠 AI Anomaly Score: ${fraudRes.data.anomaly_score}`);
    console.log(`🧠 AI Reason: ${fraudRes.data.reason}`);
    appendEvent("AI_FRAUD_CHECK", { fraud_flag: fraudRes.data.fraud_flag });
  } catch (error: any) {
    console.error("❌ Failed to reach AI API:", error.message);
  }
  console.log();

  // Step 7: Verify the entire Audit Ledger & Anchor (Crypto)
  console.log("[7] Verifying Audit Ledger & Anchoring to Blockchain...");
  if (verifyLedger()) {
    console.log("✅ Local Audit Ledger cryptographic chain is VALID.");
    const anchor = anchorLedgerToBlockchain(getLedger());
    console.log(`⛓️ Anchored to Blockchain! TxID: ${anchor.txId}`);
    console.log(`⛓️ Block Number: ${anchor.blockNumber}`);
  } else {
    console.error("❌ Audit Ledger verification failed!");
  }
  
  console.log("\n✅ Integration Demo Complete!");
}

runDemo();
