import { ActivityLogPanel } from "@/components/dashboard/ActivityLogPanel";
import { RobotCanopyVisualizer } from "@/components/dashboard/RobotCanopyVisualizer";
import { RobotControls } from "@/components/dashboard/RobotControls";
import { RobotStatus } from "@/components/dashboard/RobotStatus";
import { Navbar } from "@/components/layout/Navbar";
import { useRobotControl } from "@/hooks/useRobotControl";
import { useTelemetry } from "@/hooks/useTelemetry";

interface ControlPageProps {
  onTabChange: (tab: "overview" | "controls") => void;
}

export function ControlPage({ onTabChange }: ControlPageProps) {
  const { status, logs, setLogs } = useTelemetry(1500);

  const { executeCommand, isExecuting, lastFeedback } = useRobotControl(
    (newLog) => {
      setLogs((prev) => [newLog, ...prev]);
    }
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
      <Navbar activeTab="controls" onTabChange={onTabChange} />

      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Feedback Status Alert */}
        {lastFeedback && (
          <div className="rounded-md bg-muted/40 border border-primary/20 p-2.5 px-4 text-xs font-mono text-primary flex justify-between items-center">
            <span>Status: {lastFeedback}</span>
            {isExecuting && (
              <span className="inline-block animate-pulse text-xs">
                Dispatching command to ESP32...
              </span>
            )}
          </div>
        )}

        {/* Live Animated Telemetry Visualizer (Compact View) */}
        <RobotCanopyVisualizer status={status} compact />

        {/* Main Remote Control & Telemetry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <RobotControls
              onCommand={executeCommand}
              currentMode={status?.mode || "manual"}
              isExecuting={isExecuting}
            />
          </div>

          <div className="lg:col-span-1 space-y-6">
            {status ? (
              <RobotStatus data={status} />
            ) : (
              <div className="h-64 rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
                Connecting telemetry...
              </div>
            )}
          </div>
        </div>

        {/* Activity Log Feed */}
        <ActivityLogPanel logs={logs} />
      </main>
    </div>
  );
}
