import { useState } from "react";
import { AerialViewPanel } from "./AerialViewPanel";
import { RobotVisionHUD } from "./RobotVisionHUD";
import { SideViewPanel } from "./SideViewPanel";
import { TacticalHeader } from "./TacticalHeader";
import type { DigitalTwinMode } from "./TacticalHeader";
import { TelemetryPhysicsPanel } from "./TelemetryPhysicsPanel";

export function DigitalTwinDashboard() {
  const [mode, setMode] = useState<DigitalTwinMode>("autonomous");
  const [isRunning, setIsRunning] = useState(true);
  const [battery] = useState(88);
  const [cableTensionAvg] = useState(142);
  const [wifiLatencyMs] = useState(12);

  return (
    <div className="min-h-screen bg-[#04080F] text-white flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Omniverse Tactical HUD Header */}
      <TacticalHeader
        mode={mode}
        onModeChange={setMode}
        isRunning={isRunning}
        onToggleRun={() => setIsRunning(!isRunning)}
        battery={battery}
        cableTensionAvg={cableTensionAvg}
        wifiLatencyMs={wifiLatencyMs}
      />

      {/* Main Omniverse 2x2 Synchronized Quad-Viewport Layout */}
      <main className="flex-1 p-3 md:p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-[1800px] w-full mx-auto">
        {/* VIEWPORT A: Top-Down Aerial View */}
        <div className="w-full h-full min-h-[440px]">
          <AerialViewPanel />
        </div>

        {/* VIEWPORT B: Side Physics & Elevation Mechanics */}
        <div className="w-full h-full min-h-[440px]">
          <SideViewPanel />
        </div>

        {/* VIEWPORT C: Onboard AI Camera Vision HUD */}
        <div className="w-full h-full min-h-[440px]">
          <RobotVisionHUD />
        </div>

        {/* VIEWPORT D: Cable Tension & Telemetry Analytics */}
        <div className="w-full h-full min-h-[440px]">
          <TelemetryPhysicsPanel />
        </div>
      </main>
    </div>
  );
}
