# 🏥 Patient-Sovereign Medical Trust Network

> **Hackathon Project** — A patient-controlled healthcare trust network where cryptographic identity, AI clinical intelligence, and fraud detection work together to ensure that patients own their medical data.

---

## 🧩 Project Structure

```
📦 Hackathon_project/
├── 🔐 crypto-trust-engine/     # Kanish's Module — Cryptographic Trust Layer (TypeScript/Node.js)
├── 🤖 privacy-one/             # Aadhesh's Module — AI Clinical Safety & Fraud Detection (Python)
└── 🖥️  Medic_frontend/         # Pooja's Module — Next.js Frontend (TypeScript/React)
```

---

## 🔐 Module 1: Crypto Trust Engine
**Owner:** Kanish  
**Tech:** TypeScript, Node.js  

Implements the full cryptographic backbone of the platform:
- **AES-256-GCM** encryption for health records
- **ECDSA P-256** digital signatures for prescriptions & consents
- **SHA-256** integrity hashing
- **QR Auth Sessions** for phone-based biometric fallback
- **Append-only Hash-Chain Audit Ledger**
- **Key Rotation** & Consent Revocation
- **Blockchain Anchoring** (simulated Ethereum)

### Run the Integration Demo
```bash
cd crypto-trust-engine
npm install
npx ts-node demo_integration.ts
```
> Requires the AI API server to be running (see Module 2)

---

## 🤖 Module 2: AI Medical Security (privacy-one)
**Owner:** Aadhesh  
**Tech:** Python, ChromaDB, scikit-learn, Flask  

Implements hybrid AI + deterministic safety checks:
- **Clinical Safety Engine:** ChromaDB RAG + Ollama LLM + deterministic interaction rules
- **Fraud Detection Engine:** Isolation Forest + geographic & volume anomaly rules
- **Flask REST API** for integration with the frontend and crypto engine

### Start the AI API Server
```bash
cd privacy-one
pip install -r medical_security_cli/requirements.txt
pip install flask
python app.py
```
API runs at `http://localhost:5000`
- `POST /api/clinical-safety` — Drug interaction & allergy check
- `POST /api/fraud-detection` — Transaction anomaly detection

---

## 🖥️ Module 3: Frontend (Medic_frontend)
**Owner:** Pooja  
**Tech:** Next.js 16, TypeScript, TailwindCSS, Supabase  

Full-featured dashboards for all roles:
- **Patient Dashboard** — Health vault, consent management, audit timeline
- **Doctor Dashboard** — Access requests, patient records, AI-assisted prescriptions
- **Pharmacy Dashboard** — Prescription verification, fraud alerts
- **Auth System** — Supabase-powered login/signup with role-based routing

### Run the Frontend
```bash
cd Medic_frontend
npm install
# Set up .env.local with your Supabase credentials
npm run dev
```
Frontend runs at `http://localhost:3000`

---

## 🔗 Integration Architecture

```
[Patient/Doctor/Pharmacy Browser]
         │
         ▼
[Next.js Frontend (Port 3000)]
    │           │
    │           ▼
    │   [Supabase (Auth + DB)]
    │
    ▼
[Python Flask AI API (Port 5000)]
    ├── /api/clinical-safety → ChromaDB + Ollama + Rules
    └── /api/fraud-detection → Isolation Forest + Rules
         │
         ▼ (via demo_integration.ts)
[TypeScript Crypto Engine]
    ├── AES-GCM Encryption
    ├── ECDSA Signing
    ├── Consent Verification
    └── Blockchain Audit Anchor
```

---

## 🏆 Key USP

> *"The patient doesn't just own their medical data — they can prove who accessed it, why they accessed it, what they accessed, and whether anything suspicious happened."*

---

## 🛡️ Security Model
- No raw biometrics stored on server
- QR contains only short-lived nonce, never medical data  
- Medical data is hashed and signed; off-chain storage
- Every access is scoped by requester, fields, purpose, and expiry
- All security-sensitive actions create cryptographically chained audit events
