# Prompt for Antigravity — Crypto Trust Engine (Kanish's module)

I'm building the Cryptographic Trust Engine module for a hackathon project
called the Patient-Sovereign Medical Trust Network. The project is split
three ways across three teammates working independently — I only own the
crypto/security module. I've attached three things:

1. `ANTIGRAVITY_SKILL.md` — read this FIRST. It defines your role for this
   task (senior applications-security/cryptography engineer), the exact
   scope boundaries (my module only — do not build the frontend or the AI
   engine, do not invent extra features), and the non-negotiable
   engineering rules for how this code must be written.
2. `Patient_Sovereign_Medical_Trust_Network_Workflow.docx` — the full
   product workflow for context on how my module's outputs are consumed
   downstream by the rest of the platform. This is background, not your
   build spec.
3. The pasted planning message (also included below/attached) — this IS
   your build spec: 7 concrete capabilities with exact JSON input/output
   shapes for identity, encryption, hashing, consent signing, signature
   verification, tamper detection, and QR authorization.

I've already built and tested Capability 1 (patient cryptographic
identity) — it's in the attached `crypto-trust-engine/` project folder
under `src/identity.ts`, with a passing test in `test/capability1.test.ts`.
Stack is Node.js + TypeScript (chosen so it can be imported directly into
my teammate's React frontend later without a network hop).

Please continue from Capability 2 (AES-GCM encrypt/decrypt for medical
records) onward, following the Tier 1 → Tier 2 → Tier 3 priority order in
the skill doc. Build one capability at a time, show me the code and a
passing test for each before moving to the next, and stay strictly inside
the scope defined in the skill doc — no frontend code, no AI/fraud-scoring
logic, and don't add capabilities beyond what the planning spec asks for.
