"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "../../context/AppStateContext";
import { ChevronDown, Zap, RotateCcw } from "lucide-react";

export const DemoController = () => {
  const { state, dispatch } = useAppState();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const scenarios = [
    {
      label: "1. Onboard Patient",
      description: "Set up identity & vault",
      action: () => { dispatch({ type: "SET_ROLE", payload: "patient" }); router.push("/onboarding"); }
    },
    {
      label: "2. Patient Dashboard",
      description: "View pending consent requests",
      action: () => { dispatch({ type: "SET_ROLE", payload: "patient" }); router.push("/patient"); }
    },
    {
      label: "3. Approve Consent",
      description: "Sign access token for doctor",
      action: () => {
        const pending = state.accessRequests.filter(r => r.status === "pending");
        dispatch({ type: "SET_ROLE", payload: "patient" });
        if (pending.length > 0) router.push(`/patient/consent?id=${pending[0].id}`);
        else router.push("/patient");
      }
    },
    {
      label: "4. Doctor Access",
      description: "View authorized records",
      action: () => {
        const activeToken = state.consentTokens.find(t => new Date(t.expiresAt) > new Date());
        dispatch({ type: "SET_ROLE", payload: "doctor" });
        if (activeToken) router.push(`/doctor/records?token=${activeToken.id}`);
        else router.push("/doctor");
      }
    },
    {
      label: "5. Prescribe (High Risk)",
      description: "Trigger AI safety alert",
      action: () => {
        const activeToken = state.consentTokens.find(t => new Date(t.expiresAt) > new Date());
        dispatch({ type: "SET_ROLE", payload: "doctor" });
        if (activeToken) router.push(`/doctor/prescription?token=${activeToken.id}`);
        else router.push("/doctor/prescription");
      }
    },
    {
      label: "6. Pharmacy Verify",
      description: "Look up & dispense prescription",
      action: () => {
        const rx = state.prescriptions.find(p => p.status === "ACTIVE");
        dispatch({ type: "SET_ROLE", payload: "pharmacy" });
        if (rx) router.push(`/pharmacy/verify?id=${rx.id}`);
        else router.push("/pharmacy");
      }
    },
    {
      label: "7. Audit Ledger",
      description: "View immutable event history",
      action: () => { dispatch({ type: "SET_ROLE", payload: "patient" }); router.push("/patient/audit"); }
    }
  ];

  const handleReset = () => {
    dispatch({ type: "RESET_DEMO" });
    router.push("/");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-[#050505] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'w-72' : 'w-auto'}`}>
        
        {isOpen && (
          <div className="animate-fade-in">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <span className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                <Zap size={14} className="text-primary" />
                Demo Scenarios
              </span>
            </div>
            
            <div className="py-2 max-h-80 overflow-y-auto">
              {scenarios.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { s.action(); setIsOpen(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-900 transition-colors group"
                >
                  <p className="text-white text-sm font-medium group-hover:text-primary transition-colors">{s.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.description}</p>
                </button>
              ))}
            </div>
            
            <div className="p-3 border-t border-gray-800">
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 text-danger hover:text-red-400 text-sm py-2 rounded-xl hover:bg-danger/10 transition-colors font-medium"
              >
                <RotateCcw size={14} />
                Reset Demo State
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-3 p-4 text-white hover:bg-gray-900 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-primary" />
            <span className="font-semibold text-sm">Demo Mode</span>
          </div>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};
