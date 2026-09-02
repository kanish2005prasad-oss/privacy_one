import React, { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "clinical" | "security" | "outline";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
    
    const variants = {
      default: "bg-surface-elevated text-foreground border border-border",
      success: "bg-success/10 text-success border border-success/20",
      warning: "bg-warning/10 text-warning-dark border border-warning/20",
      danger: "bg-danger/10 text-danger border border-danger/20",
      clinical: "bg-clinical/10 text-clinical border border-clinical/20",
      security: "bg-security/10 text-security border border-security/20",
      outline: "text-foreground border border-border",
    };
    
    // Add custom dark variants for specific colors to ensure good contrast
    const warningDarkAdjustment = variant === 'warning' ? 'text-[#D97706]' : '';
    
    const combinedClassName = `${baseStyles} ${variants[variant]} ${warningDarkAdjustment} ${className}`;
    
    return (
      <span ref={ref} className={combinedClassName} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
