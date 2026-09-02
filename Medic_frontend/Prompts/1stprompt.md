You are a Principal Frontend Architect and Senior Product Engineer. Build the frontend for a 24-hour hackathon project called:

# PATIENT-SOVEREIGN

## Signature-Verified Prescription Intelligence Network

Your job is to scaffold and implement a **complete, polished, production-quality frontend prototype** using **Next.js App Router + TypeScript + Tailwind CSS**, with a realistic mock application state that will later be replaced by a Python backend.

I have attached **six screenshots of a premium healthcare website** as visual references. Study them carefully before implementing the UI. Do NOT copy the website literally, its branding, text, assets, or layout. Instead, extract its **visual design language** and reinterpret it for a privacy-first healthcare/security product.

The final application must feel like a **premium healthcare technology platform designed by an experienced product team**, not an AI-generated generic dashboard.

---

# 0. NON-NEGOTIABLE OBJECTIVE

Build a frontend that convincingly demonstrates this complete lifecycle:

**Patient owns health data**
→ **Doctor requests specific access**
→ **Patient reviews exactly what is requested**
→ **Patient authenticates/signs consent**
→ **Short-lived consent token is generated**
→ **Doctor retrieves only authorized records**
→ **Doctor creates prescription**
→ **AI safety engine evaluates prescription against patient history/allergies/labs**
→ **High-risk prescriptions require explicit doctor override + justification + signature**
→ **Signed prescription reaches pharmacy**
→ **Pharmacy verifies prescription validity**
→ **Fraud/anomaly engine evaluates dispensing**
→ **Dispense is recorded**
→ **Every important action appears in an immutable audit timeline**

The UI must make this workflow extremely easy to understand during a hackathon demo.

---

# 1. FIRST: INSPECT THE EXISTING PROJECT

Before creating files:

1. Inspect the repository.
2. Determine whether a Next.js project already exists.
3. Inspect:

   * package.json
   * app/
   * src/
   * components/
   * tailwind configuration
   * tsconfig
   * existing styles
4. Reuse useful existing infrastructure where appropriate.
5. Do NOT unnecessarily rewrite the entire project.
6. If the project is empty, scaffold the required Next.js App Router structure.
7. Use TypeScript strictly.
8. Make sure the application runs with:

```bash
npm run dev
```

and builds with:

```bash
npm run build
```

Do not leave TypeScript errors, broken imports, missing routes, placeholder components, or unfinished TODO sections.

---

# 2. TECHNOLOGY STACK

Use:

* Next.js latest stable version compatible with the existing project
* App Router
* TypeScript
* Tailwind CSS
* React Context API + useReducer for global mock state
* Lucide React for icons
* CSS animations/transitions where appropriate
* LocalStorage for lightweight persistence across page refreshes
* Native browser APIs where useful
* No backend
* No database
* No authentication provider
* No external API dependencies

Avoid adding libraries unless they provide meaningful value.

Do NOT use:

* Bootstrap
* Material UI
* generic admin dashboard templates
* huge UI component libraries
* fake chart libraries when CSS/SVG is sufficient
* emoji as interface icons
* unnecessary dependencies

---

# 3. VISUAL DESIGN DIRECTION

The attached screenshots are the primary visual inspiration.

Analyze their visual language and reproduce the **design principles**, not the exact website.

## Core visual identity

The application should feel:

* premium
* calm
* clinical
* trustworthy
* futuristic
* secure
* minimal
* editorial
* highly intentional
* human rather than corporate
* sophisticated enough for a healthcare/security startup

Think:

**premium healthcare + privacy infrastructure + modern medical intelligence**

rather than:

**generic SaaS admin dashboard**

---

# 4. VISUAL LANGUAGE EXTRACTED FROM THE REFERENCE SCREENSHOTS

Use these characteristics throughout the application.

## Typography

The reference uses extremely strong typographic hierarchy.

Use:

* very large display headings
* short, confident headlines
* generous line-height
* clean modern sans-serif typography
* restrained font weights
* high contrast between headings and secondary text

Recommended:

* Geist / Geist Sans if available through Next.js
* otherwise Inter/system sans

Do not use decorative fonts.

Example hierarchy:

```text
EYEBROW
Patient Sovereignty

Large headline
Your health data.
Your decision.

Supporting copy
Control exactly who can access your health information,
why they can access it, and for how long.
```

Headings should sometimes be dramatically large on desktop.

---

# 5. COLOR SYSTEM

Do NOT make the entire application dark.

Use a carefully controlled light/dark visual rhythm.

### Base light mode

Background:

* warm/off-white rather than pure white
* approximately `#F5F5F7` / `#FAFAFA`

Primary text:

* almost-black

Secondary text:

* muted gray

Borders:

* extremely subtle gray

### Security / infrastructure sections

Use deep near-black:

* `#050505`
* `#0A0A0A`
* `#111111`

with white typography.

### Accent colors

Use accents sparingly:

**Electric blue**

* primary actions
* consent approvals
* active navigation
* links

**Cyan / turquoise**

* security
* encryption
* cryptographic events

**Magenta / violet**

* clinical intelligence
* AI risk
* medical intelligence

**Amber**

* warning / medium risk

**Red**

* high-risk / blocked / fraud

Do NOT turn every card into a colorful gradient.

Color should communicate meaning.

---

# 6. REFERENCE-INSPIRED LAYOUT PRINCIPLES

The screenshots have several important characteristics.

Reproduce these principles:

### A. Huge whitespace

Sections should breathe.

Do not cram information together.

### B. Large editorial headings

Use headings like:

