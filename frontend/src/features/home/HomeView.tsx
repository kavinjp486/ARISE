import React from "react";
import { ArrowRight, Layers, ScanEye, Cable, Scissors, Activity, Compass } from "lucide-react";
import { ProductHeroCanvas } from "./ProductHeroCanvas";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import type { NavTab } from "../../components/layout/Sidebar";

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const systemPillars = [
    {
      icon: <Cable className="w-4 h-4 text-[#4ADE80]" />,
      title: "4-Cable Parallel Kinematics",
      description:
        "High-tensile suspension cables span the field between four corner anchor pylons, smoothly translating the robot payload in 3D space with zero ground footprint.",
    },
    {
      icon: <Scissors className="w-4 h-4 text-[#4ADE80]" />,
      title: "Selective Flush Harvesting",
      description:
        "High-speed rotary dual shears articulate vertically to isolate and snip mature two-leaves-and-a-bud flushes without harming woody stems or tender buds.",
    },
    {
      icon: <Activity className="w-4 h-4 text-[#4ADE80]" />,
      title: "Real-Time Crop Pathology",
      description:
        "Integrated edge computer vision analyzes leaf green density, detecting chlorosis, blight, and flush density in real time directly from the live optical stream.",
    },
    {
      icon: <Compass className="w-4 h-4 text-[#4ADE80]" />,
      title: "Digital Twin Teleoperation",
      description:
        "Remote operators command autonomous field sweeping routines, navigate through street-view canopy waypoints, or take over manual D-pad controls instantly.",
    },
  ];

  const metrics = [
    { value: "95%", label: "Labor Dependency Reduced", sub: "Autonomous continuous harvesting" },
    { value: "0 kg", label: "Soil Compaction", sub: "100% aerial cable-suspended mobility" },
    { value: "±1.2 cm", label: "Kinematic Precision", sub: "Sub-centimeter RTK & encoder positioning" },
    { value: "24/7", label: "All-Weather Deployment", sub: "High-gradient mountain slope resilience" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Hero Introduction Header (Flat, no highlights or glows) */}
      <section className="rounded-[12px] border border-[#26332F] bg-[#16201E] p-6 md:p-8 space-y-5">
        <div className="max-w-4xl space-y-4">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] bg-[#0E1514] border border-[#26332F] text-[#4ADE80] text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
            <span>ARISE FIELD ROBOTICS · SYSTEM ONLINE</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-[#E6EDEB] leading-tight">
            Autonomous Aerial Harvesting for High-Gradient Tea Estates
          </h1>

          {/* Subtitle Description */}
          <p className="text-sm md:text-base text-[#8FA19C] leading-relaxed max-w-3xl">
            ARISE suspends an intelligent robotic payload above the canopy using four precision winches.
            Combining drone-level spatial mobility with heavy-payload harvesting capacity, ARISE harvests
            premium two-leaves-and-a-bud flushes while preserving soil ecology and tea bush longevity.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              variant="primary"
              size="md"
              className="gap-2 font-medium"
              onClick={() => onNavigate("digital-twin")}
            >
              <Layers className="w-4 h-4" />
              <span>Launch Digital Twin</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>

            <Button
              variant="secondary"
              size="md"
              className="gap-2 font-medium border-[#26332F] hover:bg-[#1B2625] text-[#E6EDEB]"
              onClick={() => onNavigate("ai-vision")}
            >
              <ScanEye className="w-4 h-4 text-[#4ADE80]" />
              <span>Open AI Vision Feed</span>
            </Button>
          </div>
        </div>

        {/* Key Metrics Strip (Flat tiles) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t border-[#26332F]">
          {metrics.map((m) => (
            <div key={m.label} className="space-y-0.5">
              <div className="text-xl md:text-2xl font-bold font-mono text-[#4ADE80]">
                {m.value}
              </div>
              <div className="text-xs font-medium text-[#E6EDEB]">{m.label}</div>
              <div className="text-[11px] text-[#8FA19C]">{m.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Product Animation & Kinematics Showcase */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
          <div>
            <h2 className="text-base font-semibold text-[#E6EDEB]">
              Aerial Kinematics & Harvesting Simulation
            </h2>
            <p className="text-xs text-[#8FA19C]">
              Continuous physical model of 4-cable suspension, down-facing optical scanning, and articulated plucking
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8FA19C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
            <span>KINEMATICS ENGINE ACTIVE</span>
          </div>
        </div>

        {/* The Animated Product Canvas (Flat, clean) */}
        <ProductHeroCanvas />

        {/* Telemetry specs bar underneath simulation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <Card className="p-3 bg-[#16201E] border-[#26332F]">
            <div className="text-[10px] font-mono uppercase text-[#8FA19C]">Suspension Winches</div>
            <div className="text-xs font-semibold text-[#E6EDEB] mt-0.5">4x Brushless DC Servos</div>
            <div className="text-[11px] text-[#4ADE80] font-mono mt-0.5">Synchronized Tension</div>
          </Card>
          <Card className="p-3 bg-[#16201E] border-[#26332F]">
            <div className="text-[10px] font-mono uppercase text-[#8FA19C]">Harvesting Payload</div>
            <div className="text-xs font-semibold text-[#E6EDEB] mt-0.5">Articulated Dual-Shear</div>
            <div className="text-[11px] text-[#4ADE80] font-mono mt-0.5">2,400 RPM Plucker</div>
          </Card>
          <Card className="p-3 bg-[#16201E] border-[#26332F]">
            <div className="text-[10px] font-mono uppercase text-[#8FA19C]">Vision Guidance</div>
            <div className="text-xs font-semibold text-[#E6EDEB] mt-0.5">Down-Facing RGB-D</div>
            <div className="text-[11px] text-[#4ADE80] font-mono mt-0.5">Active Sweep</div>
          </Card>
          <Card className="p-3 bg-[#16201E] border-[#26332F]">
            <div className="text-[10px] font-mono uppercase text-[#8FA19C]">Field Navigation</div>
            <div className="text-xs font-semibold text-[#E6EDEB] mt-0.5">RTK-GNSS + Cable Encoders</div>
            <div className="text-[11px] text-[#4ADE80] font-mono mt-0.5">Sub-Centimeter Error</div>
          </Card>
        </div>
      </section>

      {/* 3. Core Architecture Pillars (Flat cards) */}
      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-base font-semibold text-[#E6EDEB]">
            System Architecture
          </h2>
          <p className="text-xs text-[#8FA19C]">
            How the ARISE autonomous ecosystem operates from canopy level to mission control
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {systemPillars.map((p) => (
            <Card
              key={p.title}
              className="p-4 bg-[#16201E] border-[#26332F] flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-8 h-8 rounded-[6px] bg-[#0E1514] border border-[#26332F] flex items-center justify-center">
                  {p.icon}
                </div>
                <h3 className="font-semibold text-xs text-[#E6EDEB]">{p.title}</h3>
                <p className="text-xs text-[#8FA19C] leading-relaxed">{p.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Quick Launch Modules Banner (Flat, simple) */}
      <section className="rounded-[12px] border border-[#26332F] bg-[#16201E] p-5 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center lg:text-left">
          <h3 className="text-sm font-semibold text-[#E6EDEB]">
            Explore Mission Control & Commercial Operations
          </h3>
          <p className="text-xs text-[#8FA19C]">
            Inspect 3D digital twin navigation, real-time leaf pathology, automated zone micro-misting, and estate harvest yields.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            className="text-xs border-[#26332F] hover:bg-[#1B2625] text-[#E6EDEB]"
            onClick={() => onNavigate("irrigation")}
          >
            Smart Irrigation
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="text-xs border-[#26332F] hover:bg-[#1B2625] text-[#E6EDEB]"
            onClick={() => onNavigate("owner")}
          >
            Owner Dashboard
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="text-xs border-[#26332F] hover:bg-[#1B2625] text-[#E6EDEB]"
            onClick={() => onNavigate("ai-vision")}
          >
            AI Vision
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="text-xs"
            onClick={() => onNavigate("digital-twin")}
          >
            Digital Twin
          </Button>
        </div>
      </section>
    </div>
  );
};
