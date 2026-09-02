import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
  size = "default"
}) => {
  const sizeClasses = {
    narrow: "max-w-4xl",
    default: "max-w-6xl",
    wide: "max-w-7xl"
  };

  return (
    <div className={`container mx-auto px-4 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};
