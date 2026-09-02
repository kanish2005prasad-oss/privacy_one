"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppState } from "../../context/AppStateContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Stethoscope, ShieldCheck, Search, AlertTriangle, CheckCircle2, History } from "lucide-react";

export default function PharmacyDashboard() {
  const { state, dispatch } = useAppState();
  const router = useRouter();
  const [rxInput, setRxInput] = useState("");

  // Ensure we are acting as pharmacy
  useEffect(() => {
    if (state.currentRole !== "pharmacy") {
      dispatch({ type: "SET_ROLE", payload: "pharmacy" });
    }
  }, [state.currentRole, dispatch]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (rxInput.trim()) {
      router.push(`/pharmacy/verify?id=${rxInput.trim()}`);
    }
  };

  const recentTransactions = [...state.pharmacyTransactions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

  return (
    <div className="flex-1 pb-24 bg-surface">
      {/* Hero */}
      <section className="bg-[#050505] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Verify before you<br />
              <span className="text-success">dispense.</span>
            </h1>
            <p className="text-xl text-gray-400 font-light leading-relaxed max-w-2xl">
              Every prescription carries a verifiable signature. Every dispense becomes part of the permanent record.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">
        
        {/* Verification UI */}
        <section className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-xl border-border/80">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success mb-4">
                <ShieldCheck size={24} />
              </div>
              <CardTitle className="text-2xl">Prescription Lookup</CardTitle>
              <CardDescription>Verify digital signature and patient identity before dispensing.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLookup} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="text-muted" size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Prescription ID (e.g. RX-2026-...)"
                    className="w-full pl-12 pr-4 py-4 bg-surface-elevated border border-border rounded-xl font-mono text-lg focus:ring-2 focus:ring-success outline-none transition-shadow"
                    value={rxInput}
                    onChange={(e) => setRxInput(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" fullWidth size="lg" className="bg-success hover:bg-green-600 shadow-success/20">
                  Verify Prescription
                </Button>
              </form>
              
              {/* For Demo Purposes, show active prescriptions */}
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Recent Active Prescriptions</h4>
                <div className="flex flex-wrap gap-2">
                  {state.prescriptions.filter(p => p.status === "ACTIVE").slice(0, 3).map(p => (
                    <button 
                      key={p.id}
                      onClick={() => setRxInput(p.id)}
                      className="px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-sm font-mono hover:border-success hover:text-success transition-colors"
                    >
                      {p.id}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4 border-b border-border">
                <div className="flex items-center gap-2 text-danger">
                  <AlertTriangle size={18} />
                  <CardTitle className="text-lg">Fraud Alerts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {state.fraudAlerts.length === 0 ? (
                  <div className="p-8 text-center text-muted">
                    <ShieldCheck size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No suspicious activities detected.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {state.fraudAlerts.map(alert => (
                      <div key={alert.id} className="p-4 flex items-start gap-4 hover:bg-surface-elevated/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                          <AlertTriangle size={16} className="text-danger" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-danger">BLOCKED</span>
                            <span className="text-xs font-mono bg-surface-elevated px-1.5 rounded">{alert.prescriptionId}</span>
                          </div>
                          <p className="text-sm text-foreground mb-1">{alert.reason}</p>
                          <span className="text-xs text-muted">
                            {new Date(alert.timestamp).toLocaleTimeString()} • {alert.location}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <History size={18} className="text-muted" />
                  <CardTitle className="text-lg">Recent Dispenses</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {recentTransactions.length === 0 ? (
                  <div className="p-8 text-center text-muted">
                    <p>No recent dispenses.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {recentTransactions.map(tx => (
                      <div key={tx.id} className="p-4 flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={16} className="text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-sm mb-0.5">Prescription Dispensed</p>
                          <p className="text-xs font-mono text-muted mb-1">{tx.prescriptionId}</p>
                          <span className="text-xs text-muted">
                            {new Date(tx.timestamp).toLocaleTimeString()} • {tx.location}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
