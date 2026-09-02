"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowRight, User, Lock, Stethoscope, Pill, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Fetch user role to redirect appropriately
    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      const role = profile?.role || "patient";
      router.push(`/${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#0A0A0A] to-[#050505] border-r border-gray-800">
        <div className="flex items-center gap-3">
          <ShieldCheck size={32} className="text-primary" />
          <span className="text-xl font-bold text-white tracking-tight">MediTrust</span>
        </div>
        
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-green-400 uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Cryptographically Secured
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight mb-4">
              Your health data.<br />
              <span className="text-primary">Your sovereignty.</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              A patient-controlled healthcare trust network where every access is verified, every prescription is signed, and every transaction is auditable.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: User, color: "text-blue-400", bg: "bg-blue-400/10", title: "Patients", desc: "Control who sees your records with cryptographic consent" },
              { icon: Stethoscope, color: "text-purple-400", bg: "bg-purple-400/10", title: "Doctors", desc: "Access patient data only with explicit authorization" },
              { icon: Pill, color: "text-green-400", bg: "bg-green-400/10", title: "Pharmacies", desc: "Verify prescriptions and detect fraud in real-time" },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={20} className={color} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-xs">
          © 2026 MediTrust Network. All cryptographic operations performed client-side.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <ShieldCheck size={28} className="text-primary" />
            <span className="text-lg font-bold text-white">MediTrust</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-gray-400">Sign in to your secure medical account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
            >
              {loading ? (
                <><Loader2 size={20} className="animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Create account
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
            <Shield size={12} />
            <span>End-to-end encrypted • ECDSA-P256 signed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
