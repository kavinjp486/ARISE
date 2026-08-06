import { Cpu, Octagon, Radio, ShieldCheck, Zap } from "lucide-react";

export type DigitalTwinMode = "autonomous" | "manual" | "playback";

interface TacticalHeaderProps {
  mode: DigitalTwinMode;
  onModeChange: (m: DigitalTwinMode) => void;
  isRunning: boolean;
  onToggleRun: () => void;
  battery: number;
  cableTensionAvg: number;
  wifiLatencyMs: number;
}

export function TacticalHeader({
  mode,
  onModeChange,
  isRunning,
  onToggleRun,
  battery,
  cableTensionAvg,
  wifiLatencyMs,
}: TacticalHeaderProps) {
  return (
    <header className="w-full bg-[#050a12]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 select-none z-50">
      {/* Brand & System Title */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-orb font-black text-base shadow-[0_0_15px_rgba(0,240,255,0.25)]">
          ❖
        </div>
        <div>
          <div className="font-orb text-base font-black tracking-widest text-white flex items-center gap-2">
            <span>ARISE</span>
            <span className="text-cyan-400 font-mono text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
              DIGITAL TWIN v2.4
            </span>
          </div>
          <div className="text-[10px] text-cyan-400/50 font-mono tracking-tight flex items-center gap-2">
            <span>CORE: OMNIVERSE RUNTIME</span>
            <span>•</span>
            <span>NILGIRIS TEA ESTATE [SECTOR B]</span>
          </div>
        </div>
      </div>

      {/* Telemetry Indicator Badges */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
          <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span className="text-white/40">RTK/GPS:</span>
          <span className="text-emerald-400 font-bold">FIXED (±1.2cm)</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
          <Zap className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-white/40">Tension:</span>
          <span className="text-cyan-400 font-bold">{Math.round(cableTensionAvg)} N</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-white/40">Battery:</span>
          <span
            className="font-bold"
            style={{ color: battery > 50 ? "#00A86B" : "#ffd700" }}
          >
            {Math.round(battery)}%
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
          <Cpu className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-white/40">Link:</span>
          <span className="text-cyan-400 font-bold">{wifiLatencyMs}ms</span>
        </div>
      </div>

      {/* Mode Switcher & Emergency Stop */}
      <div className="flex items-center gap-3">
        {/* Mode Buttons */}
        <div className="flex items-center p-1 rounded-lg bg-black/60 border border-white/10 text-xs font-orb font-bold">
          <button
            onClick={() => onModeChange("autonomous")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              mode === "autonomous"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                : "text-white/40 hover:text-white"
            }`}
          >
            AUTONOMOUS
          </button>
          <button
            onClick={() => onModeChange("manual")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              mode === "manual"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 shadow-[0_0_12px_rgba(0,168,107,0.3)]"
                : "text-white/40 hover:text-white"
            }`}
          >
            TELEOP
          </button>
          <button
            onClick={() => onModeChange("playback")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              mode === "playback"
                ? "bg-amber-500/20 text-amber-400 border border-amber-400/40 shadow-[0_0_12px_rgba(255,184,0,0.3)]"
                : "text-white/40 hover:text-white"
            }`}
          >
            SIM PLAYBACK
          </button>
        </div>

        {/* E-Stop Button */}
        <button
          onClick={onToggleRun}
          className={`px-3.5 py-1.5 rounded-lg font-orb font-black text-xs border flex items-center gap-1.5 transition-all ${
            isRunning
              ? "bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30 shadow-[0_0_15px_rgba(255,60,60,0.4)]"
              : "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30"
          }`}
        >
          <Octagon className="h-4 w-4" />
          {isRunning ? "E-STOP" : "RESUME"}
        </button>
      </div>
    </header>
  );
}
