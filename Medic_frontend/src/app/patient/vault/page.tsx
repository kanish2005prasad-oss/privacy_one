"use client";

import React, { useState } from "react";
import { useAppState } from "../../../context/AppStateContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { ShieldCheck, FileText, Pill, AlertTriangle, Activity, Stethoscope } from "lucide-react";
import { RecordCategory } from "../../../types/health-record";

export default function HealthVault() {
  const { state } = useAppState();
  const [activeTab, setActiveTab] = useState<RecordCategory | "all">("all");
  
  const records = state.healthRecords;
  
  const categories: { id: RecordCategory | "all", label: string, icon: React.ReactNode }[] = [
    { id: "all", label: "All Records", icon: <FileText size={16} /> },
    { id: "medications", label: "Medications", icon: <Pill size={16} /> },
    { id: "allergies", label: "Allergies", icon: <AlertTriangle size={16} /> },
    { id: "labs", label: "Lab Results", icon: <Activity size={16} /> },
    { id: "diagnoses", label: "Diagnoses", icon: <Stethoscope size={16} /> },
    { id: "clinical-notes", label: "Clinical Notes", icon: <FileText size={16} /> }
  ];

  const filteredRecords = activeTab === "all" ? records : records.filter(r => r.category === activeTab);

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

  return (
    <div className="flex-1 pb-24 bg-surface">
      <section className="bg-surface-elevated py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Health Vault</h1>
              <p className="text-muted">Your complete medical history, cryptographically secured.</p>
            </div>
            <div className="flex items-center gap-3 bg-surface border border-border px-4 py-2 rounded-xl shadow-sm">
              <ShieldCheck className="text-security" size={24} />
              <div>
                <p className="text-sm font-semibold">Vault Status</p>
                <p className="text-xs font-mono text-muted">SECURED • ECDSA P-256</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4 px-4">Categories</h3>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === cat.id 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "hover:bg-surface-elevated text-foreground"
              }`}
            >
              {cat.icon}
              {cat.label}
              <span className={`ml-auto text-xs ${activeTab === cat.id ? "text-white/80" : "text-muted"}`}>
                {cat.id === "all" ? records.length : records.filter(r => r.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {filteredRecords.map(record => (
            <Card key={record.id} className="hover:border-border/80 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="uppercase tracking-wider text-[10px] bg-surface-elevated">
                      {record.category.replace('-', ' ')}
                    </Badge>
                    <span className="text-xs text-muted font-mono">{record.date}</span>
                  </div>
                  {record.provider && (
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Stethoscope size={12} /> {record.provider}
                    </span>
                  )}
                </div>

                {record.category === "medications" && 'name' in record && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-bold">{record.name}</h3>
                      {getStatusBadge(record.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted block mb-1">Dose</span>
                        <p className="font-medium">{record.dose}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted block mb-1">Frequency</span>
                        <p className="font-medium">{record.frequency}</p>
                      </div>
                    </div>
                  </div>
                )}

                {record.category === "allergies" && 'name' in record && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-bold text-danger">{record.name}</h3>
                      {getStatusBadge(record.severity)}
                    </div>
                    <div>
                      <span className="text-xs text-muted block mb-1">Reaction</span>
                      <p className="font-medium text-danger">{record.reaction}</p>
                    </div>
                  </div>
                )}

                {record.category === "labs" && 'value' in record && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">{record.name}</h3>
                      {getStatusBadge(record.status)}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-light tracking-tight">{record.value}</span>
                      <span className="text-muted">{record.unit}</span>
                    </div>
                    <div className="bg-surface-elevated rounded-lg p-3 inline-block">
                      <span className="text-xs text-muted block mb-1">Reference Range</span>
                      <p className="text-sm font-mono">{record.referenceRange}</p>
                    </div>
                  </div>
                )}

                {record.category === "diagnoses" && 'condition' in record && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">{record.condition}</h3>
                      {getStatusBadge(record.status)}
                    </div>
                  </div>
                )}

                {record.category === "clinical-notes" && 'title' in record && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">{record.title}</h3>
                    <p className="text-muted leading-relaxed">{record.content}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-20 bg-surface-elevated rounded-3xl border border-border border-dashed">
              <FileText size={48} className="mx-auto text-muted mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-1">No records found</h3>
              <p className="text-muted">You have no records in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
