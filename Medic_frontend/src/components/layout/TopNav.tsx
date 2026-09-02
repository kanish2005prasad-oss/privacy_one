"use client";

import React from "react";
import Link from "next/link";
import { RoleSwitcher } from "./RoleSwitcher";
import { ShieldCheck } from "lucide-react";

export const TopNav = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center group-hover:bg-primary transition-colors">
              <ShieldCheck size={18} strokeWidth={2.5} />
            </div>
            <span className="font-bold tracking-widest text-sm text-foreground">
              PATIENT-SOVEREIGN
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
            <Link href="/patient" className="hover:text-foreground transition-colors">Patient</Link>
            <Link href="/doctor" className="hover:text-foreground transition-colors">Doctor</Link>
            <Link href="/pharmacy" className="hover:text-foreground transition-colors">Pharmacy</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
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
