"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export const RoleSwitcher = () => {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return <div className="h-9 w-24 bg-surface-elevated animate-pulse rounded-lg"></div>;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors">
          <LogIn size={14} />
          <span>Login</span>
        </Link>
        <Link href="/auth/signup" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <UserPlus size={14} />
          <span>Sign up</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface-elevated border border-border rounded-lg">
        <User size={14} className="text-primary" />
        <span className="text-sm font-medium text-foreground">
          {profile?.full_name || user.email}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize ml-2 border border-primary/20">
          {profile?.role || "User"}
        </span>
      </div>
      
      <button 
        onClick={handleSignOut}
        className="flex items-center justify-center p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors border border-transparent hover:border-danger/20"
        title="Sign Out"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
};