> Your health data.
> Your rules.

rather than:

> Patient Data Management Dashboard

### C. Large rounded media/content blocks

Use large cards with:

```css
rounded-[28px]
```

or similar.

Avoid tiny 6px-radius SaaS cards everywhere.

### D. Horizontal storytelling

The screenshots use horizontally arranged content cards/carousels.

Use this concept for:

* health records
* access requests
* security events
* clinical insights

### E. Strong hero sections

Important pages should begin with a strong statement and a clear CTA.

### F. Minimal navigation

Do not create a huge sidebar with 15 menu items.

Use a compact top navigation / role-aware navigation.

### G. Editorial sections

Break pages into meaningful narrative sections rather than a grid of 20 widgets.

### H. Photography / visual storytelling

Where appropriate, use abstract healthcare/security visual treatment.

However:

**DO NOT depend on external stock images for core functionality.**

Prefer CSS/SVG-based visuals or carefully selected local assets.

### I. Subtle motion

Use:

* fade-in
* slide-up
* scale
* hover elevation
* active state transitions
* token generation animation
* encryption/decryption transitions

Avoid excessive bouncing or gimmicky animations.

---

# 7. IMPORTANT: AVOID "AI SLOP"

This is extremely important.

The application must NOT look like an AI-generated template.

Avoid:

* random purple-blue gradients everywhere
* excessive glassmorphism
* glowing borders on every card
* neon cyberpunk aesthetics
* dozens of tiny metric cards
* excessive rounded pills
* unnecessary shadows
* generic "AI-powered" labels everywhere
* meaningless dashboard charts
* giant gradient text
* fake futuristic terminology
* excessive animations
* arbitrary icons
* inconsistent spacing
* 10 different card styles
* giant sidebar navigation
* lorem ipsum
* placeholder text
* "Coming Soon"
* unfinished sections

Every visual element should have a product reason.

The UI should feel like something a **senior Apple/Linear/Vercel-level product designer might have designed for a healthcare infrastructure startup**, while remaining original.

---

# 8. APPLICATION INFORMATION ARCHITECTURE

Create these major areas:

```text
/
├── Landing / System Overview
│
├── /onboarding
│   ├── Registration
│   ├── Identity generation
│   ├── Key generation
│   └── Vault initialization
│
├── /patient
│   ├── Dashboard
│   ├── Health Vault
│   ├── Consent Requests
│   └── Audit Log
│
├── /doctor
│   ├── Dashboard
│   ├── Access Request Builder
│   ├── Authorized Records
│   ├── Prescription Builder
│   └── AI Clinical Intelligence
│
└── /pharmacy
    ├── Dashboard
    ├── Prescription Verification
    └── Fraud Detection
```

The landing page should provide clear entry points into:

* Patient
* Doctor / Hospital
* Pharmacy / Insurance

For the hackathon demo, also create a compact **role switcher** so the evaluator can jump between personas quickly.

---

# 9. GLOBAL APP SHELL

Create:

```text
components/layout/AppShell.tsx
components/layout/TopNav.tsx
components/layout/PageContainer.tsx
components/layout/Section.tsx
components/layout/RoleSwitcher.tsx
components/layout/Footer.tsx
```

## Top navigation

Desktop:

```text
PATIENT-SOVEREIGN

Patient    Doctor    Pharmacy

System Status       [role selector]
```

Do not use a huge sidebar.

Mobile:

* compact header
* menu drawer
* role switcher

The active role should be visually obvious.

---

# 10. GLOBAL STATE ARCHITECTURE

Create:

```text
context/AppStateContext.tsx
context/AppStateProvider.tsx
context/actions.ts
context/reducer.ts
```

Use:

```ts
React.createContext
useReducer
```

Do NOT scatter application state across dozens of components.

Create a strongly typed global state.

Example:

```ts
interface AppState {
  currentRole: UserRole;
  patient: Patient;
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
```

Create meaningful actions such as:

```ts
REGISTER_PATIENT
INITIALIZE_VAULT
CREATE_ACCESS_REQUEST
APPROVE_ACCESS_REQUEST
DENY_ACCESS_REQUEST
GENERATE_CONSENT_TOKEN
RETRIEVE_RECORDS
CREATE_PRESCRIPTION
RUN_AI_CHECK
OVERRIDE_AI_ALERT
SIGN_PRESCRIPTION
VERIFY_PRESCRIPTION
DISPENSE_PRESCRIPTION
FLAG_FRAUD
RESOLVE_FRAUD_ALERT
ADD_AUDIT_EVENT
SET_ROLE
```

Every important UI interaction should mutate this state.

---

# 11. PERSISTENCE

Use LocalStorage.

Create:

```text
lib/storage.ts
```

Persist the mock state so that:

* approving consent survives refresh
* generated IDs survive refresh
* prescriptions survive refresh
* audit events survive refresh

Handle hydration safely in Next.js.

Do not access localStorage directly during server rendering.

---

# 12. TYPE SYSTEM

Create:

```text
types/
├── patient.ts
├── health-record.ts
├── consent.ts
├── prescription.ts
├── audit.ts
├── ai.ts
├── pharmacy.ts
└── common.ts
```

Use proper discriminated unions where appropriate.

Example:

```ts
type UserRole = "patient" | "doctor" | "pharmacy";

type RiskLevel = "low" | "moderate" | "high" | "critical";

type RecordCategory =
  | "demographics"
  | "medications"
  | "allergies"
  | "labs"
  | "diagnoses"
  | "imaging"
  | "clinical-notes";
```

Do not use `any`.

---

# 13. MOCK DATA

Create:

