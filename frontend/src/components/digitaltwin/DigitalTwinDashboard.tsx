import { useState } from "react";
import { useDigitalTwinState } from "@/hooks/useDigitalTwinState";
import { AerialViewPanel } from "./AerialViewPanel";
import { ControlTelemetryDock } from "./ControlTelemetryDock";
import { FirstPersonCameraHUD } from "./FirstPersonCameraHUD";
import { SideViewPanel } from "./SideViewPanel";
import { TacticalHeader } from "./TacticalHeader";
import type { ActiveTab, DigitalTwinMode } from "./TacticalHeader";
import { VisionAnalyticsPage } from "./VisionAnalyticsPage";

export function DigitalTwinDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("digitaltwin");
  const [mode, setMode] = useState<DigitalTwinMode>("manual");
  const [isRunning, setIsRunning] = useState(true);

  const {
    posX,
    posY,
    posZ,
    row,
    col,
    isHarvesting,
    cells,
    leafCount,
    speedProfile,
    battery,
    motorTemp,
    setSpeedProfile,
    movePayload,
    setCoordinates,
    setArmDepthZ,
    triggerHarvest,
  } = useDigitalTwinState();

  return (
    <div className="min-h-screen bg-[#04080F] text-white flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Omniverse Tactical HUD Header with Navigation Tabs */}
      <TacticalHeader
        mode={mode}
        onModeChange={setMode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isRunning={isRunning}
        onToggleRun={() => setIsRunning(!isRunning)}
        battery={battery}
        cableTensionAvg={142}
        wifiLatencyMs={12}
      />

      {/* CONDITIONAL RENDER: DIGITAL TWIN OR VISION ANALYTICS PAGE */}
      {activeTab === "digitaltwin" ? (
        <main className="flex-1 p-3 md:p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-[1800px] w-full mx-auto">
          {/* VIEWPORT A: Top-Down Wooden Frame View */}
          <div className="w-full h-full min-h-[440px]">
            <AerialViewPanel
              posX={posX}
              posY={posY}
              row={row}
              col={col}
              cells={cells}
              isHarvesting={isHarvesting}
            />
          </div>

          {/* VIEWPORT B: Side Mechanics Physics & Timber Posts View */}
          <div className="w-full h-full min-h-[440px]">
            <SideViewPanel
              posX={posX}
              posZ={posZ}
              isHarvesting={isHarvesting}
              leafCount={leafCount}
            />
          </div>

          {/* VIEWPORT C: Onboard First-Person Downward AI Camera View */}
          <div className="w-full h-full min-h-[440px]">
            <FirstPersonCameraHUD
              posX={posX}
              posY={posY}
              row={row}
              col={col}
              isHarvesting={isHarvesting}
              cells={cells}
            />
          </div>

          {/* VIEWPORT D: User Control Teleoperation & Cable Telemetry Dock */}
          <div className="w-full h-full min-h-[440px]">
            <ControlTelemetryDock
              posX={posX}
              posY={posY}
              posZ={posZ}
              speedProfile={speedProfile}
              isHarvesting={isHarvesting}
              battery={battery}
              motorTemp={motorTemp}
              onMove={movePayload}
              onSetCoordinates={setCoordinates}
              onSetArmDepthZ={setArmDepthZ}
              onSpeedToggle={setSpeedProfile}
              onTriggerHarvest={triggerHarvest}
            />
          </div>
        </main>
      ) : (
        <main className="flex-1 w-full">
          <VisionAnalyticsPage />
        </main>
      )}
    </div>
  );
}
