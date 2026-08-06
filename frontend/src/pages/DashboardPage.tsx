import { AIPredictionPanel } from "@/components/dashboard/AIPredictionPanel";
import { ActivityLogPanel } from "@/components/dashboard/ActivityLogPanel";
import { LiveCameraFeed } from "@/components/dashboard/LiveCameraFeed";
import { RobotCanopyVisualizer } from "@/components/dashboard/RobotCanopyVisualizer";
import { RobotStatus } from "@/components/dashboard/RobotStatus";
import { StatisticsCards } from "@/components/dashboard/StatisticsCards";
import { Navbar } from "@/components/layout/Navbar";
import { useTelemetry } from "@/hooks/useTelemetry";
import { PLACEHOLDER_CAMERA, PLACEHOLDER_STATS } from "@/utils/placeholderData";

interface DashboardPageProps {
  onTabChange: (tab: "overview" | "controls") => void;
}

export function DashboardPage({ onTabChange }: DashboardPageProps) {
  const { status, prediction, logs } = useTelemetry(2000);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
      <Navbar activeTab="overview" onTabChange={onTabChange} />

      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Top Key Statistics Row */}
        <StatisticsCards stats={PLACEHOLDER_STATS} />

        {/* LIVE ANIMATED ROBOT DEPICTION CANVAS */}
        <RobotCanopyVisualizer status={status} />

        {/* Camera Feed & Telemetry Status Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LiveCameraFeed data={PLACEHOLDER_CAMERA} />
          </div>
          <div className="lg:col-span-1">
            {status ? (
              <RobotStatus data={status} />
            ) : (
              <div className="h-64 rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
                Loading telemetry...
              </div>
            )}
          </div>
        </div>

        {/* AI Vision Inference & System Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prediction && <AIPredictionPanel data={prediction} />}
          <ActivityLogPanel logs={logs} />
        </div>
      </main>
    </div>
  );
}