```text
data/mockData.ts
data/mockPatients.ts
data/mockRecords.ts
data/mockRequests.ts
data/mockPrescriptions.ts
data/mockAudit.ts
data/mockPharmacy.ts
```

Populate the application with realistic data.

Use this baseline data.

---

## Patient

```json
{
  "id": "PSN-IND-2048-7F92A1",
  "name": "Ananya Rao",
  "dateOfBirth": "1998-04-17",
  "bloodGroup": "O+",
  "gender": "Female",
  "systemStatus": "active",
  "vaultEnabled": true,
  "publicKeyFingerprint": "SHA256:8F:21:AC:77:4D:91:02",
  "keyAlgorithm": "ECDSA P-256",
  "lastAuthenticated": "2026-09-02T09:42:00+05:30"
}
```

---

# 14. HEALTH RECORD MOCK DATA

Include at least:

### Allergies

```json
[
  {
    "name": "Penicillin",
    "severity": "Severe",
    "reaction": "Anaphylaxis"
  }
]
```

### Medications

```json
[
  {
    "name": "Metformin",
    "dose": "500 mg",
    "frequency": "Twice daily",
    "status": "Active"
  },
  {
    "name": "Atorvastatin",
    "dose": "20 mg",
    "frequency": "Once daily",
    "status": "Active"
  }
]
```

### Lab results

Include:

```text
HbA1c
Creatinine
eGFR
ALT
AST
Hemoglobin
WBC
```

Example:

```json
{
  "name": "Creatinine",
  "value": "1.42",
  "unit": "mg/dL",
  "referenceRange": "0.6–1.1",
  "status": "high",
  "date": "2026-08-28"
}
```

### Diagnoses

Include realistic but demo-safe conditions such as:

* Type 2 diabetes
* Hypertension
* Hyperlipidemia

### Clinical notes

Use concise realistic snippets.

---

# 15. PATIENT ONBOARDING

Route:

```text
/onboarding
```

Build a beautiful multi-step onboarding experience.

Steps:

```text
01 Identity
02 Cryptographic Identity
03 Health Vault
04 Complete
```

## Step 1 — Registration

Fields:

* Full name
* Date of birth
* Email
* Phone

CTA:

```text
Create Patient Identity
```

When clicked:

Generate a mock unique ID.

Example animation:

```text
Generating identity...
Creating sovereign identifier...
Identity established.
```

Show:

```text
PSN-IND-2048-7F92A1
```

---

# 16. CRYPTOGRAPHIC IDENTITY UI

Show:

```text
Cryptographic Identity

Public Key
ECDSA P-256
SHA256:8F:21:AC:77:4D:91:02

Private Key
••••••••••••••••••••
Stored locally
```

Provide:

```text
Generate Key Pair
```

Simulate generation.

Use a visual security animation:

```text
Generating entropy
      ↓
Creating key pair
      ↓
Computing fingerprint
      ↓
Identity signed
```

IMPORTANT:

Clearly label this as a **frontend simulation**.

Do not falsely claim that the frontend is implementing production-grade cryptographic custody.

---

# 17. VAULT INITIALIZATION

Create a large premium card:

```text
Your Health Vault

Store your health records under your control.

FHIR Records
Lab Results
Medication History
Clinical Notes

[ Secure Vault Storage ]
                       ON
```

Toggle should work.

When enabled:

* update global state
* add audit event

```text
Vault initialized
```

---

# 18. PATIENT DASHBOARD

Route:

```text
/patient
```

This should be one of the strongest pages visually.

Hero:

```text
Your health data.
Your decision.
```

Supporting text:

```text
Review every request. Approve exactly what is needed.
Nothing more.
```

Then show:

```text
Vault status
Pending consent
Active authorizations
Recent activity
```

But avoid turning these into generic KPI cards.

Use large editorial blocks.

---

# 19. HEALTH VAULT

Create:

```text
components/patient/HealthVault.tsx
components/patient/HealthRecordCard.tsx
components/patient/EncryptedField.tsx
```

Display records grouped by:

```text
Medications
Allergies
Labs
Diagnoses
Clinical Notes
Imaging
```

Unrequested data should visually appear:

```text
██████████████
Encrypted / Locked
```

Use CSS blur for values:

```css
filter: blur(...)
```

but never use blur as the only indication.

Add a lock icon and explicit label:

```text
LOCKED
Not authorized for this request
```

When a consent token is active:

* authorized fields become readable
* unauthorized fields remain locked

This is a critical demonstration feature.

---

# 20. CONSENT REQUESTS

Create:

```text
components/patient/ConsentRequestCard.tsx
components/patient/ConsentRequestList.tsx
```

Example request:

```text
Dr. Vikram Narayan
Emory Healthcare

Clinical purpose
Medication review following elevated creatinine

Requested records
✓ Current medications
✓ Allergies
✓ Renal labs
✕ Clinical notes
✕ Imaging

Access window
30 minutes

Requested
2 minutes ago
```

Buttons:

```text
Review request
Decline
```

Clicking Review opens detailed consent UI.

---

# 21. CONSENT APPROVAL FLOW

This is a major hackathon interaction.

Create:

```text
components/consent/ConsentApprovalModal.tsx
components/consent/AuthMethodSelector.tsx
components/consent/ConsentTokenCard.tsx
```

Flow:

### Stage 1

Show:

```text
You are about to authorize:

Requester
Clinical purpose
Exact fields
Duration
```

Use language emphasizing sovereignty.

Example:

```text
Nothing outside these fields will be unlocked.
```

### Stage 2

Authentication method:

