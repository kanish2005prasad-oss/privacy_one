import React, { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "dark";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    
    const baseStyles = "rounded-[28px] overflow-hidden transition-all duration-200";
    
    const variants = {
      default: "bg-surface border border-border/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]",
      elevated: "bg-surface shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border",
      dark: "bg-[#0A0A0A] border border-[#27272A] text-[#F9FAFB]",
    };
    
    const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;
    
    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = ({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 sm:p-8 pb-4 flex flex-col space-y-1.5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className = "", children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className = "", children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-muted ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 sm:p-8 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex items-center p-6 sm:p-8 pt-0 ${className}`} {...props}>
    {children}
  </div>
);
