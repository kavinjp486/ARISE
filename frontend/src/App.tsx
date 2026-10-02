import { useState, useEffect } from "react";
import { TopBar, type OperationMode } from "./components/layout/TopBar";
import { Sidebar, type NavTab } from "./components/layout/Sidebar";
import { StatusStrip } from "./components/layout/StatusStrip";
import { HomeView } from "./features/home/HomeView";
import { DigitalTwinView } from "./features/digital-twin/DigitalTwinView";
import { VisionAnalyticsView } from "./features/vision/VisionAnalyticsView";
import { IrrigationView } from "./features/irrigation/IrrigationView";
import { OwnerDashboardView } from "./features/owner/OwnerDashboardView";
import { ApiService } from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [mode, setMode] = useState<OperationMode>("manual");
  const [isEstopActive, setIsEstopActive] = useState(false);

  // Live status telemetry state from backend / ESP32
  const [telemetry, setTelemetry] = useState({
    battery: 88,
    tension: 142,
    gpsStatus: "fixed" as "fixed" | "float" | "lost",
    gpsAccuracy: "±1.2 cm",
    latency: 12,
  });

  // Polling backend /status endpoint gracefully
  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const data = await ApiService.getStatus();
        if (isMounted && data) {
          setTelemetry((prev) => ({
            ...prev,
            battery: data.battery ?? prev.battery,
          }));
        }
      } catch {
        // Fallback already handled inside ApiService
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleTriggerEstop = () => {
    setIsEstopActive(true);
    ApiService.sendCommand("ESTOP").catch(() => {});
  };

  const handleReleaseEstop = () => {
    setIsEstopActive(false);
    ApiService.sendCommand("RELEASE_ESTOP").catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#0E1514] text-[#E6EDEB] flex flex-col font-sans">
      {/* Top Bar (Section 4.1) */}
      <TopBar
        mode={mode}
        onModeChange={setMode}
        isEstopActive={isEstopActive}
        onTriggerEstop={handleTriggerEstop}
        onReleaseEstop={handleReleaseEstop}
        onSelectHome={() => setActiveTab("home")}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar (Section 4.2) */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-[1440px] mx-auto space-y-6">
            {/* Status Strip (Section 4.3 - Shared across all views) */}
            <StatusStrip
              batteryPercent={telemetry.battery}
              cableTension={telemetry.tension}
              gpsStatus={telemetry.gpsStatus}
              gpsAccuracy={telemetry.gpsAccuracy}
              latencyMs={telemetry.latency}
            />

            {/* Tab Viewport */}
            {activeTab === "home" && (
              <HomeView onNavigate={(tab) => setActiveTab(tab)} />
            )}

            {activeTab === "digital-twin" && (
              <DigitalTwinView mode={mode} isEstopActive={isEstopActive} />
            )}

            {activeTab === "ai-vision" && <VisionAnalyticsView />}

            {activeTab === "irrigation" && <IrrigationView />}

            {activeTab === "owner" && <OwnerDashboardView />}
          </div>
        </main>
      </div>
    </div>
  );
}