```text
Authenticate to sign

Face ID
Fingerprint
PIN
```

Buttons should simulate the selected method.

### Stage 3

Authentication animation:

```text
Authenticating...
Verifying identity...
Signing consent...
Writing authorization...
```

### Stage 4

Success:

```text
Consent signed.

Token
CSN-7A93-41F8

Expires
09:58 AM

Authorized fields
Medications
Allergies
Renal Labs
```

Show a short-lived progress/expiry indicator.

---

# 22. CONSENT TOKEN

Create a visually impressive security token component.

Include:

```text
CONSENT TOKEN

CSN-7A93-41F8

Issuer
PSN-IND-2048-7F92A1

Scope
medications
allergies
labs.creatinine
labs.eGFR

Purpose
Medication review

Expires
09:58
```

Add:

* signature fingerprint
* token status
* expiration
* authorized scope

Token should be represented as a frontend simulation.

---

# 23. IMMUTABLE AUDIT LOG

Create:

```text
components/audit/AuditTimeline.tsx
components/audit/AuditEvent.tsx
```

This should look like a premium chronological timeline rather than a generic table.

Events:

```text
Patient identity created
Vault initialized
Doctor access request received
Consent reviewed
Biometric authentication completed
Consent token generated
Authorized records decrypted
Prescription created
AI risk assessment completed
Doctor override signed
Prescription issued
Pharmacy verification completed
Prescription dispensed
Fraud analysis completed
```

Each event should include:

* timestamp
* actor
* event type
* description
* transaction/reference ID
* status

Use different visual markers for:

* identity
* access
* encryption
* AI
* signature
* pharmacy
* fraud

---

# 24. DOCTOR / HOSPITAL DASHBOARD

Route:

```text
/doctor
```

Hero:

```text
Clinical access,
by consent.
```

Supporting text:

```text
Request only the information you need.
Patient authorization determines what becomes visible.
```

Show:

```text
Patient context
Access status
Active consent
Clinical intelligence
```

---

# 25. ACCESS REQUEST BUILDER

Route:

```text
/doctor/request
```

Create:

```text
components/doctor/AccessRequestBuilder.tsx
```

Fields:

### Patient

Search/select:

```text
Ananya Rao
PSN-IND-2048-7F92A1
```

### Record categories

Checkbox/select:

```text
Demographics
Medications
Allergies
Laboratory Results
Diagnoses
Imaging
Clinical Notes
```

### Clinical purpose

Mandatory.

Provide example options:

```text
Medication reconciliation
Diagnosis evaluation
Pre-operative assessment
Emergency treatment
Chronic disease management
Other
```

If Other:

show text input.

### Time window

Options:

```text
15 minutes
30 minutes
1 hour
4 hours
24 hours
```

### Request summary

Dynamically generate:

```text
You are requesting:

3 record categories
for:
Medication reconciliation

Access duration:
30 minutes
```

Submit:

```text
Request patient authorization
```

This should create an access request in global state and audit log.

---

# 26. TOKEN-BASED RETRIEVAL

Route:

```text
/doctor
```

or dedicated:

```text
/doctor/records
```

Build:

```text
components/doctor/AuthorizedRecords.tsx
```

Before authorization:

```text
Patient data remains encrypted.

No active consent token.
```

After approval:

```text
Consent verified

Token
CSN-7A93-41F8

Authorized scope
Medications
Allergies
Renal labs

Decrypting authorized fields...
```

Then reveal ONLY those fields.

This is one of the most important demonstrations.

Example:

```text
Medications
✓ Metformin 500 mg — Twice daily
✓ Atorvastatin 20 mg — Once daily

Allergies
✓ Penicillin — Severe / Anaphylaxis

Renal Labs
✓ Creatinine — 1.42 mg/dL
✓ eGFR — 51 mL/min/1.73m²

Clinical Notes
🔒 Locked
Not included in patient authorization
```

---

# 27. PRESCRIPTION BUILDER

Route:

```text
/doctor/prescription
```

Create:

```text
components/doctor/PrescriptionBuilder.tsx
```

Fields:

```text
Medication
Dosage
Route
Frequency
Duration
Quantity
Instructions
```

Provide example medications:

```text
Amoxicillin
Metformin
Azithromycin
Atorvastatin
Lisinopril
Ibuprofen
```

The doctor can create a prescription.

On submission:

```text
Run Clinical Intelligence
```

Do NOT call a real AI API.

Use deterministic mock rules.

---

# 28. MOCK AI CLINICAL INTELLIGENCE ENGINE

Create:

```text
lib/clinicalEngine.ts
```

Implement actual deterministic logic.

Example:

```ts
evaluatePrescription(
  prescription,
  patientRecords
)
```

Rules should include:

### Allergy rule

If:

```text
drug ∈ patient allergies
```

then:

```text
risk = critical
```

### Renal function rule

If creatinine/eGFR is abnormal and drug has renal contraindication:

```text
risk = high
```

### Drug interaction

If medication conflicts with an existing medication:

```text
risk = high
```

### Safe prescription

Otherwise:

```text
risk = low
```

Return:

```ts
interface AIAssessment {
  riskScore: number;
  riskLevel: RiskLevel;
  findings: Finding[];
  alternatives: Alternative[];
  evaluatedAt: string;
}
```

---

# 29. AI RISK UI

Create:

```text
components/ai/ClinicalIntelligencePanel.tsx
components/ai/RiskScore.tsx
components/ai/FindingCard.tsx
components/ai/AlternativeMedication.tsx
```

Example result:

