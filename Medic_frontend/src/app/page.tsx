"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { 
  ShieldCheck, 
  Activity, 
  KeyRound, 
  Lock, 
  UserCheck, 
  Pill, 
  FileText, 
  Fingerprint, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Sparkles
} from "lucide-react";
import { useAppState } from "../context/AppStateContext";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { dispatch } = useAppState();
  const router = useRouter();

  const handleEnterVault = () => {
    dispatch({ type: "SET_ROLE", payload: "patient" });
    router.push("/patient");
  };

  const handleExploreDoctor = () => {
    dispatch({ type: "SET_ROLE", payload: "doctor" });
    router.push("/doctor");
  };

  const handleExplorePharmacy = () => {
    dispatch({ type: "SET_ROLE", payload: "pharmacy" });
    router.push("/pharmacy");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden bg-[#050505] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/15 via-background/0 to-background/0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated/10 border border-white/10 text-xs font-mono tracking-widest text-security uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-security animate-pulse"></span>
              Signature-Verified Prescription Intelligence Network
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.08]">
              Your health data.<br />
              <span className="text-security">Your signature.</span><br />
              Your rules.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              A patient-sovereign infrastructure for consent-driven health records, verified prescriptions, and intelligent clinical safety.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button 
                size="lg" 
                onClick={handleEnterVault} 
                className="w-full sm:w-auto bg-primary text-white border-0 hover:bg-primary-hover shadow-xl shadow-primary/25 font-semibold px-8"
              >
                Enter Patient Vault
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleExploreDoctor} 
                className="w-full sm:w-auto text-white border-gray-700 hover:bg-gray-800 hover:border-gray-600 px-8"
              >
                Doctor Workflow
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleExplorePharmacy} 
                className="w-full sm:w-auto text-white border-gray-700 hover:bg-gray-800 hover:border-gray-600 px-8"
              >
                Pharmacy Verify
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section 1: Patient Sovereignty */}
      <section className="py-24 bg-surface text-foreground border-b border-border/60">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="text-xs uppercase font-mono tracking-widest text-primary font-bold">
              01 • Patient Sovereignty
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              The patient stays in control.
            </h2>
            <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              Granular consent allows you to authorize access to specific medical records for a specific duration. You review exactly what is requested before securely signing the authorization.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 pt-12 text-left">
              <div className="p-8 rounded-[28px] bg-surface-elevated/70 border border-border space-y-4 hover:border-primary/40 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center">
                  <UserCheck size={28} />
                </div>
                <h3 className="text-xl font-bold">Scoped Requests</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Clinicians request only the categories needed (Labs, Allergies) with explicit time-window limits.
                </p>
              </div>

              <div className="p-8 rounded-[28px] bg-security/5 border border-security/20 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-security/15 text-security flex items-center justify-center">
                  <Fingerprint size={28} />
                </div>
                <h3 className="text-xl font-bold">Cryptographic Signing</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Every grant is signed using the patient's local ECDSA key pair, producing a tamper-proof short-lived token.
                </p>
              </div>

              <div className="p-8 rounded-[28px] bg-primary/5 border border-primary/20 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                  <Lock size={28} />
                </div>
                <h3 className="text-xl font-bold">Dynamic Decryption</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Unauthorized records remain locked and obfuscated in the vault. Zero assumed access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section 2: Clinical AI Safety */}
      <section className="py-28 bg-[#050505] text-white border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase font-mono tracking-widest text-clinical font-bold">
                02 • Clinical Intelligence
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Every prescription gets a second look.
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Our clinical intelligence engine evaluates every proposed prescription against your medical history, allergies, and lab results. High-risk decisions require explicit physician override and a cryptographic signature.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle2 size={18} className="text-clinical shrink-0" />
                  <span>Cross-references documented patient allergies in real-time</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle2 size={18} className="text-clinical shrink-0" />
                  <span>Evaluates renal function (eGFR) and organ clearance contraindications</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle2 size={18} className="text-clinical shrink-0" />
                  <span>Mandates justification codes and digital signatures for clinical overrides</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0A0A0A] p-8 md:p-10 rounded-[28px] border border-gray-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-clinical/15 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="flex items-center justify-between pb-6 border-b border-gray-800 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-clinical/15 rounded-xl text-clinical">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Safety Engine</h3>
                    <p className="text-xs font-mono text-gray-500">Evaluation: Amoxicillin 500mg</p>
                  </div>
                </div>
                <Badge variant="danger" className="text-xs">CRITICAL RISK</Badge>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlertTriangle size={16} className="text-danger" />
                    <span className="text-danger font-bold text-xs uppercase tracking-wider">Allergy Contraindication</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Patient has documented severe penicillin allergy with history of anaphylaxis.
                  </p>
                </div>

                <div className="p-4 bg-gray-900/80 border border-gray-800 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1.5 text-security">
                    <Sparkles size={16} />
                    <span className="font-semibold text-xs uppercase tracking-wider">Recommended Alternative</span>
                  </div>
                  <p className="text-gray-300 text-sm font-medium">Azithromycin 500mg</p>
                  <p className="text-gray-500 text-xs mt-0.5">Macrolide class — safe for penicillin-allergic profile.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section 3: Pharmacy Verification & Double-Spend */}
      <section className="py-24 bg-surface text-foreground border-b border-border/60">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 bg-[#0A0A0A] text-white p-8 md:p-10 rounded-[28px] border border-gray-800 shadow-2xl">
              <div className="flex items-center justify-between pb-6 border-b border-gray-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/15 text-success flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Prescription Verification</h4>
                    <p className="text-xs font-mono text-gray-500">RX-2026-88192</p>
                  </div>
                </div>
                <Badge variant="success" className="text-xs font-mono">VALID SIGNATURE</Badge>
              </div>

              <div className="space-y-4 text-sm font-mono">
                <div className="p-3 bg-gray-900 rounded-xl flex items-center justify-between">
                  <span className="text-gray-400">Issuer Signer:</span>
                  <span className="text-gray-200">Dr. Vikram Narayan</span>
                </div>
                <div className="p-3 bg-gray-900 rounded-xl flex items-center justify-between">
                  <span className="text-gray-400">Double-Spend Check:</span>
                  <span className="text-success font-bold">CLEARED (0 Previous Dispenses)</span>
                </div>
                <div className="p-3 bg-gray-900 rounded-xl flex items-center justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-success font-bold">READY TO DISPENSE</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <span className="text-xs uppercase font-mono tracking-widest text-success font-bold">
                03 • Verification & Anti-Fraud
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Verify before you dispense.
              </h2>
              <p className="text-lg text-muted leading-relaxed">
                Every prescription carries a verifiable digital signature from the issuing clinician. Before dispensing, pharmacies run cryptographic and fraud checks to prevent prescription reuse across locations.
              </p>
              <div className="pt-2">
                <Button onClick={handleExplorePharmacy} variant="outline" size="lg">
                  Explore Pharmacy Dashboard &rarr;
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Storyline Steps */}
      <section className="py-24 bg-surface-elevated/40 text-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
            <span className="text-xs uppercase font-mono tracking-widest text-muted font-bold">
              End-to-End Lifecycle
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              A continuous chain of verifiable trust.
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              From the moment records are placed into the sovereign vault to the final dispensing timestamp, every transition is signed and audited.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-3">
              <span className="text-2xl font-bold font-mono text-security">01</span>
              <h4 className="font-bold">Identity & Vault</h4>
              <p className="text-xs text-muted leading-relaxed">
                Patient registers and generates local ECDSA P-256 key pair to initialize encrypted health vault.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-3">
              <span className="text-2xl font-bold font-mono text-primary">02</span>
              <h4 className="font-bold">Scoped Consent</h4>
              <p className="text-xs text-muted leading-relaxed">
                Doctor requests specific scopes; patient reviews and signs short-lived consent token.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-3">
              <span className="text-2xl font-bold font-mono text-clinical">03</span>
              <h4 className="font-bold">AI Clinical Safety</h4>
              <p className="text-xs text-muted leading-relaxed">
                Prescription checked against allergies and labs. High risks require signed clinical overrides.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-3">
              <span className="text-2xl font-bold font-mono text-success">04</span>
              <h4 className="font-bold">Dispense & Audit</h4>
              <p className="text-xs text-muted leading-relaxed">
                Pharmacy verifies signatures and fraud checks. Every event is written to an immutable audit timeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-[#050505] text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Take control of the clinical record.
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Experience the next generation of patient sovereignty and clinical safety infrastructure.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={handleEnterVault} className="w-full sm:w-auto bg-primary text-white hover:bg-primary-hover px-10">
                Launch Patient Vault
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/patient/audit")} className="w-full sm:w-auto text-white border-gray-700 hover:bg-gray-800">
                View Immutable Audit Log
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
