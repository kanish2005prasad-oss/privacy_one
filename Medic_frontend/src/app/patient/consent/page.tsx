"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppState } from "../../../context/AppStateContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { ShieldCheck, Fingerprint, ScanFace, KeyRound, CheckCircle2, Lock } from "lucide-react";
import { ConsentToken } from "../../../types/consent";

function ConsentApprovalContent() {
  const { state, dispatch } = useAppState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  
  const [step, setStep] = useState(1);
  const [authMethod, setAuthMethod] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<ConsentToken | null>(null);
  
  const request = state.accessRequests.find(r => r.id === id);
  const patient = state.patients[0];

  if (!request) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="max-w-md text-center p-8">
          <ShieldCheck size={48} className="mx-auto text-muted mb-6" />
          <h2 className="text-2xl font-bold mb-2">Request Not Found</h2>
          <p className="text-muted mb-8">This access request may have expired or does not exist.</p>
          <Button onClick={() => router.push("/patient")} fullWidth>Return to Dashboard</Button>
        </Card>
      </div>
    );
  }

  const handleDecline = () => {
    dispatch({ type: "DENY_ACCESS_REQUEST", payload: request.id });
    
    dispatch({
      type: "ADD_AUDIT_EVENT",
      payload: {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: patient.name,
        eventType: "CONSENT_REVIEWED",
        description: `Denied access request from ${request.requesterName}.`,
        referenceId: request.id,
        status: "BLOCKED"
      }
    });
    
    router.push("/patient");
  };

  const handleAuthSelection = (method: string) => {
    setAuthMethod(method);
    setStep(3);
    
    setIsAuthenticating(true);
    
    setTimeout(() => {
      const token: ConsentToken = {
        id: `CSN-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        requestId: request.id,
        patientId: patient.id,
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(new Date().getTime() + request.durationMinutes * 60000).toISOString(),
        authorizedCategories: request.requestedCategories,
        clinicalPurpose: request.clinicalPurpose,
        signatureFingerprint: "SIG:" + Math.random().toString(16).substring(2, 10).toUpperCase()
      };
      
      dispatch({
        type: "APPROVE_ACCESS_REQUEST",
        payload: { requestId: request.id, token }
      });
      
      dispatch({
        type: "ADD_AUDIT_EVENT",
        payload: {
          id: `AUD-${Date.now()}-1`,
          timestamp: new Date().toISOString(),
          actor: patient.name,
          eventType: "BIOMETRIC_AUTH",
          description: `Identity verified via ${method}.`,
          status: "SUCCESS"
        }
      });
      
      dispatch({
        type: "ADD_AUDIT_EVENT",
        payload: {
          id: `AUD-${Date.now()}-2`,
          timestamp: new Date(new Date().getTime() + 1000).toISOString(),
          actor: "System",
          eventType: "CONSENT_TOKEN_GENERATED",
          description: `Generated scoped consent token for ${request.requesterName}.`,
          referenceId: token.id,
          status: "SUCCESS"
        }
      });
      
      setGeneratedToken(token);
      setIsAuthenticating(false);
      setStep(4);
    }, 3000);
  };

  return (
    <div className="flex-1 py-12 px-4 bg-surface">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="mb-12">
          <Button variant="ghost" onClick={() => router.push("/patient")} className="mb-4 -ml-4">
            &larr; Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold tracking-tight">Review Access Request</h1>
        </div>

        <Card className="shadow-2xl overflow-hidden border-border/80">
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="bg-[#0A0A0A] text-white p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <ShieldCheck size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Requester</p>
                    <h2 className="text-xl font-bold">{request.requesterName}</h2>
                    <p className="text-gray-400 text-sm">{request.requesterOrganization}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 block">Clinical Purpose</span>
                    <p className="text-lg">{request.clinicalPurpose}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 block">Access Window</span>
                    <p className="text-lg">{request.durationMinutes} minutes</p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Requested Records</h3>
                  <p className="text-sm text-muted mb-4">Only the selected fields will be unlocked. Everything else remains encrypted.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {request.requestedCategories.map(cat => (
                      <div key={cat} className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/10 rounded-xl">
                        <CheckCircle2 size={16} className="text-primary" />
                        <span className="font-medium capitalize">{cat.replace('-', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 text-amber-900">
                  <Lock className="shrink-0 mt-0.5 text-amber-600" size={18} />
                  <p className="text-sm"><strong>Patient Sovereignty:</strong> Nothing outside these exact fields will be unlocked, and access expires automatically after {request.durationMinutes} minutes.</p>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button fullWidth size="lg" onClick={() => setStep(2)}>Review & Authenticate</Button>
                  <Button fullWidth size="lg" variant="outline" onClick={handleDecline} className="text-danger border-danger/20 hover:bg-danger/5">Decline</Button>
                </div>
              </CardContent>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in p-8 text-center space-y-8">
              <ShieldCheck size={48} className="mx-auto text-primary mb-4" />
              <div>
                <h3 className="text-2xl font-bold mb-2">Authenticate to Sign</h3>
                <p className="text-muted">Verify your identity to cryptographically sign this consent token.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                <Button variant="outline" size="lg" className="h-16 flex justify-start gap-4 px-6 text-lg" onClick={() => handleAuthSelection("Face ID")}>
                  <ScanFace className="text-muted" size={24} /> Face ID
                </Button>
                <Button variant="outline" size="lg" className="h-16 flex justify-start gap-4 px-6 text-lg" onClick={() => handleAuthSelection("Fingerprint")}>
                  <Fingerprint className="text-muted" size={24} /> Fingerprint
                </Button>
                <Button variant="outline" size="lg" className="h-16 flex justify-start gap-4 px-6 text-lg" onClick={() => handleAuthSelection("Device PIN")}>
                  <KeyRound className="text-muted" size={24} /> Device PIN
                </Button>
              </div>
              <Button variant="ghost" onClick={() => setStep(1)}>Cancel</Button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in p-16 text-center space-y-8">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-surface-elevated rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-primary">
                  {authMethod === "Face ID" ? <ScanFace size={32} /> : authMethod === "Fingerprint" ? <Fingerprint size={32} /> : <KeyRound size={32} />}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold animate-pulse">Authenticating...</h3>
                <p className="text-muted font-mono text-sm">Verifying identity & signing consent</p>
              </div>
            </div>
          )}

          {step === 4 && generatedToken && (
            <div className="animate-fade-in p-8 md:p-12">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-success" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Consent Signed</h2>
                <p className="text-muted">The cryptographic token has been generated.</p>
              </div>
              
              <div className="bg-[#050505] text-white rounded-[24px] p-8 border border-gray-800 shadow-2xl relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[60px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1 block">Consent Token</span>
                      <p className="text-xl font-mono text-primary">{generatedToken.id}</p>
                    </div>
                    <Badge variant="success" className="bg-success/20">ACTIVE</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1 block">Expires</span>
                      <p className="font-medium text-lg">{new Date(generatedToken.expiresAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1 block">Issuer</span>
                      <p className="font-mono text-sm text-gray-300">{patient.id.substring(0,12)}...</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 block">Authorized Scope</span>
                    <div className="flex flex-wrap gap-2">
                      {generatedToken.authorizedCategories.map(cat => (
                        <span key={cat} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm capitalize">{cat.replace('-', ' ')}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <Button fullWidth size="lg" onClick={() => router.push("/patient")}>Return to Dashboard</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function ConsentApprovalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ConsentApprovalContent />
    </Suspense>
  );
}