```text
Clinical Intelligence

HIGH RISK
Risk score 87 / 100

Why this was flagged

1. Patient has documented severe penicillin allergy.
2. Proposed medication belongs to the flagged allergy class.

Recommended alternatives

Azithromycin
No matching allergy detected

Doxycycline
No matching allergy detected
```

Make this visually striking but clinical.

Do not make it look like a chatbot.

It should feel like a clinical decision-support engine.

---

# 30. HIGH-RISK OVERRIDE

If:

```text
riskLevel === "high" || "critical"
```

the doctor MUST NOT be able to simply click:

```text
Continue anyway
```

Instead:

```text
Override clinical warning
```

opens a modal.

Create:

```text
components/ai/OverrideModal.tsx
```

Require:

### Justification code

Dropdown:

```text
J01 — No suitable alternative
J02 — Specialist-directed therapy
J03 — Emergency treatment
J04 — Patient-specific clinical exception
J05 — Other documented rationale
```

### Explanation

Required text area.

### Digital signature

Simulate:

```text
Sign Override
```

Then:

```text
Verifying clinician identity...
Signing override...
Recording immutable event...
```

Success:

```text
Override signed.

Clinician
Dr. Vikram Narayan

Justification
J02 — Specialist-directed therapy

Signature
SIG-92A7C4...

Recorded to audit ledger
```

Add an audit event.

---

# 31. PRESCRIPTION SIGNATURE

Once safe OR explicitly overridden:

```text
Sign Prescription
```

Generate:

```text
RX-2026-000184
```

and:

```text
Prescription signature
SIG-RX-81F3...
```

Show:

```text
ACTIVE
VALID UNTIL
2026-09-09
```

Prescription should then become visible to Pharmacy.

---

# 32. PHARMACY DASHBOARD

Route:

```text
/pharmacy
```

Hero:

```text
Verify before you dispense.
```

Supporting text:

```text
Every prescription carries a verifiable signature.
Every dispense becomes part of the record.
```

Show:

* verification queue
* suspicious transactions
* recent dispensing
* active prescriptions

Again, avoid generic KPI-card overload.

---

# 33. PRESCRIPTION VERIFICATION

Create:

```text
components/pharmacy/PrescriptionLookup.tsx
```

Input:

```text
Enter prescription ID
```

Example:

```text
RX-2026-000184
```

Lookup should check:

```text
exists
signature valid
active
not expired
not previously dispensed
patient identity matches
```

Display:

```text
VERIFIED

Prescription
RX-2026-000184

Signature
VALID

Status
ACTIVE

Previously dispensed
NO

Issued by
Dr. Vikram Narayan

Issued
02 Sep 2026
```

---

# 34. DISPENSING VERIFICATION

Before dispensing:

```text
Verify prescription
Verify signature
Check duplicate use
Run anomaly detection
```

Then:

```text
Approve Dispense
```

Confirmation modal:

```text
Dispense this prescription?

Once recorded, this prescription
cannot be dispensed again.
```

After confirmation:

```text
DISPENSE RECORDED
```

Add audit event.

Change prescription status:

```text
ACTIVE → DISPENSED
```

---

# 35. FRAUD DETECTION

Create:

```text
components/pharmacy/FraudDetectionPanel.tsx
lib/fraudEngine.ts
```

Mock transaction data should include anomalies such as:

### Duplicate dispense

Same prescription used twice.

### Volume mismatch

Prescription quantity:

```text
30 tablets
```

Dispensing transaction:

```text
120 tablets
```

### Geographic anomaly

Prescription issued in:

```text
Chennai
```

Dispensing attempt:

```text
Delhi
```

within an implausibly short interval.

### Suspicious velocity

Multiple prescriptions dispensed rapidly from different locations.

---

# 36. FRAUD ALERT UI

Create strong alert cards.

Example:

```text
TRANSACTION BLOCKED

Duplicate dispense detected.

Prescription
RX-2026-000184

Previous dispense
09:14 AM — Chennai

Current attempt
09:21 AM — Delhi

Risk score
96 / 100

Action
BLOCKED
```

Use red sparingly.

For normal transactions:

```text
LOW RISK
Verified
```

For suspicious transactions:

```text
REVIEW REQUIRED
```

---

# 37. LANDING PAGE

Create a sophisticated landing page at:

```text
/
```

Do NOT make it look like a generic startup landing page.

Hero concept:

```text
Your health data.
Your signature.
Your rules.
```

Supporting text:

```text
A patient-sovereign infrastructure for consent-driven
health records, verified prescriptions, and intelligent
clinical safety.
```

Primary CTA:

```text
Enter Patient Vault
```

Secondary:

```text
Explore Clinical Workflow
```

Then create sections inspired by the storytelling structure of the reference screenshots.

---

# 38. LANDING PAGE SECTION STRUCTURE

### Section 1

Large hero.

Dark background.

Subtle animated security/medical visualization.

Example visual:

```text
Patient Identity
      ↓
Consent
      ↓
Clinical Access
      ↓
Prescription
      ↓
Verification
```

### Section 2

White/off-white editorial section:

```text
The patient stays in control.
```

Explain granular consent.

### Section 3

Dark section:

```text
Access should be precise.
```

Show encrypted fields becoming available only after authorization.

### Section 4

Clinical intelligence section:

```text
Every prescription gets a second look.
```

Show AI risk analysis.

### Section 5

Pharmacy:

```text
Verify before you dispense.
```

### Section 6

Audit:

```text
Every important action leaves a trail.
```

### Final CTA:

```text
Take control of the clinical record.
```

---

# 39. PREMIUM SECURITY VISUALIZATION

Create a reusable visual component:

