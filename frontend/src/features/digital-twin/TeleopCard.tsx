import React, { useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Slider } from "../../components/ui/Slider";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Scissors, Lock } from "lucide-react";

export interface TeleopCardProps {
  isAutonomous: boolean;
  posX: number;
  posY: number;
  depthZ: number;
  onMove: (deltaX: number, deltaY: number) => void;
  onDepthChange: (depth: number) => void;
  onPluck: () => void;
  className?: string;
}

export const TeleopCard: React.FC<TeleopCardProps> = ({
  isAutonomous,
  posX,
  posY,
  depthZ,
  onMove,
  onDepthChange,
  onPluck,
  className = "",
}) => {
  const stepSize = 5;

  // Keyboard navigation support: WASD / Arrows for movement, Space for Pluck
  useEffect(() => {
    if (isAutonomous) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing into an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          e.preventDefault();
          onMove(0, -stepSize);
          break;
        case "s":
        case "arrowdown":
          e.preventDefault();
          onMove(0, stepSize);
          break;
        case "a":
        case "arrowleft":
          e.preventDefault();
          onMove(-stepSize, 0);
          break;
        case "d":
        case "arrowright":
          e.preventDefault();
          onMove(stepSize, 0);
          break;
        case " ":
          e.preventDefault();
          onPluck();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAutonomous, stepSize, onMove, onPluck]);

  return (
    <Card
      title="Manual controls"
      headerAction={
        <span className="text-xs font-mono text-[#8FA19C]">
          Direct Cable Drive
        </span>
      }
      className={`relative ${className}`}
    >
      {/* Autonomous Mode Disable Overlay Banner */}
      {isAutonomous && (
        <div className="absolute inset-0 z-20 bg-[#0E1514]/75 backdrop-blur-[2px] rounded-[14px] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-9 h-9 rounded-full bg-[#1B2625] border border-[#26332F] flex items-center justify-center text-[#8FA19C] mb-2.5">
            <Lock className="w-4 h-4 stroke-[1.8]" />
          </div>
          <p className="text-sm font-medium text-[#E6EDEB]">
            Autonomous mode active
          </p>
          <p className="text-xs text-[#8FA19C] mt-1 max-w-xs">
            Robot is tracking preset canopy path. Switch top mode to Manual to enable direct control.
          </p>
        </div>
      )}

      <div className="flex flex-col justify-between h-full space-y-5">
        {/* D-Pad + Pluck Action */}
        <div className="flex flex-col items-center justify-center pt-2">
          {/* D-Pad Grid */}
          <div className="grid grid-cols-3 gap-2 w-48 h-48 select-none">
            {/* Row 1 */}
            <div />
            <button
              onClick={() => onMove(0, -stepSize)}
              className="w-14 h-14 rounded-[10px] bg-[#1B2625] border border-[#26332F] hover:bg-[#233130] active:bg-[#141D1C] flex flex-col items-center justify-center text-[#8FA19C] hover:text-[#E6EDEB] transition-colors focus:outline-none focus:ring-1 focus:ring-[#4ADE80]"
              title="Move Forward / Row Ahead (W / Up)"
            >
              <ArrowUp className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[9px] font-mono text-[#8FA19C]/70">W</span>
            </button>
            <div />

            {/* Row 2 */}
            <button
              onClick={() => onMove(-stepSize, 0)}
              className="w-14 h-14 rounded-[10px] bg-[#1B2625] border border-[#26332F] hover:bg-[#233130] active:bg-[#141D1C] flex flex-col items-center justify-center text-[#8FA19C] hover:text-[#E6EDEB] transition-colors focus:outline-none focus:ring-1 focus:ring-[#4ADE80]"
              title="Pan Camera Left / Move West (A / Left)"
            >
              <ArrowLeft className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[9px] font-mono text-[#8FA19C]/70">A</span>
            </button>

            {/* Primary Pluck Action in Center */}
            <button
              onClick={onPluck}
              className="w-14 h-14 rounded-[10px] bg-[#4ADE80] text-[#06210F] hover:bg-[#3ec470] active:bg-[#34aa61] flex flex-col items-center justify-center font-semibold text-xs transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4ADE80]"
              title="Pluck Tea Shoots (Space)"
            >
              <Scissors className="w-5 h-5 stroke-[2]" />
              <span className="text-[10px] font-bold mt-0.5">PLUCK</span>
            </button>

            <button
              onClick={() => onMove(stepSize, 0)}
              className="w-14 h-14 rounded-[10px] bg-[#1B2625] border border-[#26332F] hover:bg-[#233130] active:bg-[#141D1C] flex flex-col items-center justify-center text-[#8FA19C] hover:text-[#E6EDEB] transition-colors focus:outline-none focus:ring-1 focus:ring-[#4ADE80]"
              title="Pan Camera Right / Move East (D / Right)"
            >
              <ArrowRight className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[9px] font-mono text-[#8FA19C]/70">D</span>
            </button>

            {/* Row 3 */}
            <div />
            <button
              onClick={() => onMove(0, stepSize)}
              className="w-14 h-14 rounded-[10px] bg-[#1B2625] border border-[#26332F] hover:bg-[#233130] active:bg-[#141D1C] flex flex-col items-center justify-center text-[#8FA19C] hover:text-[#E6EDEB] transition-colors focus:outline-none focus:ring-1 focus:ring-[#4ADE80]"
              title="Move Backward / Row Behind (S / Down)"
            >
              <ArrowDown className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[9px] font-mono text-[#8FA19C]/70">S</span>
            </button>
            <div />
          </div>
        </div>

        {/* Z-Elevator Plucker Depth Slider */}
        <div className="space-y-2 pt-2 border-t border-[#26332F]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8FA19C] font-medium">Plucker depth</span>
            <span className="font-mono text-[#E6EDEB] font-semibold">
              {Math.round(depthZ)}%
            </span>
          </div>
          <Slider
            value={depthZ}
            min={0}
            max={100}
            step={1}
            disabled={isAutonomous}
            onChange={onDepthChange}
          />
        </div>

        {/* Position Readout (X, Y, Z) in Card Footer */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#26332F] text-center font-mono">
          <div className="bg-[#1B2625] rounded-[6px] py-1.5 px-2 border border-[#26332F]">
            <span className="text-[10px] text-[#8FA19C] block">POS X</span>
            <span className="text-xs font-semibold text-[#E6EDEB] tabular-nums">
              {Math.round(posX)}%
            </span>
          </div>
          <div className="bg-[#1B2625] rounded-[6px] py-1.5 px-2 border border-[#26332F]">
            <span className="text-[10px] text-[#8FA19C] block">POS Y</span>
            <span className="text-xs font-semibold text-[#E6EDEB] tabular-nums">
              {Math.round(posY)}%
            </span>
          </div>
          <div className="bg-[#1B2625] rounded-[6px] py-1.5 px-2 border border-[#26332F]">
            <span className="text-[10px] text-[#8FA19C] block">DEPTH Z</span>
            <span className="text-xs font-semibold text-[#E6EDEB] tabular-nums">
              {Math.round(depthZ)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
