"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppState } from "../../context/AppStateContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ShieldCheck, Clock, CheckCircle2, AlertTriangle, FileText, Activity, Lock as LockIcon } from "lucide-react";

export default function PatientDashboard() {
  const { state, dispatch } = useAppState();
  const router = useRouter();
  
  // Ensure we are acting as patient
  useEffect(() => {
    if (state.currentRole !== "patient") {
      dispatch({ type: "SET_ROLE", payload: "patient" });
    }
  }, [state.currentRole, dispatch]);

  const patient = state.patients[0];
  const pendingRequests = state.accessRequests.filter(r => r.status === "pending");
  const activeTokens = state.consentTokens.filter(t => new Date(t.expiresAt) > new Date());
  const recentEvents = state.auditEvents.slice(0, 5);

  if (!patient?.vaultEnabled) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="max-w-md text-center p-8">
          <ShieldCheck size={48} className="mx-auto text-muted mb-6" />
          <h2 className="text-2xl font-bold mb-2">Vault Not Initialized</h2>
          <p className="text-muted mb-8">You need to set up your cryptographic identity and health vault before accessing the dashboard.</p>
          <Button onClick={() => router.push("/onboarding")} fullWidth>Begin Onboarding</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-24">
      {/* Hero */}
      <section className="bg-surface-elevated py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Your health data.<br />
              <span className="text-primary">Your decision.</span>
            </h1>
            <p className="text-xl text-muted font-light leading-relaxed max-w-2xl">
              Review every request. Approve exactly what is needed. Nothing more.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Vault Status & Quick Links */}
        <section className="grid md:grid-cols-3 gap-6">
          <Link href="/patient/vault" className="block group">
            <Card className="h-full hover:border-primary transition-colors cursor-pointer group-hover:shadow-md">
              <CardContent className="p-8 flex items-start gap-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">Health Vault</h3>
                  <p className="text-muted text-sm">View your encrypted records and storage status.</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-success">
                    <span className="w-2 h-2 rounded-full bg-success"></span>
                    Encrypted & Active
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/patient/audit" className="block group md:col-span-2">
            <Card className="h-full hover:border-foreground transition-colors cursor-pointer group-hover:shadow-md bg-[#0A0A0A] text-white border-gray-800">
              <CardContent className="p-8 flex items-start gap-6 h-full">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Activity size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Audit Ledger</h3>
                      <p className="text-gray-400 text-sm">Immutable history of all system events.</p>
                    </div>
                    <Badge variant="outline" className="border-gray-700 text-gray-300 bg-transparent">{state.auditEvents.length} Events</Badge>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    {recentEvents.slice(0,2).map(event => (
                      <div key={event.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-800 last:border-0">
                        <span className="text-gray-300">{event.description}</span>
                        <span className="text-gray-500 text-xs">{new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Pending Requests */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Pending Authorization</h2>
            <Badge variant="warning">{pendingRequests.length} Pending</Badge>
          </div>
          
          {pendingRequests.length === 0 ? (
            <Card className="bg-surface-elevated border-dashed">
              <CardContent className="py-16 text-center">
                <CheckCircle2 size={48} className="mx-auto text-muted mb-4" />
                <h3 className="text-xl font-semibold mb-2">No pending requests</h3>
                <p className="text-muted">You have responded to all data access requests.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pendingRequests.map(request => (
                <Card key={request.id} className="border-warning/30 shadow-lg shadow-warning/5 flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="warning" className="bg-warning/20">New Request</Badge>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <Clock size={12} /> {Math.round((new Date().getTime() - new Date(request.requestedAt).getTime()) / 60000)}m ago
                      </span>
                    </div>
                    <CardTitle className="text-xl">{request.requesterName}</CardTitle>
                    <CardDescription>{request.requesterOrganization}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1">Purpose</span>
                      <p className="text-sm font-medium">{request.clinicalPurpose}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Requested Fields</span>
                      <div className="flex flex-wrap gap-2">
                        {request.requestedCategories.map(cat => (
                          <Badge key={cat} variant="outline" className="capitalize">{cat.replace('-', ' ')}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                    <Button fullWidth onClick={() => router.push(`/patient/consent?id=${request.id}`)}>
                      Review Request
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Active Consent Tokens */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-8">Active Authorizations</h2>
          
          {activeTokens.length === 0 ? (
            <Card className="bg-surface-elevated border-dashed">
              <CardContent className="py-12 text-center">
                <LockIcon size={40} className="mx-auto text-muted mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active tokens</h3>
                <p className="text-muted">No external parties currently have access to your vault.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeTokens.map(token => {
                const request = state.accessRequests.find(r => r.id === token.requestId);
                const expiryDate = new Date(token.expiresAt);
                const minutesLeft = Math.max(0, Math.round((expiryDate.getTime() - new Date().getTime()) / 60000));
                
                return (
                  <Card key={token.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-security/10 flex items-center justify-center text-security shrink-0">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold">{request?.requesterName || "Authorized Party"}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm font-medium font-mono text-muted bg-surface-elevated px-2 py-0.5 rounded">{token.id.substring(0, 13)}...</span>
                            <span className="text-sm text-muted capitalize">{token.authorizedCategories.length} categories authorized</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="text-right flex-1 md:flex-none">
                          <span className="text-xs text-muted block mb-1">Expires in</span>
                          <span className={`font-semibold ${minutesLeft < 10 ? 'text-danger' : 'text-foreground'}`}>
                            {minutesLeft} minutes
                          </span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/patient/audit?ref=${token.id}`)}>
                          View Audit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
