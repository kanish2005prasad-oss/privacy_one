"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowRight, User, Lock, Mail, Building2, BadgeCheck, ChevronDown } from "lucide-react";

const ROLES = [
  { value: "patient", label: "Patient", desc: "Manage your health records & consent" },
  { value: "doctor", label: "Doctor / Hospital Staff", desc: "Request access & write prescriptions" },
  { value: "pharmacy", label: "Pharmacist", desc: "Verify prescriptions & detect fraud" },
  { value: "insurance", label: "Insurance Verifier", desc: "Verify claims & monitor anomalies" },
];

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "patient",
    organization: "",
    licenseNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const selectedRole = ROLES.find(r => r.value === form.role);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          role: form.role,
          organization: form.organization,
          license_number: form.licenseNumber,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Update additional profile fields
      await supabase.from("profiles").update({
        organization: form.organization,
        license_number: form.licenseNumber,
      }).eq("id", data.user.id);

      // Redirect to appropriate dashboard
      if (form.role === "patient") {
        router.push("/onboarding");
      } else {
        router.push(`/${form.role}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-10">
          <ShieldCheck size={28} className="text-primary" />
          <span className="text-lg font-bold text-white">MediTrust</span>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
          <p className="text-gray-400">Join the patient-sovereign healthcare network</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? "bg-primary text-white" : "bg-white/10 text-gray-500"
              }`}>
                {s}
              </div>
              {s < 2 && <div className={`w-12 h-0.5 transition-all ${step > s ? "bg-primary" : "bg-white/10"}`} />}
            </div>
          ))}
          <span className="text-xs text-gray-500 ml-2">{step === 1 ? "Choose your role" : "Account details"}</span>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 mb-4">How will you use MediTrust?</p>
            {ROLES.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, role: role.value }))}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-4 ${
                  form.role === role.value
                    ? "border-primary/60 bg-primary/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all ${
                  form.role === role.value ? "border-primary" : "border-gray-600"
                }`}>
                  {form.role === role.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <div>
                  <p className="text-white font-semibold">{role.label}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{role.desc}</p>
                </div>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full mt-2 py-4 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
            >
              Continue as {selectedRole?.label} <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm(f => ({ ...f, fullName: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  placeholder="Dr. Arun Kumar"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
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
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {form.role !== "patient" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Organization / Hospital</label>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={form.organization}
                      onChange={(e) => setForm(f => ({ ...f, organization: e.target.value }))}
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                      placeholder="ABC Hospital"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">License / Registration Number</label>
                  <div className="relative">
                    <BadgeCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={form.licenseNumber}
                      onChange={(e) => setForm(f => ({ ...f, licenseNumber: e.target.value }))}
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                      placeholder="MCI-2026-XXXXX"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="px-6 py-4 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all">
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/25"
              >
                {loading ? <><Loader2 size={20} className="animate-spin" /> Creating...</> : <>Create Account <ArrowRight size={18} /></>}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
