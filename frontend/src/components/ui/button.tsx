import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "secondary",
  size = "md",
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:ring-offset-2 focus:ring-offset-[#0E1514] disabled:opacity-40 disabled:cursor-not-allowed select-none";

  const sizeStyles = {
    sm: "h-7 px-2.5 text-xs rounded-[6px] gap-1.5",
    md: "h-9 px-3.5 text-sm rounded-[10px] gap-2",
    lg: "h-11 px-5 text-base rounded-[10px] gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#4ADE80] text-[#06210F] hover:bg-[#3ec470] active:bg-[#34aa61]",
    secondary:
      "bg-transparent border border-[#26332F] text-[#E6EDEB] hover:bg-[#1B2625] active:bg-[#141D1C]",
    danger:
      "bg-transparent border border-[#F5A524] text-[#F5A524] hover:bg-[#F5A524]/10 active:bg-[#F5A524]/20",
    ghost:
      "bg-transparent text-[#8FA19C] hover:text-[#E6EDEB] hover:bg-[#1B2625]",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
