import { motion } from "framer-motion";
import { SectionCard } from "@/components/layout/SectionCard";
import { Badge } from "@/components/ui/badge";
import type { RobotStatusData } from "@/types";
import { Activity, Compass, Cpu, Navigation, Zap } from "lucide-react";

interface RobotCanopyVisualizerProps {
  status?: RobotStatusData | null;
  compact?: boolean;
}

export function RobotCanopyVisualizer({
  status,
  compact = false,
}: RobotCanopyVisualizerProps) {
  // Map real telemetry position (x: 0 - 200, y: 0 - 100) to percentage within visual bounds (10% - 90%)
  const rawX = status?.position.x ?? 142.5;
  const rawY = status?.position.y ?? 87.3;

  // Clamp & map X: 0->200 to 12%->88%
  const posXPercent = Math.min(88, Math.max(12, ((rawX % 200) / 200) * 76 + 12));
  // Clamp & map Y: 0->100 to 20%->80%
  const posYPercent = Math.min(80, Math.max(20, ((rawY % 100) / 100) * 60 + 20));

  const isMoving = (status?.speed ?? 0) > 0;
  const mode = status?.mode ?? "manual";

  return (
    <SectionCard
      title="Live Plantation Cable Robot Telemetry"
      description={`Sector B — Cable Suspension Track | Coordinates: X: ${rawX.toFixed(
        1
      )}m, Y: ${rawY.toFixed(1)}m`}
      action={
        <div className="flex items-center gap-2">
          <Badge
            variant={
              mode === "autonomous"
                ? "info"
                : isMoving
                  ? "success"
                  : "secondary"
            }
            className="gap-1.5 capitalize"
          >
            <Cpu className="h-3 w-3" />
            {mode} Mode
          </Badge>
          <Badge variant="outline" className="gap-1 font-mono text-xs">
            <Zap className="h-3 w-3 text-emerald-400" />
            {status?.speed ?? 0.8} m/s
          </Badge>
        </div>
      }
    >
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-border/70 bg-[#08120e] p-4 ${compact ? "h-[220px]" : "h-[320px] lg:h-[380px]"
          }`}
      >
        {/* Background Grid Pattern: Tea Bush Plantation Rows */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `radial-gradient(#10b981 1px, transparent 1px), linear-gradient(to right, #1a2c23 1px, transparent 1px)`,
            backgroundSize: "24px 24px, 48px 48px",
          }}
        />

        {/* Tea Plantation Crop Row Overlays */}
        <div className="absolute inset-0 flex flex-col justify-between py-6 px-12 pointer-events-none opacity-20">
          {[14, 15, 16, 17].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between border-b border-dashed border-emerald-500/40 text-[10px] font-mono text-emerald-400"
            >
              <span>Tea Row {row} [Sector B]</span>
              <span>Crop Canopy Optimal</span>
            </div>
          ))}
        </div>

        {/* Cable Support Towers (Left & Right Anchors) */}
        <div className="absolute left-4 top-4 bottom-4 w-4 rounded border border-emerald-500/30 bg-emerald-950/40 flex flex-col justify-between items-center py-2 z-10">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[9px] font-mono text-emerald-400 rotate-90 tracking-tighter">
            TOWER-A
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>

        <div className="absolute right-4 top-4 bottom-4 w-4 rounded border border-emerald-500/30 bg-emerald-950/40 flex flex-col justify-between items-center py-2 z-10">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[9px] font-mono text-emerald-400 -rotate-90 tracking-tighter">
            TOWER-B
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Dynamic Suspension Cable Lines */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none z-10">
          {/* Main Suspension Cable Line */}
          <line
            x1="24"
            y1={`${posYPercent}%`}
            x2="96%"
            y2={`${posYPercent}%`}
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.6"
          />
          {/* Cable Drop Tether to Robot Carriage */}
          <line
            x1={`${posXPercent}%`}
            y1="0"
            x2={`${posXPercent}%`}
            y2={`${posYPercent}%`}
            stroke="#38bdf8"
            strokeWidth="1"
            opacity="0.4"
          />
        </svg>

        {/* LIVE ANIMATED CABLE ROBOT CARRIAGE */}
        <motion.div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          animate={{
            left: `${posXPercent}%`,
            top: `${posYPercent}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 90,
            damping: 18,
          }}
        >
          {/* Pulse Effect Rings around Robot Payload */}
          <div className="relative flex items-center justify-center">
            {isMoving && (
              <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-emerald-500/20 opacity-75" />
            )}
            <span className="absolute inline-flex h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30" />

            {/* Robot Physical Box Body */}
            <div className="relative flex h-10 w-12 items-center justify-center rounded-lg border-2 border-emerald-400 bg-emerald-950/90 shadow-xl shadow-emerald-950/80 backdrop-blur">
              <Navigation
                className={`h-5 w-5 text-emerald-400 transition-transform duration-300 ${isMoving ? "rotate-45" : ""
                  }`}
              />

              {/* Status LED Indicator on Carriage */}
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>

            {/* Robot Coordinate Tag Overlay */}
            <div className="absolute -bottom-7 whitespace-nowrap rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
              X:{rawX.toFixed(1)} Y:{rawY.toFixed(1)}
            </div>
          </div>
        </motion.div>

        {/* Bottom Status Legend Bar */}
        <div className="absolute bottom-3 left-10 right-10 flex items-center justify-between rounded-lg border border-border/40 bg-black/60 px-3 py-1.5 backdrop-blur z-10 text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <Compass className="h-3.5 w-3.5 text-emerald-400" />
            <span>Track: Line 14</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-sky-400" />
            <span>Cable Tension: 142 N (Nominal)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-foreground font-semibold">
              {isMoving ? "NAVIGATING" : "STATIONARY"}
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
