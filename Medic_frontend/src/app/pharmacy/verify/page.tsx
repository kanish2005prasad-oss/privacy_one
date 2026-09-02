"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppState } from "../../../context/AppStateContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { ShieldCheck, AlertTriangle, Fingerprint, Pill, CheckCircle2, Lock, Unlock, Stethoscope, Activity } from "lucide-react";
import { evaluateFraudRisk } from "../../../lib/fraudEngine";
import { PharmacyTransaction, FraudAlert } from "../../../types/pharmacy";
import { Prescription } from "../../../types/prescription";

function PharmacyVerifyContent() {
  const { state, dispatch } = useAppState();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const id = searchParams?.get("id");
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  
  // Verification phases
  const [phase, setPhase] = useState<"SEARCHING" | "VERIFYING_SIG" | "FRAUD_CHECK" | "RESULT">("SEARCHING");
  
  const [fraudResult, setFraudResult] = useState<{isBlocked: boolean, alert: FraudAlert | null}>({isBlocked: false, alert: null});
  const [isDispensing, setIsDispensing] = useState(false);
  
  const currentLocation = "Chennai Pharmacy #104";

  useEffect(() => {
    if (id) {
      const rx = state.prescriptions.find(p => p.id === id);
      if (rx) {
        setPrescription(rx);
        runVerificationFlow(rx);
      } else {
        setPhase("RESULT");
      }
    } else {
      router.push("/pharmacy");
    }
  }, [id, state.prescriptions, router]);

  const runVerificationFlow = (rx: Prescription) => {
    setPhase("VERIFYING_SIG");
    
    setTimeout(() => {
      setPhase("FRAUD_CHECK");
      
      setTimeout(() => {
        const fraudCheck = evaluateFraudRisk(rx, currentLocation, state.pharmacyTransactions);
        
        if (fraudCheck.isBlocked && fraudCheck.alert) {
          dispatch({ type: "ADD_FRAUD_ALERT", payload: fraudCheck.alert });
          
          dispatch({
            type: "ADD_AUDIT_EVENT",
            payload: {
              id: `AUD-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actor: "Fraud Detection Engine",
              eventType: "FRAUD_ANALYSIS",
              description: fraudCheck.alert.reason,
              referenceId: rx.id,
              status: "BLOCKED"
            }
          });
        }
        
        setFraudResult(fraudCheck);
        setPhase("RESULT");
      }, 2000);
    }, 2000);
  };

  const handleDispense = () => {
    if (!prescription) return;
    setIsDispensing(true);
    
    setTimeout(() => {
      const tx: PharmacyTransaction = {
        id: `TX-${Date.now()}`,
        prescriptionId: prescription.id,
        pharmacistId: "PHARM-8821",
        location: currentLocation,
        timestamp: new Date().toISOString(),
        status: "COMPLETED"
      };
      
      dispatch({
        type: "UPDATE_PRESCRIPTION_STATUS",
        payload: { id: prescription.id, status: "DISPENSED" }
      });
      
      dispatch({ type: "ADD_PHARMACY_TRANSACTION", payload: tx });
      
      dispatch({
        type: "ADD_AUDIT_EVENT",
        payload: {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: "Chennai Pharmacy #104",
          eventType: "PRESCRIPTION_DISPENSED",
          description: `Dispensed medication ${prescription.medication}. Signature verified.`,
          referenceId: tx.id,
          status: "SUCCESS"
        }
      });
      
      router.push("/pharmacy");
    }, 2000);
  };

  if (phase === "SEARCHING") {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface pb-24 pt-12 px-4">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-border rounded-full"></div>
            <div className="absolute inset-0 border-4 border-success rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold">Locating Prescription...</h2>
        </div>
      </div>
    );
  }

  if (phase === "RESULT" && !prescription) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-surface pb-24 pt-12">
        <Card className="max-w-md w-full text-center p-8">
          <AlertTriangle size={48} className="mx-auto text-danger mb-6" />
          <h2 className="text-2xl font-bold mb-2">Not Found</h2>
          <p className="text-muted mb-8">No prescription exists with ID: <span className="font-mono">{id}</span></p>
          <Button onClick={() => router.push("/pharmacy")} fullWidth>Back to Search</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 py-12 px-4 bg-surface pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => router.push("/pharmacy")} className="mb-4 -ml-4">
              &larr; Back
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Prescription Verification</h1>
          </div>
          
          <Badge variant="outline" className="font-mono text-base px-4 py-1">
            {id}
          </Badge>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          
          {/* Verification Status Sidebar */}
          <div className="md:col-span-2 space-y-4">
            <Card className="bg-[#0A0A0A] text-white border-gray-800">
              <CardHeader className="pb-4 border-b border-gray-800">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck size={20} className="text-success" />
                  Security Protocol
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                
                {/* Step 1: Signature */}
                <div className="flex items-start gap-4">
                  <div className={`mt-1 rounded-full p-1 ${phase === "VERIFYING_SIG" ? "bg-primary/20 text-primary animate-pulse" : "bg-success/20 text-success"}`}>
                    {phase === "VERIFYING_SIG" ? <Lock size={16} /> : <Unlock size={16} />}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Cryptographic Signature</h4>
                    <p className="text-sm text-gray-400">
                      {phase === "VERIFYING_SIG" ? "Verifying issuer public key..." : "Signature verified. Issuer authenticated."}
                    </p>
                  </div>
                </div>

                {/* Step 2: Fraud Check */}
                {(phase === "FRAUD_CHECK" || phase === "RESULT") && (
                  <div className="flex items-start gap-4 animate-slide-up">
                    <div className={`mt-1 rounded-full p-1 ${
                      phase === "FRAUD_CHECK" ? "bg-warning/20 text-warning animate-pulse" : 
                      fraudResult.isBlocked ? "bg-danger/20 text-danger" : "bg-success/20 text-success"
                    }`}>
                      {phase === "FRAUD_CHECK" ? <Activity size={16} /> : 
                       fraudResult.isBlocked ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Fraud Detection Network</h4>
                      <p className="text-sm text-gray-400">
                        {phase === "FRAUD_CHECK" ? "Running double-spend & anomaly checks..." : 
                         fraudResult.isBlocked ? "Suspicious activity detected." : "Network consensus reached. No anomalies."}
                      </p>
                    </div>
                  </div>
                )}
                
              </CardContent>
            </Card>

            {phase === "RESULT" && fraudResult.isBlocked && fraudResult.alert && (
              <Card className="border-danger/50 bg-danger/5 shadow-[0_0_20px_rgba(239,68,68,0.1)] animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-danger flex items-center gap-2">
                    <AlertTriangle size={20} />
                    DISPENSE BLOCKED
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-sm mb-4">{fraudResult.alert.reason}</p>
                  <div className="bg-surface p-3 rounded-lg border border-danger/20 text-xs font-mono space-y-1">
                    <p>Alert ID: {fraudResult.alert.id}</p>
                    <p>Attempt Loc: {fraudResult.alert.location}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Prescription Data */}
          <div className="md:col-span-3">
            <Card className={`h-full transition-opacity duration-1000 ${phase !== "RESULT" ? "opacity-50 blur-sm pointer-events-none" : "opacity-100"}`}>
              <CardHeader className="border-b border-border pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-success">
                    <ShieldCheck size={18} />
                    <span className="text-sm font-semibold uppercase tracking-wider">Verified Payload</span>
                  </div>
                  {prescription?.status === "DISPENSED" ? (
                    <Badge variant="warning">Already Dispensed</Badge>
                  ) : (
                    <Badge variant="success">Active</Badge>
                  )}
                </div>
                <CardTitle className="text-3xl text-primary">{prescription?.medication}</CardTitle>
                <CardDescription className="text-base">{prescription?.dosage} • {prescription?.route}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted font-semibold block mb-2">Instructions</span>
                    <p className="font-medium">{prescription?.instructions}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted font-semibold block mb-2">Frequency</span>
                    <p className="font-medium">{prescription?.frequency} for {prescription?.duration}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <span className="text-xs uppercase tracking-wider text-muted font-semibold block mb-2">Issuer Authentication</span>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center shrink-0">
                      <Stethoscope size={20} className="text-muted" />
                    </div>
                    <div>
                      <p className="font-semibold">{prescription?.prescriberName}</p>
                      <p className="text-xs font-mono text-muted bg-surface-elevated px-1.5 py-0.5 rounded inline-block mt-1">
                        {prescription?.signature?.substring(0, 24)}...
                      </p>
                    </div>
                  </div>
                </div>

                {prescription?.overrideJustificationCode && (
                  <div className="bg-warning/10 border border-warning/20 p-4 rounded-xl">
                    <span className="text-xs uppercase tracking-wider text-warning-dark font-semibold block mb-1 flex items-center gap-1">
                      <AlertTriangle size={14} /> Clinical Override Attached
                    </span>
                    <p className="text-sm text-warning-dark font-medium mb-1">Code: {prescription.overrideJustificationCode}</p>
                    <p className="text-sm text-warning-dark">{prescription.overrideExplanation}</p>
                  </div>
                )}

                <div className="pt-6 border-t border-border flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => router.push("/pharmacy")}>
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-success hover:bg-green-600 border-0" 
                    size="lg"
                    disabled={phase !== "RESULT" || (fraudResult.isBlocked ?? false) || isDispensing || prescription?.status === "DISPENSED"}
                    onClick={handleDispense}
                  >
                    {isDispensing ? "Recording Dispense..." : "Dispense Medication"}
                  </Button>
                </div>
                
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default function PharmacyVerifyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PharmacyVerifyContent />
    </Suspense>
  );
}
