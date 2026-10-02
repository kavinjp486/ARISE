import React from "react";

export type PillVariant = "accent" | "alert" | "neutral";

export interface StatusPillProps {
  label: string;
  variant?: PillVariant;
  pulse?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  label,
  variant = "accent",
  pulse = false,
  className = "",
  icon,
}) => {
  const variantStyles = {
    accent: "bg-[#4ADE80]/12 text-[#4ADE80] border border-[#4ADE80]/20",
    alert: "bg-[#F5A524]/12 text-[#F5A524] border border-[#F5A524]/20",
    neutral: "bg-[#1B2625] text-[#8FA19C] border border-[#26332F]",
  };

  const dotColors = {
    accent: "bg-[#4ADE80]",
    alert: "bg-[#F5A524]",
    neutral: "bg-[#8FA19C]",
  };

  return (
    <span
      className={`inline-flex items-center h-[22px] px-2 rounded-full text-xs font-medium tracking-tight gap-1.5 select-none ${variantStyles[variant]} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]} ${
          pulse ? "animate-pulse-dot" : ""
        }`}
      />
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};
