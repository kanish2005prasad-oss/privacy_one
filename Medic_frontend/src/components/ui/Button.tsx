import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", fullWidth = false, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-sm",
      secondary: "bg-surface-elevated text-foreground hover:bg-border focus:ring-border shadow-sm border border-border",
      danger: "bg-danger text-white hover:bg-red-600 focus:ring-danger shadow-sm",
      ghost: "bg-transparent text-muted hover:text-foreground hover:bg-surface-elevated",
      outline: "bg-transparent text-foreground border border-border hover:border-foreground focus:ring-border",
    };
    
    const sizes = {
      sm: "h-8 px-4 text-xs",
      md: "h-10 px-6 text-sm",
      lg: "h-12 px-8 text-base",
    };
    
    const widthClass = fullWidth ? "w-full" : "";
    
    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;
    
    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
