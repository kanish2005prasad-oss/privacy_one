"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "../../context/AppStateContext";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { ShieldCheck, UserCheck, KeyRound, Lock, Fingerprint } from "lucide-react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const { state, dispatch } = useAppState();
  const router = useRouter();

  // For the demo, we assume the first mock patient is the one being onboarded if not already
  const patient = state.patients[0];

  const handleGenerateIdentity = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(2);
    }, 2000);
  };

  const handleGenerateKeys = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3);
    }, 2500);
  };

  const handleInitializeVault = () => {
    setIsGenerating(true);
    setTimeout(() => {
      dispatch({
        type: "INITIALIZE_VAULT",
        payload: {
          patientId: patient.id,
          publicKeyFingerprint: "SHA256:8F:21:AC:77:4D:91:02",
          keyAlgorithm: "ECDSA P-256"
        }
      });
      
      dispatch({
        type: "ADD_AUDIT_EVENT",
        payload: {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: patient.name,
          eventType: "IDENTITY_CREATED",
          description: "Patient cryptographic identity established.",
          status: "SUCCESS"
        }
      });
      
      setIsGenerating(false);
      setStep(4);
    }, 1500);
  };

  const handleComplete = () => {
    router.push("/patient");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-surface py-20">
      <div className="w-full max-w-2xl">
        {/* Progress Tracker */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${(step - 1) * 33.33}%` }}></div>
          
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${s <= step ? 'bg-primary text-white' : 'bg-surface border border-border text-muted'}`}>
              {s}
            </div>
          ))}
        </div>

        {/* Steps */}
        <Card className="shadow-2xl">
          {step === 1 && (
            <div className="animate-fade-in">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <UserCheck size={32} />
                </div>
                <CardTitle className="text-3xl">Create Patient Identity</CardTitle>
                <CardDescription className="text-lg">Register your basic demographic information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <input type="text" value={patient.name} disabled className="w-full bg-surface-elevated border border-border rounded-lg p-3 text-foreground" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Date of Birth</label>
                    <input type="text" value={patient.dateOfBirth} disabled className="w-full bg-surface-elevated border border-border rounded-lg p-3 text-foreground" />
                  </div>
                </div>
                <Button fullWidth size="lg" onClick={handleGenerateIdentity} disabled={isGenerating}>
                  {isGenerating ? "Generating identity..." : "Create Patient Identity"}
                </Button>
                {isGenerating && <p className="text-center text-sm text-muted animate-pulse">Creating sovereign identifier...</p>}
              </CardContent>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-security/10 flex items-center justify-center text-security mx-auto mb-4">
                  <KeyRound size={32} />
                </div>
                <CardTitle className="text-3xl">Cryptographic Identity</CardTitle>
                <CardDescription className="text-lg">Generate your personal cryptographic keys to secure your records.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <div className="bg-[#0A0A0A] text-gray-300 p-6 rounded-2xl font-mono text-sm space-y-4 border border-gray-800">
                  <div>
                    <span className="text-gray-500 block mb-1">Public Key (ECDSA P-256)</span>
                    <span className="text-security break-all">{isGenerating ? "Generating entropy..." : "SHA256:8F:21:AC:77:4D:91:02"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Private Key</span>
                    <span className="text-white tracking-widest">{isGenerating ? "••••••••••••••••••••" : "•••••••••••••••••••• (Stored Locally)"}</span>
                  </div>
                </div>
                <div className="text-center text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <strong>Prototype Note:</strong> This is a frontend simulation. Keys are not securely custodied in this demo.
                </div>
                <Button fullWidth size="lg" onClick={handleGenerateKeys} disabled={isGenerating} className="bg-security hover:bg-security/90 text-white shadow-security/20">
                  {isGenerating ? "Computing fingerprint..." : "Generate Key Pair"}
                </Button>
              </CardContent>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <Lock size={32} />
                </div>
                <CardTitle className="text-3xl">Your Health Vault</CardTitle>
                <CardDescription className="text-lg">Store your health records under your cryptographic control.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 border border-border rounded-xl bg-surface-elevated">FHIR Records</div>
                  <div className="p-4 border border-border rounded-xl bg-surface-elevated">Lab Results</div>
                  <div className="p-4 border border-border rounded-xl bg-surface-elevated">Medication History</div>
                  <div className="p-4 border border-border rounded-xl bg-surface-elevated">Clinical Notes</div>
                </div>
                
                <div className="flex items-center justify-between p-6 bg-surface-elevated border border-border rounded-2xl">
                  <div>
                    <h4 className="font-semibold text-lg">Secure Vault Storage</h4>
                    <p className="text-sm text-muted">Encrypt existing records</p>
                  </div>
                  <Button onClick={handleInitializeVault} disabled={isGenerating} size="lg" className="w-32">
                    {isGenerating ? "Encrypting..." : "Initialize"}
                  </Button>
                </div>
              </CardContent>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in text-center">
              <CardContent className="py-16 space-y-6">
                <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center text-success mx-auto mb-8">
                  <ShieldCheck size={48} />
                </div>
                <h2 className="text-4xl font-bold tracking-tight">Vault Initialized</h2>
                <p className="text-xl text-muted max-w-md mx-auto">
                  Your identity is established. You are now the sovereign owner of your health data.
                </p>
                <div className="pt-8">
                  <Button size="lg" onClick={handleComplete} className="w-full sm:w-auto px-12">
                    Enter Dashboard
                  </Button>
                </div>
              </CardContent>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