```text
components/visuals/SovereigntyFlow.tsx
```

Represent:

```text
PATIENT
   │
   │ signed consent
   ▼
CONSENT TOKEN
   │
   │ scoped access
   ▼
CLINICAL SYSTEM
   │
   │ signed prescription
   ▼
PHARMACY
   │
   ▼
AUDIT LEDGER
```

Use:

* subtle lines
* small nodes
* status indicators
* restrained animation

Do NOT create a giant neon cyber-security graphic.

---

# 40. REUSABLE UI COMPONENTS

Create a clean component system:

```text
components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Modal.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   ├── Toggle.tsx
│   ├── Tabs.tsx
│   ├── Progress.tsx
│   ├── Divider.tsx
│   ├── StatusIndicator.tsx
│   └── Tooltip.tsx
│
├── layout/
│
├── patient/
│
├── doctor/
│
├── pharmacy/
│
├── consent/
│
├── ai/
│
├── audit/
│
└── visuals/
```

Do not duplicate UI logic.

---

# 41. DESIGN TOKENS

Create centralized CSS variables.

For example:

```css
--background
--foreground
--surface
--surface-elevated
--border
--muted
--primary
--security
--clinical
--warning
--danger
--success
```

Use consistent:

* spacing
* radii
* typography
* transitions

Do not hardcode random colors throughout components.

---

# 42. BUTTON DESIGN

Primary buttons should resemble the reference site's restrained blue CTAs.

Examples:

```text
Create Patient Identity
Request Access
Approve Request
Authenticate
Generate Consent Token
Run Clinical Check
Sign Override
Verify Prescription
Approve Dispense
```

Use compact rounded buttons.

Avoid making every button huge.

---

# 43. CARDS

Use cards intentionally.

Preferred:

* large radius
* subtle border
* very light shadow
* strong internal spacing

Dark cards:

```text
#0A0A0A
```

Light cards:

```text
#FFFFFF
```

Do not put every line of text inside a card.

---

# 44. ICONOGRAPHY

Use Lucide React.

Examples:

```text
ShieldCheck
Lock
Unlock
Fingerprint
ScanFace
KeyRound
FileText
Pill
Stethoscope
Hospital
ClipboardCheck
AlertTriangle
ShieldAlert
Activity
Clock
Signature
MapPin
CircleCheck
XCircle
```

Icons should be subtle and purposeful.

---

# 45. RESPONSIVE DESIGN

Must work properly on:

* 1440px desktop
* 1280px laptop
* 1024px tablet
* 768px
* 390px mobile

Do not simply shrink desktop layouts.

On mobile:

* stack cards
* convert horizontal sections to scrollable carousels where useful
* make modals full-screen/bottom-sheet style
* simplify navigation
* preserve readability

---

# 46. ACCESSIBILITY

Implement:

* semantic HTML
* keyboard navigation
* visible focus states
* appropriate aria labels
* accessible modals
* sufficient contrast
* buttons instead of clickable divs
* form labels
* error states

Do not sacrifice accessibility for visual design.

---

# 47. ANIMATION SYSTEM

Create restrained animations.

Examples:

### Identity creation

Subtle scanning animation.

### Encryption

Blur → sharpen when authorized.

### Consent

Request card → authentication → signed → token generated.

### Token

Subtle progress indicator until expiry.

### AI

Risk score animates from 0 → actual value.

### Audit

New events slide/fade into timeline.

Use CSS where possible.

Respect:

```text
prefers-reduced-motion
```

---

# 48. ERROR AND EMPTY STATES

Every major area must have meaningful states.

Examples:

```text
No pending requests
No active consent tokens
No authorized records
Prescription not found
Prescription already dispensed
Invalid signature
Token expired
Vault disabled
Fraud check blocked transaction
```

Do not use generic:

```text
Something went wrong
```

when a specific message is possible.

---

# 49. DEMO MODE

Because this is a hackathon, create:

```text
components/demo/DemoController.tsx
```

Allow the evaluator to reset the application:

```text
Reset Demo State
```

and optionally:

```text
Load Patient Scenario
Load High-Risk Prescription
Load Fraud Scenario
```

This is extremely useful for the presentation.

The default state should already contain enough realistic data to demonstrate the system immediately.

---

# 50. IDEAL HACKATHON DEMO FLOW

The application should make this sequence effortless:

### Step 1

Open:

```text
/
```

### Step 2

Enter:

```text
Patient Vault
```

### Step 3

Show:

```text
Health Vault
```

with encrypted fields.

### Step 4

Switch to Doctor.

Create access request:

```text
Medications
Allergies
Labs
30 minutes
Medication reconciliation
```

### Step 5

Switch back to Patient.

Show incoming request.

### Step 6

Approve using simulated biometric authentication.

### Step 7

Show generated:

```text
Consent Token
```

### Step 8

Return to Doctor.

Show that ONLY authorized records are unlocked.

### Step 9

Create a high-risk prescription.

Example:

```text
Amoxicillin
```

because patient has a severe penicillin allergy.

### Step 10

AI engine flags:

```text
CRITICAL
Risk Score: 97
```

### Step 11

Show recommended alternatives.

### Step 12

Doctor chooses:

```text
J03 — Emergency treatment
```

and provides justification.

### Step 13

Digitally sign override.

### Step 14

Prescription becomes:

```text
SIGNED
ACTIVE
```

### Step 15

Switch to Pharmacy.

Verify:

```text
RX-2026-000184
```

### Step 16

Run fraud check.

### Step 17

Dispense.

### Step 18

Return to Patient.

