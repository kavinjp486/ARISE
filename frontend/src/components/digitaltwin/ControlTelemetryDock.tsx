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
  Radio,
  Scissors,
  Sliders,
  Zap,
} from "lucide-react";

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
  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#04080F] border border-cyan-500/20 rounded-2xl overflow-hidden flex flex-col font-sans select-none shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      {/* Top Header / Viewport HUD Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 backdrop-blur-md z-30">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-orb font-black text-xs text-cyan-400 tracking-wider">
            VIEWPORT D — 🎛️ EXPANDED ROBOT TELEOPERATION CONTROL CENTER
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/20 font-bold">
            <Radio className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
            <span>TELEOPERATION ACTIVE</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20 font-mono font-bold">
            <span>X:{Math.round(posX)}% Y:{Math.round(posY)}% Z:{Math.round(posZ)}%</span>
          </div>
        </div>
      </div>

      {/* Main Expanded Control Center Stage */}
      <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto bg-[#050B14] space-y-6">
        {/* Top Control Bar: Speed Mode Presets & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-black/50 border border-white/10 p-3.5 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-400" />
            <span className="font-orb text-xs font-bold text-white">
              CABLE DRIVE SPEED PROFILE:
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={() => onSpeedToggle("normal")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                speedProfile === "normal"
                  ? "bg-cyan-500/25 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  : "bg-white/5 text-white/40 border-white/10 hover:text-white"
              }`}
            >
              STANDARD (0.8 m/s)
            </button>
            <button
              onClick={() => onSpeedToggle("turbo")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                speedProfile === "turbo"
                  ? "bg-amber-500/25 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(255,191,0,0.4)]"
                  : "bg-white/5 text-white/40 border-white/10 hover:text-white"
              }`}
            >
              ⚡ TURBO BOOST (1.8 m/s)
            </button>
          </div>
        </div>

        {/* CENTERPIECE: PROMINENT ENLARGED D-PAD JOYSTICK */}
        <div className="flex-1 flex flex-col items-center justify-center py-2">
          <div className="flex flex-col items-center gap-3">
            {/* FORWARD BUTTON */}
            <button
              onClick={() => onMove("up")}
              className="btn-press w-40 h-12 rounded-xl bg-gradient-to-b from-cyan-500/20 to-cyan-950/40 text-cyan-300 border-2 border-cyan-400/60 flex items-center justify-center font-orb text-xs font-black gap-2 hover:bg-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
            >
              <ArrowUp className="h-5 w-5 stroke-[2.5]" />
              FORWARD
            </button>

            {/* MIDDLE ROW: LEFT, CENTER PLUCK ACTION, RIGHT */}
            <div className="flex items-center gap-3">
              {/* LEFT BUTTON */}
              <button
                onClick={() => onMove("left")}
                className="btn-press w-40 h-12 rounded-xl bg-gradient-to-b from-cyan-500/20 to-cyan-950/40 text-cyan-300 border-2 border-cyan-400/60 flex items-center justify-center font-orb text-xs font-black gap-2 hover:bg-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
              >
                <ArrowLeft className="h-5 w-5 stroke-[2.5]" />
                LEFT
              </button>

              {/* CENTER QUICK PLUCK TRIGGER */}
              <button
                onClick={onTriggerHarvest}
                className={`btn-press w-36 h-12 rounded-xl font-orb text-xs font-black border-2 flex items-center justify-center gap-2 transition-all ${
                  isHarvesting
                    ? "bg-emerald-500/40 text-emerald-200 border-emerald-300 animate-pulse shadow-[0_0_25px_rgba(0,168,107,0.8)]"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/60 hover:bg-emerald-500/30 hover:border-emerald-400 shadow-[0_0_15px_rgba(0,168,107,0.3)]"
                }`}
              >
                <Scissors className="h-4 w-4" />
                PLUCK
              </button>

              {/* RIGHT BUTTON */}
              <button
                onClick={() => onMove("right")}
                className="btn-press w-40 h-12 rounded-xl bg-gradient-to-b from-cyan-500/20 to-cyan-950/40 text-cyan-300 border-2 border-cyan-400/60 flex items-center justify-center font-orb text-xs font-black gap-2 hover:bg-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
              >
                RIGHT
                <ArrowRight className="h-5 w-5 stroke-[2.5]" />
              </button>
            </div>

            {/* BACKWARD BUTTON */}
            <button
              onClick={() => onMove("down")}
              className="btn-press w-40 h-12 rounded-xl bg-gradient-to-b from-cyan-500/20 to-cyan-950/40 text-cyan-300 border-2 border-cyan-400/60 flex items-center justify-center font-orb text-xs font-black gap-2 hover:bg-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
            >
              <ArrowDown className="h-5 w-5 stroke-[2.5]" />
              BACKWARD
            </button>
          </div>
        </div>

        {/* BOTTOM SECTION: EXPANDED PRECISION SLIDERS & FULL HARVEST ACTUATOR TRIGGER */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          {/* Z-Elevator Arm Lead Screw Depth Slider */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center font-mono text-xs">
              <span className="text-white/70 font-bold flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-cyan-400" />
                Z-Elevator Lead-Screw Plucker Depth:
              </span>
              <span className="text-cyan-400 font-orb font-black text-sm">
                {Math.round(posZ)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={posZ}
              onChange={(e) => onSetArmDepthZ(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          {/* Full Width Trigger Harvest Actuator Button */}
          <button
            onClick={onTriggerHarvest}
            className={`btn-press w-full py-4 rounded-xl font-orb font-black text-sm border-2 flex items-center justify-center gap-3 transition-all ${
              isHarvesting
                ? "bg-emerald-500/40 text-emerald-200 border-emerald-300 animate-pulse shadow-[0_0_30px_rgba(0,168,107,0.9)]"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/60 hover:bg-emerald-500/30 hover:border-emerald-400 shadow-[0_0_20px_rgba(0,168,107,0.4)]"
            }`}
          >
            <Scissors className="h-5 w-5" />
            {isHarvesting
              ? "PLUCKING TEA SHOOTS (PLUCKER ACTUATOR ACTIVE)..."
              : "TRIGGER HARVEST PLUCKER ACTUATOR"}
          </button>
        </div>
      </div>
    </div>
  );
}
