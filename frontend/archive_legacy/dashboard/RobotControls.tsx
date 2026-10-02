import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/layout/SectionCard";
import type { RobotMode } from "@/types";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Gamepad2,
  Octagon,
  Play,
  Scissors,
  Square,
} from "lucide-react";

interface RobotControlsProps {
  onCommand: (command: string, params?: Record<string, unknown>) => void;
  currentMode?: RobotMode;
  isExecuting?: boolean;
}

export function RobotControls({
  onCommand,
  currentMode = "manual",
  isExecuting = false,
}: RobotControlsProps) {
  const [activeMode, setActiveMode] = useState<RobotMode>(currentMode);
  const [speed, setSpeed] = useState<number>(0.8);

  const handleModeChange = (mode: RobotMode) => {
    setActiveMode(mode);
    onCommand("set_mode", { mode });
  };

  return (
    <SectionCard
      title="Robot Control Center"
      description="Remote navigation, harvesting, and emergency override"
      action={
        <Badge
          variant={activeMode === "autonomous" ? "info" : "secondary"}
          className="gap-1.5 capitalize"
        >
          <Gamepad2 className="h-3.5 w-3.5" />
          {activeMode} Mode
        </Badge>
      }
    >
      <div className="space-y-6">
        {/* Mode Selector & Speed Slider */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/40 bg-muted/20 p-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Mode:</span>
            <Button
              size="sm"
              variant={activeMode === "manual" ? "default" : "outline"}
              onClick={() => handleModeChange("manual")}
              disabled={isExecuting}
            >
              Manual
            </Button>
            <Button
              size="sm"
              variant={activeMode === "autonomous" ? "default" : "outline"}
              onClick={() => handleModeChange("autonomous")}
              disabled={isExecuting}
            >
              Autonomous
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">Speed:</span>
            <div className="flex items-center gap-1.5">
              {[0.4, 0.8, 1.2].map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={speed === s ? "secondary" : "ghost"}
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    setSpeed(s);
                    onCommand("set_speed", { speed: s });
                  }}
                >
                  {s} m/s
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Directional Cable Navigation D-Pad & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Cable Robot D-Pad */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-xs text-muted-foreground font-medium mb-1">
              Cable Navigation
            </span>
            <Button
              variant="outline"
              size="lg"
              className="w-24 h-12 gap-1.5"
              onClick={() => onCommand("move", { direction: "forward", speed })}
              disabled={isExecuting || activeMode === "autonomous"}
            >
              <ArrowUp className="h-5 w-5" />
              Forward
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="lg"
                className="w-24 h-12 gap-1.5"
                onClick={() => onCommand("move", { direction: "left", speed })}
                disabled={isExecuting || activeMode === "autonomous"}
              >
                <ArrowLeft className="h-5 w-5" />
                Left
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-24 h-12 gap-1.5"
                onClick={() => onCommand("stop", { reason: "user_pause" })}
                disabled={isExecuting}
              >
                <Square className="h-4 w-4 fill-current" />
                Pause
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-24 h-12 gap-1.5"
                onClick={() => onCommand("move", { direction: "right", speed })}
                disabled={isExecuting || activeMode === "autonomous"}
              >
                <ArrowRight className="h-5 w-5" />
                Right
              </Button>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-24 h-12 gap-1.5"
              onClick={() => onCommand("move", { direction: "backward", speed })}
              disabled={isExecuting || activeMode === "autonomous"}
            >
              <ArrowDown className="h-5 w-5" />
              Back
            </Button>
          </div>

          {/* Action Trigger & Emergency Stop */}
          <div className="flex flex-col justify-center space-y-3">
            <Button
              size="lg"
              variant="default"
              className="w-full h-14 text-base font-semibold gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
              onClick={() => onCommand("harvest", { intensity: "normal" })}
              disabled={isExecuting}
            >
              <Scissors className="h-5 w-5" />
              Trigger Harvest Plucker
            </Button>

            <Button
              size="lg"
              variant="destructive"
              className="w-full h-14 text-base font-bold gap-2 uppercase tracking-wide shadow-lg shadow-rose-950/20"
              onClick={() => onCommand("emergency_stop", { reason: "operator_override" })}
            >
              <Octagon className="h-6 w-6" />
              Emergency Stop (E-Stop)
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