Show audit timeline containing the entire chain.

This should feel like a complete end-to-end system rather than disconnected screens.

---

# 51. ROUTE REQUIREMENTS

Implement these routes:

```text
/
 /onboarding

 /patient
 /patient/vault
 /patient/consent
 /patient/audit

 /doctor
 /doctor/request
 /doctor/records
 /doctor/prescription

 /pharmacy
 /pharmacy/verify
 /pharmacy/fraud
```

Every route must render a real interface.

No placeholder pages.

---

# 52. FILE STRUCTURE

Aim for this structure:

```text
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   │
│   ├── onboarding/
│   │   └── page.tsx
│   │
│   ├── patient/
│   │   ├── page.tsx
│   │   ├── vault/
│   │   │   └── page.tsx
│   │   ├── consent/
│   │   │   └── page.tsx
│   │   └── audit/
│   │       └── page.tsx
│   │
│   ├── doctor/
│   │   ├── page.tsx
│   │   ├── request/
│   │   │   └── page.tsx
│   │   ├── records/
│   │   │   └── page.tsx
│   │   └── prescription/
│   │       └── page.tsx
│   │
│   └── pharmacy/
│       ├── page.tsx
│       ├── verify/
│       │   └── page.tsx
│       └── fraud/
│           └── page.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── patient/
│   ├── doctor/
│   ├── pharmacy/
│   ├── consent/
│   ├── ai/
│   ├── audit/
│   ├── visuals/
│   └── demo/
│
├── context/
│   ├── AppStateContext.tsx
│   ├── AppStateProvider.tsx
│   ├── reducer.ts
│   └── actions.ts
│
├── data/
│   ├── mockData.ts
│   ├── mockPatients.ts
│   ├── mockRecords.ts
│   ├── mockRequests.ts
│   ├── mockPrescriptions.ts
│   ├── mockAudit.ts
│   └── mockPharmacy.ts
│
├── lib/
│   ├── clinicalEngine.ts
│   ├── fraudEngine.ts
│   ├── cryptoSimulation.ts
│   ├── tokenUtils.ts
│   ├── auditUtils.ts
│   └── storage.ts
│
└── types/
    ├── patient.ts
    ├── health-record.ts
    ├── consent.ts
    ├── prescription.ts
    ├── audit.ts
    ├── ai.ts
    ├── pharmacy.ts
    └── common.ts
```

Adjust `src/` if the existing project uses a root-level `app/`.

---

# 53. MOCK CRYPTO IMPLEMENTATION

Create:

```text
lib/cryptoSimulation.ts
```

Implement frontend-safe simulations for:

```ts
generatePatientId()
generateKeyPair()
generateKeyFingerprint()
simulateSignature()
generateConsentToken()
```

Use browser crypto utilities where useful for randomness.

However, clearly communicate in the UI that:

```text
Prototype simulation
```

The frontend must never claim that private keys are being securely stored or that the mock signatures constitute real legal/cryptographic authorization.

The architecture should make it obvious where the Python backend will eventually replace the mock implementation.

---

# 54. BACKEND INTEGRATION BOUNDARY

Design the frontend so the future Python backend can replace mock functions.

Create:

```text
lib/api.ts
```

with placeholder typed functions such as:

```ts
registerPatient()
initializeVault()
createAccessRequest()
approveConsent()
retrieveAuthorizedRecords()
createPrescription()
evaluatePrescription()
signOverride()
verifyPrescription()
dispensePrescription()
getAuditLog()
```

For now these can delegate to the mock state.

Do NOT build actual API endpoints.

The architecture should make the replacement straightforward.

---

# 55. SECURITY LANGUAGE

Use precise terminology.

Prefer:

```text
patient-controlled
scoped authorization
consent token
cryptographic identity
signed authorization
authorized fields
encrypted
locked
audit event
signature verification
clinical decision support
```

Avoid irresponsible claims such as:

```text
100% secure
unhackable
military-grade
HIPAA compliant
blockchain-secured
AI doctor
guaranteed diagnosis
```

unless explicitly marked as future/backend functionality.

---

# 56. AI IS NOT A CHATBOT

The AI clinical feature should NOT look like ChatGPT.

Do not build a chat interface.

Instead, present it as:

```text
Clinical Intelligence
```

with:

* risk score
* findings
* evidence
* affected patient factors
* recommended alternatives
* rationale
* timestamp
* model status

This should look like clinical decision support.

---

# 57. AUDIT LEDGER IS NOT A CRYPTO SPECULATION UI

Do not add meaningless blockchain visuals.

The audit system should communicate:

```text
what happened
who performed it
when it happened
what authorization was involved
what changed
```

Use a timeline and cryptographic reference IDs.

---

# 58. MICROCOPY

Use concise, confident microcopy.

Examples:

```text
Nothing more than you authorized.
```

```text
Access expires automatically.
```

```text
Your consent determines the scope.
```

```text
Only authorized fields are decrypted.
```

```text
This prescription requires clinical override.
```

```text
Signature verified.
```

```text
Dispense recorded permanently in the audit history.
```

Avoid generic SaaS copy such as:

```text
Unlock the power of your data.
```

---

# 59. IMPORTANT INTERACTION RULES

These behaviors must work.

### Consent

If patient approves:

```text
pending → approved
```

and:

```text
consent token generated
audit event created
```

### Consent denial

```text
pending → denied
audit event created
```

### Expiration

Expired tokens should no longer unlock records.

### Retrieval

Only fields included in token scope become readable.

### Prescription

Prescription cannot be signed while unresolved critical AI risk exists.

### Override

High-risk override requires:

