import { useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Battery,
  Cpu,
  Gauge,
  Octagon,
  Scissors,
  Square,
  Zap,
} from "lucide-react";
import { SparklineChart } from "@/components/dashboard/SparklineChart";

interface ControlTelemetryDockProps {
  posX: number;
  posY: number;
  posZ: number;
  speedProfile: "normal" | "turbo";
  isHarvesting: boolean;
  battery: number;
  motorTemp: number;
  onMove: (dir: "up" | "down" | "left" | "right") => void;
  onSetCoordinates: (x: number, y: number) => void;
  onSetArmDepthZ: (z: number) => void;
  onSpeedToggle: (sp: "normal" | "turbo") => void;
  onTriggerHarvest: () => void;
}

export function ControlTelemetryDock({
  posX,
  posY,
  posZ,
  speedProfile,
  isHarvesting,
  battery,
  motorTemp,
  onMove,
  onSetCoordinates,
  onSetArmDepthZ,
  onSpeedToggle,
  onTriggerHarvest,
}: ControlTelemetryDockProps) {
  const [tensions] = useState([142, 138, 145, 140]);
  const [historyTension] = useState<number[]>([
    135, 138, 140, 142, 141, 144, 142, 145, 143, 142, 140, 142,
  ]);

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#04080F] border border-cyan-500/20 rounded-2xl overflow-hidden flex flex-col font-sans select-none shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      {/* Top Header / Viewport HUD Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 backdrop-blur-md z-30">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-orb font-black text-xs text-cyan-400 tracking-wider">
            VIEWPORT D — 🎛️ ROBOT TELEOPERATION & CABLE TELEMETRY
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            <Activity className="h-3 w-3" />
            <span>X:{Math.round(posX)}% Y:{Math.round(posY)}% Z:{Math.round(posZ)}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Controls + Telemetry Gauges */}
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto bg-[#050B14]">
        {/* LEFT COLUMN: D-Pad Joystick & Sliders */}
        <div className="bg-black/60 border border-white/10 rounded-xl p-4 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-orb font-bold text-xs text-white flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              Cable Navigation D-Pad Joystick
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onSpeedToggle("normal")}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                  speedProfile === "normal"
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                    : "text-white/30 border-white/10"
                }`}
              >
                0.8 m/s
              </button>
              <button
                onClick={() => onSpeedToggle("turbo")}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                  speedProfile === "turbo"
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    : "text-white/30 border-white/10"
                }`}
              >
                TURBO
              </button>
            </div>
          </div>

          {/* D-Pad Buttons */}
          <div className="flex flex-col items-center gap-2 py-1">
            <button
              onClick={() => onMove("up")}
              className="btn-press w-24 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-orb text-xs font-bold gap-1 hover:bg-cyan-500/20 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
            >
              <ArrowUp className="h-4 w-4" />
              FORWARD
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onMove("left")}
                className="btn-press w-24 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-orb text-xs font-bold gap-1 hover:bg-cyan-500/20 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
              >
                <ArrowLeft className="h-4 w-4" />
                LEFT
              </button>

              <button
                onClick={onTriggerHarvest}
                className={`btn-press w-20 h-10 rounded-lg font-orb text-[10px] font-black border flex items-center justify-center gap-1 ${
                  isHarvesting
                    ? "bg-emerald-500/30 text-emerald-300 border-emerald-400 animate-pulse shadow-[0_0_15px_rgba(0,168,107,0.6)]"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20"
                }`}
              >
                <Scissors className="h-3.5 w-3.5" />
                PLUCK
              </button>

              <button
                onClick={() => onMove("right")}
                className="btn-press w-24 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-orb text-xs font-bold gap-1 hover:bg-cyan-500/20 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
              >
                RIGHT
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => onMove("down")}
              className="btn-press w-24 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-orb text-xs font-bold gap-1 hover:bg-cyan-500/20 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
            >
              <ArrowDown className="h-4 w-4" />
              BACKWARD
            </button>
          </div>

          {/* Precision Sliders */}
          <div className="space-y-3 pt-2 border-t border-white/10 font-mono text-[11px]">
            <div>
              <div className="flex justify-between mb-1 text-white/60">
                <span>Z-Elevator Plucker Depth:</span>
                <span className="text-cyan-400 font-bold">{Math.round(posZ)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={posZ}
                onChange={(e) => onSetArmDepthZ(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Telemetry Balance Gauges & Safety Actions */}
        <div className="bg-black/60 border border-white/10 rounded-xl p-4 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-orb text-xs font-bold text-white mb-3">
              <span className="flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-emerald-400" />
                4-Cable Line Tension Balance (N)
              </span>
              <span className="font-mono text-[10px] text-emerald-400">BALANCED</span>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs mb-3">
              {tensions.map((t, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-cyan-500/20 rounded p-2 flex items-center justify-between"
                >
                  <span className="text-white/40">LINE 0{i + 1}:</span>
                  <span className="font-orb font-bold text-cyan-400">{t} N</span>
                </div>
              ))}
            </div>

            {/* Sparkline Graph */}
            <div className="text-[10px] font-mono text-white/40 mb-1">
              LIVE TENSION STABILITY FLUTTER
            </div>
            <SparklineChart data={historyTension} col="#00F0FF" height={45} />
          </div>

          {/* Action Trigger Buttons */}
          <div className="space-y-2">
            <button
              onClick={onTriggerHarvest}
              className={`btn-press w-full py-3 rounded-xl font-orb font-bold text-xs border flex items-center justify-center gap-2 transition-all ${
                isHarvesting
                  ? "bg-emerald-500/30 text-emerald-300 border-emerald-400 animate-pulse shadow-[0_0_20px_rgba(0,168,107,0.7)]"
                  : "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30"
              }`}
            >
              <Scissors className="h-4 w-4" />
              {isHarvesting ? "PLUCKING TEA SHOOTS ACTIVE..." : "TRIGGER HARVEST PLUCKER ACTUATOR"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
