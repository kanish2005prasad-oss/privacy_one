"use client";

import React from "react";
import { useAppState } from "../../context/AppStateContext";
import { UserRole } from "../../types/patient";
import { useRouter, usePathname } from "next/navigation";

export const RoleSwitcher = () => {
  const { state, dispatch } = useAppState();
  const router = useRouter();
  const pathname = usePathname();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    dispatch({ type: "SET_ROLE", payload: newRole });
    
    // Auto-navigate to respective dashboard if on landing page or switching roles
    if (pathname === "/" || pathname?.startsWith("/patient") || pathname?.startsWith("/doctor") || pathname?.startsWith("/pharmacy")) {
      if (newRole === "patient") router.push("/patient");
      else if (newRole === "doctor") router.push("/doctor");
      else if (newRole === "pharmacy") router.push("/pharmacy");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={state.currentRole}
        onChange={handleRoleChange}
        className="bg-surface-elevated border border-border text-foreground text-xs sm:text-sm rounded-lg focus:ring-primary focus:border-primary block py-2 px-3 outline-none appearance-none cursor-pointer pr-8 font-medium hover:border-foreground/30 transition-colors"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.7rem top 50%',
          backgroundSize: '0.65rem auto',
        }}
        aria-label="Switch User Role"
      >
        <option value="patient">Patient Role</option>
        <option value="doctor">Doctor Role</option>
        <option value="pharmacy">Pharmacy Role</option>
      </select>
    </div>
  );
};
