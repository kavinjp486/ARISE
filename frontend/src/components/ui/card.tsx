import React from "react";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  children,
  className = "",
  bodyClassName = "",
  noPadding = false,
  ...props
}) => {
  const hasHeader = Boolean(title || headerAction);

  return (
    <div
      className={`bg-[#141D1C] border border-[#26332F] rounded-[14px] overflow-hidden flex flex-col ${className}`}
      {...props}
    >
      {hasHeader && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#26332F] bg-[#141D1C]">
          <div className="flex items-baseline gap-2.5">
            {typeof title === "string" ? (
              <h2 className="text-base font-semibold text-[#E6EDEB] tracking-tight">
                {title}
              </h2>
            ) : (
              title
            )}
            {subtitle && (
              <span className="text-xs text-[#8FA19C]">{subtitle}</span>
            )}
          </div>
          {headerAction && (
            <div className="flex items-center gap-2">{headerAction}</div>
          )}
        </div>
      )}
      <div className={`flex-1 ${noPadding ? "" : "p-5"} ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};
