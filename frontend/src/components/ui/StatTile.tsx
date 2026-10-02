import React from "react";

export interface StatTileProps {
  label: string;
  value: string | number;
  subValue?: string;
  statusDot?: "accent" | "alert" | "neutral" | null;
  progressPercent?: number;
  className?: string;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  subValue,
  statusDot = null,
  progressPercent,
  className = "",
}) => {
  const dotColors = {
    accent: "bg-[#4ADE80]",
    alert: "bg-[#F5A524]",
    neutral: "bg-[#8FA19C]",
  };

  return (
    <div
      className={`bg-[#141D1C] border border-[#26332F] rounded-[10px] p-3.5 flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between text-[#8FA19C]">
        <span className="text-[11px] font-medium tracking-wider uppercase">
          {label}
        </span>
        {statusDot && (
          <span
            className={`w-1.5 h-1.5 rounded-full ${dotColors[statusDot]}`}
          />
        )}
      </div>

      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="font-mono text-[16px] font-semibold text-[#E6EDEB] tracking-tight tabular-nums">
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-[#8FA19C] font-mono">{subValue}</span>
        )}
      </div>

      {typeof progressPercent === "number" && (
        <div className="mt-2.5 w-full bg-[#1B2625] h-1 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              progressPercent > 20 ? "bg-[#4ADE80]" : "bg-[#F5A524]"
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      )}
    </div>
  );
};
