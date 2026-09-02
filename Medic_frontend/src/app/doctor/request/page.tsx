"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "../../../context/AppStateContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { ClipboardCheck, User, Clock, FileText } from "lucide-react";
import { RecordCategory } from "../../../types/health-record";
import { AccessRequest } from "../../../types/consent";

export default function AccessRequestBuilder() {
  const { state, dispatch } = useAppState();
  const router = useRouter();
  
  // For demo, just pick the first patient
  const patient = state.patients[0];
  
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState(30);
  const [selectedCategories, setSelectedCategories] = useState<RecordCategory[]>([]);
  
  const categories: { id: RecordCategory, label: string }[] = [
    { id: "demographics", label: "Demographics" },
    { id: "medications", label: "Medications" },
    { id: "allergies", label: "Allergies" },
    { id: "labs", label: "Laboratory Results" },
    { id: "diagnoses", label: "Diagnoses" },
    { id: "imaging", label: "Imaging" },
    { id: "clinical-notes", label: "Clinical Notes" }
  ];

  const purposes = [
    "Medication reconciliation",
    "Diagnosis evaluation",
    "Pre-operative assessment",
    "Emergency treatment",
    "Chronic disease management"
  ];

  const toggleCategory = (id: RecordCategory) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(c => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedCategories.length === 0 || !purpose) return;
    
    const request: AccessRequest = {
      id: `REQ-${Date.now()}`,
      patientId: patient.id,
      requesterName: "Dr. Vikram Narayan",
      requesterOrganization: "Emory Healthcare",
      clinicalPurpose: purpose,
      requestedCategories: selectedCategories,
      durationMinutes: duration,
      requestedAt: new Date().toISOString(),
      status: "pending"
    };
    
    dispatch({ type: "CREATE_ACCESS_REQUEST", payload: request });
    
    dispatch({
      type: "ADD_AUDIT_EVENT",
      payload: {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: "Dr. Vikram Narayan",
        eventType: "ACCESS_REQUEST_CREATED",
        description: `Requested access to ${selectedCategories.length} categories for ${duration} minutes.`,
        referenceId: request.id,
        status: "SUCCESS"
      }
    });
    
    router.push("/doctor");
  };

  return (
    <div className="flex-1 py-12 px-4 bg-surface">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/doctor")} className="mb-4 -ml-4">
            &larr; Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Build Access Request</h1>
          <p className="text-muted">Request specific clinical data from the patient vault.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <User size={18} />
                  <span className="text-sm font-semibold uppercase tracking-wider">Patient</span>
                </div>
                <CardTitle className="text-2xl">{patient.name}</CardTitle>
                <CardDescription className="font-mono">{patient.id}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <FileText size={18} />
                  <span className="text-sm font-semibold uppercase tracking-wider">Scope</span>
                </div>
                <CardTitle className="text-xl">Record Categories</CardTitle>
                <CardDescription>Select only the categories necessary for your clinical purpose.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {categories.map(cat => (
                    <label 
                      key={cat.id} 
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                        selectedCategories.includes(cat.id) 
                          ? "bg-primary/5 border-primary shadow-sm" 
                          : "bg-surface-elevated border-transparent hover:border-border"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded text-primary focus:ring-primary border-border"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                      />
                      <span className="font-medium">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <ClipboardCheck size={18} />
                  <span className="text-sm font-semibold uppercase tracking-wider">Purpose</span>
                </div>
                <CardTitle className="text-xl">Clinical Purpose</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <select 
                  className="w-full p-4 bg-surface-elevated border border-border rounded-xl font-medium focus:ring-2 focus:ring-primary outline-none"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a clinical purpose</option>
                  {purposes.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                
                {purpose === "Other" && (
                  <textarea 
                    className="w-full p-4 bg-surface-elevated border border-border rounded-xl font-medium focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Describe the clinical purpose..."
                    rows={3}
                    required
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24 bg-[#0A0A0A] text-white border-gray-800">
              <CardHeader>
                <CardTitle>Request Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-2">Scope</span>
                  <div className="text-3xl font-light tracking-tight mb-1">
                    {selectedCategories.length} <span className="text-lg text-gray-400">categories</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-2">Time Window</span>
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-primary" />
                    <select 
                      className="bg-transparent border-b border-gray-700 text-lg font-medium text-white pb-1 focus:border-primary outline-none"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                    >
                      <option value={15} className="text-black">15 minutes</option>
                      <option value={30} className="text-black">30 minutes</option>
                      <option value={60} className="text-black">1 hour</option>
                      <option value={240} className="text-black">4 hours</option>
                      <option value={1440} className="text-black">24 hours</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-800">
                  <Button 
                    type="submit" 
                    fullWidth 
                    size="lg" 
                    disabled={selectedCategories.length === 0 || !purpose}
                  >
                    Request Patient Authorization
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
        </form>
      </div>
    </div>
  );
}
