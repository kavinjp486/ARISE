import React from "react";

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  className = "",
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={`relative flex items-center select-none ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-[#1B2625] rounded-full appearance-none cursor-pointer disabled:cursor-not-allowed focus:outline-none accent-[#4ADE80]"
      />
      {/* Visual track overlay for custom clean styling */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#4ADE80] rounded-full pointer-events-none"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
