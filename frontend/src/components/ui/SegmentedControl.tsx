import React from "react";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md";
  disabled?: boolean;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
  size = "md",
  disabled = false,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`inline-flex items-center bg-[#1B2625] border border-[#26332F] rounded-[8px] p-1 gap-1 select-none ${
        disabled ? "opacity-50 pointer-events-none" : ""
      } ${className}`}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`flex items-center justify-center font-medium transition-all duration-150 rounded-[6px] ${
              size === "sm"
                ? "h-7 px-2.5 text-xs gap-1.5"
                : "h-8 px-3 text-sm gap-2"
            } ${
              isSelected
                ? "bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/25 shadow-sm"
                : "text-[#8FA19C] hover:text-[#E6EDEB] border border-transparent"
            }`}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
