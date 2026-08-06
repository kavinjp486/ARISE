import { useState } from "react";
import { RobotVisCanvas } from "@/components/dashboard/RobotVisCanvas";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Cpu,
  Octagon,
  Scissors,
  Square,
  Zap,
} from "lucide-react";

interface ControlPageProps {
  controlX: number;
  controlY: number;
  isRunning: boolean;
  onControlChange: (x: number, y: number) => void;
  onToggleRun: () => void;
  onHarvestPulse?: () => void;
}

export function ControlPage({
  controlX,
  controlY,
  isRunning,
  onControlChange,
  onToggleRun,
  onHarvestPulse,
}: ControlPageProps) {
  const [speedMode, setSpeedMode] = useState<"normal" | "turbo">("normal");

  const handleMove = (direction: "up" | "down" | "left" | "right") => {
    const step = speedMode === "turbo" ? 15 : 8;
    let newX = controlX;
    let newY = controlY;

    if (direction === "left") newX = Math.max(0, controlX - step);
    if (direction === "right") newX = Math.min(100, controlX + step);
    if (direction === "up") newY = Math.max(0, controlY - step);
    if (direction === "down") newY = Math.min(100, controlY + step);

    onControlChange(newX, newY);
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-orb text-2xl font-black">
            Robot <span className="text-b">Remote Control Center</span>
          </div>
          <p className="text-white/40 text-sm mt-0.5">
            Interactive cable navigation, depth arm slider controls, and harvesting actuator
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-orb ${
              isRunning ? "glass-g text-g panim-g" : "glass text-white/30"
            }`}
          >
            {isRunning ? "● TELEOPERATION ACTIVE" : "○ MANUAL OVERRIDE"}
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas + Remote Joystick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2-Columns: Interactive Visualizer Canvas */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-b rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-orb font-bold text-sm text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-b" />
                Live Cable Robot Simulation Canvas
              </span>
              <div className="flex items-center gap-3 font-mono text-xs text-white/40">
                <span>X-Cable: {Math.round(controlX)}%</span>
                <span>Y-Depth: {Math.round(controlY)}%</span>
              </div>
            </div>

            {/* Visualizer Canvas */}
            <RobotVisCanvas x={controlX} y={controlY} />
          </div>

          {/* Precision Sliders */}
          <div className="glass rounded-2xl p-5 space-y-5">
            <div className="font-orb font-bold text-sm text-white">
              🎛️ Precision Axis Sliders
            </div>

            {/* Slider X */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white/60">X-Axis Cable Track Position</span>
                <span className="text-b font-bold">{Math.round(controlX)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={controlX}
                onChange={(e) =>
                  onControlChange(parseFloat(e.target.value), controlY)
                }
              />
              <div className="flex justify-between text-[10px] text-white/30 font-mono">
                <span>Left Anchor Pole</span>
                <span>Right Anchor Pole</span>
              </div>
            </div>

            {/* Slider Y */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white/60">Y-Axis Harvesting Arm Extension</span>
                <span className="text-g font-bold">{Math.round(controlY)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={controlY}
                onChange={(e) =>
                  onControlChange(controlX, parseFloat(e.target.value))
                }
              />
              <div className="flex justify-between text-[10px] text-white/30 font-mono">
                <span>Retracted Top</span>
                <span>Canopy Depth Max</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Physical Control D-Pad & Emergency Action Buttons */}
        <div className="space-y-5">
          {/* Speed Presets */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-orb font-bold text-sm text-white">
                ⚡ Speed Profile
              </span>
              <span className="text-xs font-mono text-white/40">
                {speedMode === "turbo" ? "1.2 m/s" : "0.8 m/s"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSpeedMode("normal")}
                className={`btn-press py-2.5 rounded-xl font-orb font-bold text-xs border ${
                  speedMode === "normal"
                    ? "glass-g text-g border-g"
                    : "glass text-white/40 border-white/10"
                }`}
              >
                Normal (0.8 m/s)
              </button>
              <button
                onClick={() => setSpeedMode("turbo")}
                className={`btn-press py-2.5 rounded-xl font-orb font-bold text-xs border ${
                  speedMode === "turbo"
                    ? "glass-b text-b border-b"
                    : "glass text-white/40 border-white/10"
                }`}
              >
                Turbo (1.2 m/s)
              </button>
            </div>
          </div>

          {/* D-Pad Navigation Joystick */}
          <div className="glass-b rounded-2xl p-6 flex flex-col items-center space-y-3">
            <span className="font-orb font-bold text-xs text-white/50 mb-1">
              Cable Navigation D-Pad
            </span>

            {/* UP */}
            <button
              onClick={() => handleMove("up")}
              className="btn-press w-24 h-12 rounded-xl glass-b text-b flex items-center justify-center font-bold gap-1 border border-b/30 hover:bg-b/10"
            >
              <ArrowUp className="h-5 w-5" />
              UP
            </button>

            {/* LEFT / PAUSE / RIGHT */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMove("left")}
                className="btn-press w-24 h-12 rounded-xl glass-b text-b flex items-center justify-center font-bold gap-1 border border-b/30 hover:bg-b/10"
              >
                <ArrowLeft className="h-5 w-5" />
                LEFT
              </button>

              <button
                onClick={onToggleRun}
                className="btn-press w-20 h-12 rounded-xl glass text-white flex items-center justify-center font-bold border border-white/20"
              >
                <Square className="h-4 w-4 fill-current text-white/80" />
              </button>

              <button
                onClick={() => handleMove("right")}
                className="btn-press w-24 h-12 rounded-xl glass-b text-b flex items-center justify-center font-bold gap-1 border border-b/30 hover:bg-b/10"
              >
                RIGHT
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* DOWN */}
            <button
              onClick={() => handleMove("down")}
              className="btn-press w-24 h-12 rounded-xl glass-b text-b flex items-center justify-center font-bold gap-1 border border-b/30 hover:bg-b/10"
            >
              <ArrowDown className="h-5 w-5" />
              DOWN
            </button>
          </div>

          {/* Actuator & Emergency Actions */}
          <div className="space-y-3">
            <button
              onClick={onHarvestPulse}
              className="btn-press w-full py-4 rounded-2xl font-orb font-bold text-sm glass-g text-g border border-g/40 hover:bg-g/10 flex items-center justify-center gap-2 glow-g"
            >
              <Scissors className="h-5 w-5" />
              Trigger Harvest Plucker Actuator
            </button>

            <button
              onClick={onToggleRun}
              className="btn-press w-full py-4 rounded-2xl font-orb font-black text-sm bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 flex items-center justify-center gap-2 panim-r"
            >
              <Octagon className="h-5 w-5" />
              Emergency Stop (E-STOP)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
