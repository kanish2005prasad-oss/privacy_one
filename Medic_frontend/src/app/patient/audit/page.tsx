"use client";

import React, { useState } from "react";
import { useAppState } from "../../../context/AppStateContext";
import { Card, CardContent } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Activity, ShieldCheck, KeyRound, Lock, Fingerprint, FileText, Pill, AlertTriangle, Stethoscope } from "lucide-react";
import { AuditEventType } from "../../../types/audit";

export default function AuditLedger() {
  const { state } = useAppState();
  
  // Sort events newest first
  const events = [...state.auditEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getEventIcon = (type: AuditEventType) => {
    switch (type) {
      case "IDENTITY_CREATED":
      case "VAULT_INITIALIZED":
        return <KeyRound size={20} className="text-security" />;
      case "ACCESS_REQUEST_CREATED":
      case "CONSENT_REVIEWED":
        return <UserCheckIcon size={20} className="text-primary" />;
      case "BIOMETRIC_AUTH":
        return <Fingerprint size={20} className="text-primary" />;
      case "CONSENT_TOKEN_GENERATED":
        return <ShieldCheck size={20} className="text-security" />;
      case "RECORDS_DECRYPTED":
        return <Lock size={20} className="text-warning" />;
      case "PRESCRIPTION_CREATED":
      case "PRESCRIPTION_ISSUED":
      case "OVERRIDE_SIGNED":
        return <Pill size={20} className="text-clinical" />;
      case "AI_RISK_ASSESSMENT":
        return <Activity size={20} className="text-clinical" />;
      case "PHARMACY_VERIFICATION":
      case "PRESCRIPTION_DISPENSED":
        return <Stethoscope size={20} className="text-success" />;
      case "FRAUD_ANALYSIS":
        return <AlertTriangle size={20} className="text-danger" />;
      default:
        return <FileText size={20} className="text-muted" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS": return <Badge variant="success">Success</Badge>;
      case "BLOCKED": return <Badge variant="danger">Blocked</Badge>;
      case "WARNING": return <Badge variant="warning">Warning</Badge>;
      default: return <Badge variant="outline">Info</Badge>;
    }
  };

  return (
    <div className="flex-1 bg-[#050505] text-white min-h-screen pb-24">
      <section className="py-16 border-b border-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Immutable Audit Ledger</h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl">
            Every important action leaves a cryptographically verifiable trail.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="relative border-l border-gray-800 ml-6 md:ml-8 space-y-12">
          {events.length === 0 ? (
            <div className="pl-12 text-gray-500">No events recorded yet.</div>
          ) : (
            events.map((event, index) => {
              const date = new Date(event.timestamp);
              const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              const dateString = date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
              
              return (
                <div key={event.id} className="relative pl-12 md:pl-16 group animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  {/* Timeline Node */}
                  <div className="absolute -left-6 top-0 w-12 h-12 rounded-full bg-[#0A0A0A] border-2 border-gray-800 flex items-center justify-center group-hover:border-gray-600 transition-colors z-10">
                    {getEventIcon(event.eventType)}
                  </div>
                  
                  {/* Content Card */}
                  <Card className="bg-[#0A0A0A] border-gray-800 hover:border-gray-700 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-semibold text-gray-300">{event.actor}</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-sm text-gray-400 font-mono">{timeString} — {dateString}</span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-1">{event.eventType.replace(/_/g, ' ')}</h3>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          {getStatusBadge(event.status)}
                          <span className="text-xs font-mono text-gray-600 bg-gray-900 px-2 py-1 rounded">{event.id}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 leading-relaxed mb-4">{event.description}</p>
                      
                      {event.referenceId && (
                        <div className="pt-4 border-t border-gray-800 flex items-center gap-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Reference</span>
                          <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{event.referenceId}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// Inline UserCheckIcon since it wasn't imported at top
const UserCheckIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>
  </svg>
);
