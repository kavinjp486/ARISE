import type { ReactNode } from "react";

interface DashboardLayoutProps {
  navbar: ReactNode;
  stats: ReactNode;
  camera: ReactNode;
  prediction: ReactNode;
  controls: ReactNode;
  status: ReactNode;
  activityLog: ReactNode;
}

export function DashboardLayout({
  navbar,
  stats,
  camera,
  prediction,
  controls,
  status,
  activityLog,
}: DashboardLayoutProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-4 p-4 md:p-6">
      {navbar}

      {/* KPI row */}
      {stats}

      {/* Main dashboard grid */}
      <div className="grid flex-1 grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Left column — camera + controls */}
        <div className="flex flex-col gap-4 xl:col-span-8">
          <div className="min-h-[320px] xl:min-h-[420px]">{camera}</div>
          <div className="min-h-[220px]">{controls}</div>
        </div>

        {/* Right column — AI, status, log */}
        <div className="flex flex-col gap-4 xl:col-span-4">
          <div className="min-h-[200px]">{prediction}</div>
          <div className="min-h-[180px]">{status}</div>
          <div className="min-h-[260px] flex-1">{activityLog}</div>
        </div>
      </div>
    </div>
  );
}
