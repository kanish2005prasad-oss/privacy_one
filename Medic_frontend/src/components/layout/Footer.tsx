import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-[#050505] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center">
                <ShieldCheck size={18} strokeWidth={2.5} />
              </div>
              <span className="font-bold tracking-widest text-sm text-white">
                PATIENT-SOVEREIGN
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Privacy-first healthcare infrastructure uniting cryptographic consent, AI clinical safety, and signature-verified prescriptions.
            </p>
            <div className="pt-2 text-xs font-mono text-gray-500">
              ECDSA P-256 Verified Network • 24hr Hackathon Prototype
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Workflows</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/onboarding" className="hover:text-white transition-colors">
                  Patient Identity & Vault
                </Link>
              </li>
              <li>
                <Link href="/patient" className="hover:text-white transition-colors">
                  Consent Management
                </Link>
              </li>
              <li>
                <Link href="/doctor" className="hover:text-white transition-colors">
                  Clinical Intelligence
                </Link>
              </li>
              <li>
                <Link href="/pharmacy" className="hover:text-white transition-colors">
                  Pharmacy Dispensing
                </Link>
              </li>
              <li>
                <Link href="/patient/audit" className="hover:text-white transition-colors">
                  Audit Ledger
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Security Architecture</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-security"></span>
                <span>Scoped Token Grants</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-clinical"></span>
                <span>AI Clinical Validation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
                <span>Physician Overrides</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                <span>Double-Spend Prevention</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 PATIENT-SOVEREIGN Network. Built for privacy-first healthcare.</p>
          <p className="font-mono">Frontend Simulation Mode • LocalState Enabled</p>
        </div>
      </div>
    </footer>
  );
};
