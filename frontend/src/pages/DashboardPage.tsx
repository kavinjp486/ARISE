import { AIPredictionPanel } from "@/components/dashboard/AIPredictionPanel";
import { ActivityLogPanel } from "@/components/dashboard/ActivityLogPanel";
import { LiveCameraFeed } from "@/components/dashboard/LiveCameraFeed";
import { RobotControls } from "@/components/dashboard/RobotControls";
import { RobotStatus } from "@/components/dashboard/RobotStatus";
import { StatisticsCards } from "@/components/dashboard/StatisticsCards";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Navbar } from "@/components/layout/Navbar";
import { useRobotControl } from "@/hooks/useRobotControl";
import { useTelemetry } from "@/hooks/useTelemetry";
import { PLACEHOLDER_CAMERA, PLACEHOLDER_STATS } from "@/utils/placeholderData";

export function DashboardPage() {
  const { status, prediction, logs, isLoading, setLogs } = useTelemetry(2000);

  const { executeCommand, isExecuting, lastFeedback } = useRobotControl((newLog) => {
    setLogs((prev) => [newLog, ...prev]);
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
      <Navbar />

      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Feedback Banner */}
        {lastFeedback && (
          <div className="rounded-md bg-muted/40 border border-primary/20 p-2.5 px-4 text-xs font-mono text-primary flex justify-between items-center">
            <span>Status: {lastFeedback}</span>
            {isExecuting && (
              <span className="inline-block animate-pulse text-xs">Processing...</span>
            )}
          </div>
        )}

        {/* Top Key Statistics Row */}
        <StatisticsCards stats={PLACEHOLDER_STATS} />

        {/* Middle Main Section: Camera & Robot Telemetry Status */}
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

        {/* AI Inference & Activity Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prediction && <AIPredictionPanel data={prediction} />}
          <ActivityLogPanel logs={logs} />
        </div>

        {/* Interactive Remote Controls */}
        <RobotControls
          onCommand={executeCommand}
          currentMode={status?.mode || "manual"}
          isExecuting={isExecuting}
        />
      </main>
    </div>
  );
}
