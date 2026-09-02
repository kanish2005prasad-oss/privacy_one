"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppState } from "../../context/AppStateContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Stethoscope, ClipboardCheck, Lock, Activity, Users, FileText } from "lucide-react";

export default function DoctorDashboard() {
  const { state, dispatch } = useAppState();
  const router = useRouter();

  // Ensure we are acting as doctor
  useEffect(() => {
    if (state.currentRole !== "doctor") {
      dispatch({ type: "SET_ROLE", payload: "doctor" });
    }
  }, [state.currentRole, dispatch]);

  const activeTokens = state.consentTokens.filter(t => new Date(t.expiresAt) > new Date());
  
  return (
    <div className="flex-1 pb-24 bg-surface">
      {/* Hero */}
      <section className="bg-[#050505] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Clinical access,<br />
              <span className="text-primary">by consent.</span>
            </h1>
            <p className="text-xl text-gray-400 font-light leading-relaxed max-w-2xl">
              Request only the information you need. Patient authorization determines what becomes visible.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">
        
        {/* Quick Actions */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/doctor/request" className="block group">
            <Card className="h-full hover:border-primary transition-colors cursor-pointer group-hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ClipboardCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Request Access</h3>
                  <p className="text-sm text-muted">Build a consent request</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/doctor/records" className="block group">
            <Card className="h-full hover:border-primary transition-colors cursor-pointer group-hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-security/10 flex items-center justify-center text-security">
                  <Lock size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Patient Records</h3>
                  <p className="text-sm text-muted">View authorized data</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/doctor/prescription" className="block group">
            <Card className="h-full hover:border-primary transition-colors cursor-pointer group-hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-clinical/10 flex items-center justify-center text-clinical">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Write Prescription</h3>
                  <p className="text-sm text-muted">With AI safety checks</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <div className="block">
            <Card className="h-full border-dashed bg-transparent">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4 h-full">
                <div className="w-12 h-12 rounded-full bg-surface-elevated border flex items-center justify-center text-muted">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-muted">Patient Directory</h3>
                  <p className="text-sm text-muted">Select patient</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Active Consent Authorizations */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-6">Active Authorizations</h2>
          
          {activeTokens.length === 0 ? (
            <Card className="bg-surface-elevated border-dashed">
              <CardContent className="py-12 text-center">
                <FileText size={40} className="mx-auto text-muted mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active tokens</h3>
                <p className="text-muted mb-6">You currently do not have access to any patient vaults.</p>
                <Button onClick={() => router.push("/doctor/request")}>Request Access</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {activeTokens.map(token => {
                const patient = state.patients.find(p => p.id === token.patientId);
                const expiryDate = new Date(token.expiresAt);
                const minutesLeft = Math.max(0, Math.round((expiryDate.getTime() - new Date().getTime()) / 60000));
                
                return (
                  <Card key={token.id} className="border-security/20">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="success" className="bg-success/10 text-success">Active</Badge>
                        <span className={`text-sm font-semibold ${minutesLeft < 10 ? 'text-danger' : 'text-foreground'}`}>
                          {minutesLeft} min left
                        </span>
                      </div>
                      <CardTitle className="text-xl">{patient?.name || token.patientId}</CardTitle>
                      <CardDescription className="font-mono text-xs">{token.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-xs text-muted font-semibold uppercase tracking-wider block mb-1">Purpose</span>
                        <p className="text-sm">{token.clinicalPurpose}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => router.push(`/doctor/records?token=${token.id}`)}>
                          View Records
                        </Button>
                        <Button className="flex-1" variant="outline" onClick={() => router.push(`/doctor/prescription?token=${token.id}`)}>
                          Prescribe
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
