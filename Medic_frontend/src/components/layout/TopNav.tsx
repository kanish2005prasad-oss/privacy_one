"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleSwitcher } from "./RoleSwitcher";
import { ShieldCheck, User, Stethoscope, Pill, ArrowLeftRight } from "lucide-react";

export const TopNav = () => {
  const pathname = usePathname();

  const isPatient = pathname.startsWith("/patient");
  const isDoctor = pathname.startsWith("/doctor");
  const isPharmacy = pathname.startsWith("/pharmacy");

  const getNavLinks = () => {
    if (isPatient) {
      return [
        { href: "/patient", label: "Dashboard", exact: true },
        { href: "/patient/vault", label: "Health Vault" },
        { href: "/patient/consent", label: "Consent Control" },
        { href: "/patient/audit", label: "Audit Ledger" },
      ];
    }
    if (isDoctor) {
      return [
        { href: "/doctor", label: "Dashboard", exact: true },
        { href: "/doctor/request", label: "Request Access" },
        { href: "/doctor/records", label: "Patient Records" },
        { href: "/doctor/prescription", label: "Write Prescription" },
      ];
    }
    if (isPharmacy) {
      return [
        { href: "/pharmacy", label: "Dashboard", exact: true },
        { href: "/pharmacy/verify", label: "Verify & Dispense" },
      ];
    }
    return [
      { href: "/patient", label: "Patient Portal" },
      { href: "/doctor", label: "Doctor Portal" },
      { href: "/pharmacy", label: "Pharmacy Portal" },
    ];
  };

  const navLinks = getNavLinks();

  const getPortalBadge = () => {
    if (isPatient) {
      return (
        <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          <User size={12} /> Patient
        </span>
      );
    }
    if (isDoctor) {
      return (
        <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Stethoscope size={12} /> Doctor
        </span>
      );
    }
    if (isPharmacy) {
      return (
        <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Pill size={12} /> Pharmacy
        </span>
      );
    }
    return null;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ShieldCheck size={18} strokeWidth={2.5} />
            </div>
            <span className="font-bold tracking-widest text-sm text-foreground">
              PATIENT-SOVEREIGN
            </span>
          </Link>

          {getPortalBadge()}
          
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => {
              const isDashboard = link.href === "/patient" || link.href === "/doctor" || link.href === "/pharmacy";
              const isActive = isDashboard 
                ? pathname === link.href 
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "text-foreground font-semibold bg-surface-elevated border border-border"
                      : "text-muted hover:text-foreground hover:bg-surface-elevated/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {(isPatient || isDoctor || isPharmacy) && (
            <Link 
              href="/" 
              className="hidden lg:flex items-center gap-1.5 text-xs text-muted hover:text-foreground px-2.5 py-1 rounded-md hover:bg-surface-elevated transition-colors"
              title="Switch Portal"
            >
              <ArrowLeftRight size={13} />
              <span>Switch Portal</span>
            </Link>
          )}

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
            System Active
          </div>
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
};
