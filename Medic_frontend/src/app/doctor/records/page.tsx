"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppState } from "../../../context/AppStateContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Lock, Unlock, ShieldCheck, FileText, Pill, AlertTriangle, Activity, Stethoscope } from "lucide-react";
import { RecordCategory, HealthRecord } from "../../../types/health-record";
import { ConsentToken } from "../../../types/consent";

function AuthorizedRecordsContent() {
  const { state } = useAppState();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenId = searchParams?.get("token");
  
  const [token, setToken] = useState<ConsentToken | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decrypted, setDecrypted] = useState(false);
  
  useEffect(() => {
    if (tokenId) {
      const foundToken = state.consentTokens.find(t => t.id === tokenId);
      if (foundToken) {
        setToken(foundToken);
        const expiry = new Date(foundToken.expiresAt);
        if (expiry > new Date()) {
          setIsValid(true);
          // Simulate decryption delay
          setIsDecrypting(true);
          setTimeout(() => {
            setIsDecrypting(false);
            setDecrypted(true);
          }, 2000);
        }
      }
    }
  }, [tokenId, state.consentTokens]);

  const patient = token ? state.patients.find(p => p.id === token.patientId) : state.patients[0];
  const records = state.healthRecords;

  const isAuthorized = (category: RecordCategory) => {
    if (!token || !isValid || !decrypted) return false;
    return token.authorizedCategories.includes(category);
  };

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active':
      case 'normal':
        return <Badge variant="success">{status}</Badge>;
      case 'high':
      case 'severe':
        return <Badge variant="danger">{status}</Badge>;
      case 'low':
        return <Badge variant="warning">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderRecord = (record: HealthRecord) => {
    const authorized = isAuthorized(record.category);
    
    return (
      <Card key={record.id} className={`overflow-hidden transition-all duration-500 ${authorized ? 'border-primary/30 shadow-sm' : 'border-border'}`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="uppercase tracking-wider text-[10px] bg-surface-elevated">
                {record.category.replace('-', ' ')}
              </Badge>
              {authorized && <span className="text-xs text-muted font-mono">{record.date}</span>}
            </div>
            {authorized ? (
              <Unlock size={16} className="text-primary" />
            ) : (
              <Lock size={16} className="text-muted" />
            )}
          </div>

          <div className="relative">
            {!authorized && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface/40 rounded-lg">
                <Lock size={32} className="text-muted mb-2" />
                <p className="text-sm font-semibold text-foreground">LOCKED</p>
                <p className="text-xs text-muted">Not authorized for this request</p>
              </div>
            )}
            
            <div className={`space-y-4 ${authorized ? '' : 'blur-encrypted'}`}>
              {/* Common obfuscation wrapper for unauthorized state to prevent layout jumps */}
              <div className="min-h-[80px]">
                {record.category === "medications" && 'name' in record && (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold">{authorized ? record.name : "██████████"}</h3>
                      {authorized && getStatusBadge(record.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted block mb-1">Dose</span>
                        <p className="font-medium">{authorized ? record.dose : "████"}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted block mb-1">Frequency</span>
                        <p className="font-medium">{authorized ? record.frequency : "███████"}</p>
                      </div>
                    </div>
                  </>
                )}

                {record.category === "allergies" && 'name' in record && (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-danger">{authorized ? record.name : "███████"}</h3>
                      {authorized && getStatusBadge(record.severity)}
                    </div>
                    <div>
                      <span className="text-xs text-muted block mb-1">Reaction</span>
                      <p className="font-medium text-danger">{authorized ? record.reaction : "████████████"}</p>
                    </div>
                  </>
                )}

                {record.category === "labs" && 'value' in record && (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{authorized ? record.name : "██████"}</h3>
                      {authorized && getStatusBadge(record.status)}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-light tracking-tight">{authorized ? record.value : "██.█"}</span>
                      {authorized && <span className="text-muted">{record.unit}</span>}
                    </div>
                  </>
                )}

                {record.category === "diagnoses" && 'condition' in record && (
                  <>
                    <h3 className="text-xl font-bold mb-4">{authorized ? record.condition : "████████████████"}</h3>
                    {authorized && getStatusBadge(record.status)}
                  </>
                )}

                {record.category === "clinical-notes" && 'title' in record && (
                  <>
                    <h3 className="text-xl font-bold mb-2">{authorized ? record.title : "████████████"}</h3>
                    <p className="text-muted leading-relaxed">
                      {authorized ? record.content : "██████████████████████████████████████████████████████████████████████"}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex-1 pb-24 bg-surface">
      <section className="bg-[#050505] text-white py-12 border-b border-gray-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white" onClick={() => router.push("/doctor")}>
                &larr; Back
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Authorized Records</h1>
            </div>
            {patient && <p className="text-xl text-gray-400">Patient: <span className="text-white font-medium">{patient.name}</span></p>}
          </div>
          
          <div className="bg-[#0A0A0A] border border-gray-800 rounded-2xl p-4 flex items-center gap-4 min-w-[300px]">
            {!token ? (
              <div className="flex items-center gap-3 w-full">
                <Lock className="text-gray-500" size={24} />
                <div>
                  <p className="font-semibold">No Token Active</p>
                  <p className="text-xs text-gray-500">Patient data remains encrypted.</p>
                </div>
              </div>
            ) : !isValid ? (
              <div className="flex items-center gap-3 w-full">
                <AlertTriangle className="text-danger" size={24} />
                <div>
                  <p className="font-semibold text-danger">Token Expired</p>
                  <p className="text-xs text-gray-500">Request a new authorization.</p>
                </div>
              </div>
            ) : isDecrypting ? (
              <div className="flex items-center gap-4 w-full">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 border-2 border-gray-800 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-primary rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div>
                  <p className="font-semibold text-primary animate-pulse">Decrypting authorized fields...</p>
                  <p className="text-xs text-gray-400 font-mono">{token.id}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 w-full">
                <ShieldCheck className="text-primary" size={28} />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-primary">Consent Verified</p>
                    <span className="text-xs text-gray-400 bg-gray-900 px-2 rounded font-mono">{token.id.split('-')[1]}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    <span className="text-white">{token.authorizedCategories.length}</span> categories unlocked
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map(renderRecord)}
        </div>
      </div>
    </div>
  );
}

export default function AuthorizedRecords() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AuthorizedRecordsContent />
    </Suspense>
  );
}
