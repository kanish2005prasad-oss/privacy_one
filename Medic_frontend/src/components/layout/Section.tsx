import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "dark" | "surface" | "elevated";
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  variant = "default",
  id
}) => {
  const variantClasses = {
    default: "bg-background text-foreground",
    dark: "bg-[#050505] text-white",
    surface: "bg-surface text-foreground",
    elevated: "bg-surface-elevated text-foreground"
  };

  return (
    <section id={id} className={`py-16 md:py-24 ${variantClasses[variant]} ${className}`}>
      {children}
    </section>
  );
};
