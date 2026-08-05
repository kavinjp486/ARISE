import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
}

/** Reusable dashboard section wrapper — consistent header + card styling */
export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
  noPadding = false,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg shadow-black/20",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border/60 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className={cn(noPadding ? "flex-1" : "flex-1 p-5", contentClassName)}>
        {children}
      </div>
    </section>
  );
}