* justification code
* explanation
* signature

### Pharmacy

Prescription cannot be dispensed if:

```text
expired
invalid signature
already dispensed
blocked by fraud engine
```

### Dispensing

Successful dispense changes status to:

```text
DISPENSED
```

and prevents reuse.

---

# 60. RESPONSIVE VISUAL PRIORITY

On desktop, prioritize:

```text
large typography
large visual sections
horizontal storytelling
generous whitespace
```

On mobile, prioritize:

```text
content hierarchy
clear status
single-column flow
easy interaction
```

The interface should still look premium on a 390px viewport.

---

# 61. IMPLEMENTATION ORDER

Do NOT attempt to randomly build everything at once.

Build in this exact sequence:

## Phase 1 — Foundation

1. Project inspection
2. Dependencies
3. Tailwind setup
4. Fonts
5. Global CSS
6. Design tokens
7. UI primitives
8. App shell

## Phase 2 — State

1. Types
2. Mock data
3. Context
4. Reducer
5. LocalStorage
6. Demo reset

## Phase 3 — Patient

1. Onboarding
2. Registration
3. Key generation
4. Vault initialization
5. Patient dashboard
6. Health vault
7. Consent requests
8. Authentication modal
9. Consent token
10. Audit log

## Phase 4 — Doctor

1. Dashboard
2. Request builder
3. Authorized record retrieval
4. Prescription builder
5. Clinical engine
6. Risk UI
7. Override modal
8. Prescription signing

## Phase 5 — Pharmacy

1. Dashboard
2. Prescription verification
3. Fraud engine
4. Fraud UI
5. Dispensing

## Phase 6 — Polish

1. Responsive layouts
2. Animations
3. Loading states
4. Error states
5. Empty states
6. Accessibility
7. Demo flow
8. Final visual refinement

---

# 62. QUALITY BAR

Before considering the project complete, verify:

### Architecture

* [ ] TypeScript strict
* [ ] No `any`
* [ ] Context architecture works
* [ ] State mutations are centralized
* [ ] Mock backend boundary exists
* [ ] LocalStorage persistence works

### Patient

* [ ] Registration works
* [ ] Unique ID generated
* [ ] Key pair simulation works
* [ ] Vault toggle works
* [ ] Records displayed
* [ ] Locked fields visually encrypted
* [ ] Consent requests work
* [ ] Authentication modal works
* [ ] Consent token generated
* [ ] Token expiry works
* [ ] Audit events created

### Doctor

* [ ] Request builder works
* [ ] Clinical purpose mandatory
* [ ] Time window works
* [ ] Scope selection works
* [ ] Authorized records unlock correctly
* [ ] Unauthorized records remain locked
* [ ] Prescription builder works
* [ ] AI safety check works
* [ ] Risk score works
* [ ] Alternatives displayed
* [ ] High-risk override required
* [ ] Justification code required
* [ ] Digital signature simulation works
* [ ] Prescription signed

### Pharmacy

* [ ] Prescription lookup works
* [ ] Signature verification simulated
* [ ] Expiry checked
* [ ] Duplicate use checked
* [ ] Fraud detection works
* [ ] Suspicious transaction blocked
* [ ] Successful dispense works
* [ ] Audit event created

### UI

* [ ] Premium visual hierarchy
* [ ] Consistent spacing
* [ ] No generic AI-dashboard appearance
* [ ] No excessive gradients
* [ ] No visual clutter
* [ ] No broken mobile layouts
* [ ] No placeholder content
* [ ] No dead buttons
* [ ] No unfinished sections
* [ ] Animations feel intentional
* [ ] Accessibility basics implemented

---

# 63. FINAL DESIGN PRINCIPLE

The most important design decision:

**This is not a dashboard about healthcare data.**

It is a visual story about **ownership, consent, trust, clinical intelligence, and verification**.

The user should immediately understand:

> **The patient owns the data.
> Access is requested, not assumed.
> Consent is granular.
> Prescriptions are signed.
> AI checks for safety.
> Overrides are accountable.
> Pharmacies verify before dispensing.
> Everything important is auditable.**

The UI should communicate that story visually without requiring a long explanation.

---

# 64. FINAL INSTRUCTION TO THE CODING AGENT

Build the application completely.

Do not stop after scaffolding.

Do not merely create placeholder components.

Do not provide pseudocode instead of implementation.

Do not leave TODOs for core functionality.

Do not simplify the workflow into static mock screens.

Every major interaction must actually update the mock global state and visibly affect another part of the application.

Use the attached screenshots as **high-level visual references** for:

* typography
* whitespace
* section rhythm
* premium healthcare aesthetic
* oversized editorial headings
* light/dark section transitions
* rounded large content blocks
* restrained blue CTAs
* subtle accent colors
* cinematic visual hierarchy
* minimal navigation
* horizontal storytelling
* sophisticated simplicity

But create an **original Patient-Sovereign visual identity**, not a copy of the reference website.

The final result should look like a serious, polished healthcare infrastructure product that could be demonstrated to judges at a major hackathon.

**Prioritize working end-to-end interactions first, then visual polish, then micro-animations.**

At the end:

1. Run the application.
2. Run the production build.
3. Fix all TypeScript/build/runtime errors.
4. Test the complete patient → doctor → AI → pharmacy → audit workflow.
5. Verify responsive behavior.
6. Verify that no major button is non-functional.
7. Verify that the UI contains no placeholder/lorem ipsum content.
8. Verify that the application starts successfully with `npm run dev`.

Do not finish until the frontend feels like a cohesive, intentional product rather than a collection of generated screens.
