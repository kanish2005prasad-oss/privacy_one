"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppState } from "../../../context/AppStateContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Pill, Activity, AlertTriangle, ShieldCheck, Signature, CheckCircle2 } from "lucide-react";
import { evaluatePrescription } from "../../../lib/clinicalEngine";
import { AIAssessment } from "../../../types/ai";
import { Prescription } from "../../../types/prescription";

function PrescriptionBuilderContent() {
  const { state, dispatch } = useAppState();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const tokenId = searchParams?.get("token");
  const token = state.consentTokens.find(t => t.id === tokenId);
  const patient = (token ? state.patients.find(p => p.id === token.patientId) : state.patients[0]) ?? state.patients[0];
  
  const [formData, setFormData] = useState({
    medication: "",
    dosage: "",
    route: "Oral",
    frequency: "",
    duration: "",
    quantity: "",
    instructions: ""
  });
  
  const [assessment, setAssessment] = useState<AIAssessment | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const [showOverride, setShowOverride] = useState(false);
  const [overrideData, setOverrideData] = useState({
    justificationCode: "",
    explanation: ""
  });
  const [isSigning, setIsSigning] = useState(false);
  const [signedPrescriptionId, setSignedPrescriptionId] = useState<string | null>(null);

  const medications = ["Amoxicillin", "Metformin", "Azithromycin", "Atorvastatin", "Lisinopril", "Ibuprofen"];
  
  const handleRunIntelligence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.medication) return;
    
    setIsEvaluating(true);
    
    try {
      const result = await evaluatePrescription(formData, state.healthRecords);
      setAssessment(result);
      
      dispatch({
        type: "ADD_AUDIT_EVENT",
        payload: {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: "Clinical Intelligence Engine",
          eventType: "AI_RISK_ASSESSMENT",
          description: `Evaluated ${formData.medication} for ${patient.name}. Risk Level: ${result.riskLevel.toUpperCase()}`,
          status: result.riskLevel === "critical" ? "BLOCKED" : result.riskLevel === "high" ? "WARNING" : "SUCCESS"
        }
      });
    } catch (error) {
      console.error("Evaluation failed", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSignNormal = () => {
    signPrescription(false);
  };

  const handleSignOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideData.justificationCode || !overrideData.explanation) return;
    signPrescription(true);
  };

  const signPrescription = (isOverride: boolean) => {
    setIsSigning(true);
    
    setTimeout(() => {
      const pId = `RX-2026-${Math.floor(Math.random() * 90000) + 10000}`;
      const sig = `SIG-RX-${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
      
      const prescription: Prescription = {
        id: pId,
        patientId: patient.id,
        prescriberName: "Dr. Vikram Narayan",
        ...formData,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        signedAt: new Date().toISOString(),
        signature: sig,
        ...(isOverride && {
          overrideJustificationCode: overrideData.justificationCode,
          overrideExplanation: overrideData.explanation
        })
      };
      
      dispatch({ type: "CREATE_PRESCRIPTION", payload: prescription });
      
      if (isOverride) {
        dispatch({
          type: "ADD_AUDIT_EVENT",
          payload: {
            id: `AUD-${Date.now()}-1`,
            timestamp: new Date().toISOString(),
            actor: "Dr. Vikram Narayan",
            eventType: "OVERRIDE_SIGNED",
            description: `Signed clinical override for ${formData.medication}. Justification: ${overrideData.justificationCode}`,
            referenceId: pId,
            status: "WARNING"
          }
        });
      }
      
      dispatch({
        type: "ADD_AUDIT_EVENT",
        payload: {
          id: `AUD-${Date.now()}-2`,
          timestamp: new Date(new Date().getTime() + 1000).toISOString(),
          actor: "Dr. Vikram Narayan",
          eventType: "PRESCRIPTION_ISSUED",
          description: `Cryptographically signed prescription for ${formData.medication}.`,
          referenceId: pId,
          status: "SUCCESS"
        }
      });
      
      setSignedPrescriptionId(pId);
      setIsSigning(false);
      setShowOverride(false);
    }, 2000);
  };

  if (signedPrescriptionId) {
    const rx = state.prescriptions.find(p => p.id === signedPrescriptionId);
    return (
      <div className="flex-1 py-12 px-4 bg-surface flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-success" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Prescription Issued</h2>
            <p className="text-muted">The prescription has been signed and is now available to authorized pharmacies.</p>
          </div>
          
          <Card className="bg-[#050505] text-white border-gray-800 shadow-2xl mb-8">
            <CardHeader className="border-b border-gray-800 pb-6">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="success" className="bg-success/20 text-success">ACTIVE</Badge>
                <div className="flex items-center gap-1 text-primary">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Signed</span>
                </div>
              </div>
              <CardTitle className="text-2xl font-mono text-primary">{rx?.id}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1">Medication</span>
                  <p className="text-xl font-bold">{rx?.medication}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1">Dosage</span>
                  <p className="text-lg">{rx?.dosage}</p>
                </div>
              </div>
              
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1">Instructions</span>
                <p className="text-gray-300">{rx?.instructions}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-2">Digital Signature</span>
                <div className="bg-gray-900 p-3 rounded-lg font-mono text-xs text-gray-400 break-all">
                  {rx?.signature}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button fullWidth size="lg" onClick={() => router.push("/doctor")}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-12 px-4 bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/doctor")} className="mb-4 -ml-4">
            &larr; Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold tracking-tight">Prescription Builder</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prescription Details</CardTitle>
                {patient && <CardDescription>For patient: {patient.name}</CardDescription>}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRunIntelligence} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium block mb-1">Medication</label>
                    <select 
                      className="w-full p-3 bg-surface-elevated border border-border rounded-xl font-medium focus:ring-2 focus:ring-primary outline-none"
                      value={formData.medication}
                      onChange={(e) => setFormData({...formData, medication: e.target.value})}
                      required
                      disabled={!!assessment}
                    >
                      <option value="" disabled>Select medication</option>
                      {medications.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Dosage</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 500mg" 
                        className="w-full p-3 bg-surface-elevated border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.dosage}
                        onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                        disabled={!!assessment}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Route</label>
                      <select 
                        className="w-full p-3 bg-surface-elevated border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.route}
                        onChange={(e) => setFormData({...formData, route: e.target.value})}
                        disabled={!!assessment}
                      >
                        <option value="Oral">Oral</option>
                        <option value="Topical">Topical</option>
                        <option value="Injection">Injection</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Frequency</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Twice daily" 
                        className="w-full p-3 bg-surface-elevated border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.frequency}
                        onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                        disabled={!!assessment}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Duration</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 7 days" 
                        className="w-full p-3 bg-surface-elevated border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        disabled={!!assessment}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">Instructions</label>
                    <textarea 
                      placeholder="Take with food..." 
                      className="w-full p-3 bg-surface-elevated border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      rows={2}
                      value={formData.instructions}
                      onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                      disabled={!!assessment}
                    />
                  </div>

                  {!assessment && (
                    <Button type="submit" fullWidth size="lg" disabled={isEvaluating || !formData.medication} className="bg-clinical hover:bg-clinical/90 shadow-clinical/20">
                      {isEvaluating ? "Evaluating Risk..." : "Run Clinical Intelligence"}
                    </Button>
                  )}
                  
                  {assessment && (
                    <Button variant="outline" fullWidth onClick={() => setAssessment(null)}>
                      Edit Prescription
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* AI Risk UI */}
          <div>
            {!assessment && !isEvaluating && (
              <div className="h-full border-2 border-dashed border-border rounded-[28px] flex flex-col items-center justify-center p-12 text-center text-muted bg-surface-elevated/50">
                <Activity size={48} className="mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Clinical Intelligence</h3>
                <p>Complete the prescription details to run automated safety checks against the patient's authorized health vault records.</p>
              </div>
            )}
            
            {isEvaluating && (
              <div className="h-full border border-border rounded-[28px] flex flex-col items-center justify-center p-12 text-center bg-[#0A0A0A] text-white">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-clinical rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-2xl font-bold mb-2 animate-pulse text-clinical">Running Safety Engine...</h3>
                <p className="text-gray-400 font-mono text-sm">Cross-referencing allergies, labs, and active medications</p>
              </div>
            )}

            {assessment && !showOverride && (
              <div className="animate-fade-in bg-[#0A0A0A] text-white border border-gray-800 rounded-[28px] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-gray-800 bg-gradient-to-b from-clinical/10 to-transparent">
                  <div className="flex items-center gap-3 text-clinical mb-6">
                    <Activity size={24} />
                    <h2 className="font-bold tracking-widest uppercase text-sm">Clinical Intelligence</h2>
                  </div>
                  
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      {assessment.riskLevel === "critical" && <Badge variant="danger" className="text-lg px-4 py-1 mb-2">CRITICAL RISK</Badge>}
                      {assessment.riskLevel === "high" && <Badge variant="warning" className="text-lg px-4 py-1 mb-2">HIGH RISK</Badge>}
                      {assessment.riskLevel === "moderate" && <Badge variant="warning" className="text-lg px-4 py-1 mb-2">MODERATE RISK</Badge>}
                      {assessment.riskLevel === "low" && <Badge variant="success" className="text-lg px-4 py-1 mb-2">SAFE</Badge>}
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-light tracking-tight">{assessment.riskScore}</span>
                      <span className="text-gray-500">/100</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 space-y-8">
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4">Why this was flagged</h3>
                    <div className="space-y-3">
                      {assessment.findings.map((f, i) => (
                        <div key={f.id} className="flex items-start gap-3 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                          <span className="text-gray-500 font-mono mt-0.5">{i+1}.</span>
                          <p className="text-gray-300">{f.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {assessment.alternatives.length > 0 && (
                    <div>
                      <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4">Recommended Alternatives</h3>
                      <div className="space-y-3">
                        {assessment.alternatives.map((alt, i) => (
                          <div key={i} className="bg-clinical/5 border border-clinical/20 p-4 rounded-xl">
                            <h4 className="font-bold text-clinical mb-1">{alt.medicationName}</h4>
                            <p className="text-sm text-gray-400">{alt.rationale}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-800">
                    {(assessment.riskLevel === "critical" || assessment.riskLevel === "high") ? (
                      <Button fullWidth size="lg" onClick={() => setShowOverride(true)} className="bg-transparent border border-danger text-danger hover:bg-danger/10">
                        <AlertTriangle size={18} className="mr-2" /> Override Clinical Warning
                      </Button>
                    ) : (
                      <Button fullWidth size="lg" onClick={handleSignNormal} disabled={isSigning}>
                        {isSigning ? "Signing..." : <><Signature size={18} className="mr-2" /> Sign Prescription</>}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showOverride && (
              <div className="animate-fade-in bg-[#0A0A0A] text-white border border-danger/50 rounded-[28px] shadow-[0_0_40px_rgba(239,68,68,0.15)]">
                <div className="p-8 border-b border-gray-800">
                  <div className="flex items-center gap-3 text-danger mb-2">
                    <AlertTriangle size={24} />
                    <h2 className="text-xl font-bold">Clinical Override Required</h2>
                  </div>
                  <p className="text-gray-400">You are overriding a {assessment?.riskLevel.toUpperCase()} risk warning.</p>
                </div>
                
                <form onSubmit={handleSignOverride} className="p-8 space-y-6">
                  <div>
                    <label className="text-sm font-medium block mb-2 text-gray-300">Justification Code</label>
                    <select 
                      className="w-full p-4 bg-gray-900 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-danger outline-none"
                      value={overrideData.justificationCode}
                      onChange={(e) => setOverrideData({...overrideData, justificationCode: e.target.value})}
                      required
                    >
                      <option value="" disabled>Select justification...</option>
                      <option value="J01">J01 — No suitable alternative</option>
                      <option value="J02">J02 — Specialist-directed therapy</option>
                      <option value="J03">J03 — Emergency treatment</option>
                      <option value="J04">J04 — Patient-specific clinical exception</option>
                      <option value="J05">J05 — Other documented rationale</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2 text-gray-300">Clinical Explanation</label>
                    <textarea 
                      className="w-full p-4 bg-gray-900 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-danger outline-none"
                      placeholder="Provide explicit rationale for this override..."
                      rows={4}
                      value={overrideData.explanation}
                      onChange={(e) => setOverrideData({...overrideData, explanation: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="bg-danger/10 border border-danger/20 p-4 rounded-xl flex gap-3 text-danger mb-6">
                    <ShieldCheck className="shrink-0 mt-0.5" size={18} />
                    <p className="text-sm">This override and its justification will be cryptographically signed and permanently recorded in the immutable audit ledger.</p>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="border-gray-700 text-gray-300 hover:text-white" onClick={() => setShowOverride(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-danger hover:bg-red-600 border-0" disabled={isSigning}>
                      {isSigning ? "Signing Override..." : <><Signature size={18} className="mr-2" /> Sign Override</>}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function PrescriptionBuilder() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PrescriptionBuilderContent />
    </Suspense>
  );
}
