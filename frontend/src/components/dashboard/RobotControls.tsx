import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/layout/SectionCard";
import type { ControlAction } from "@/types";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Gamepad2,
  Octagon,
  Scissors,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface RobotControlsProps {
  controls: ControlAction[];
}

const iconMap: Record<string, LucideIcon> = {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Scissors,
  Octagon,
};

export function RobotControls({ controls }: RobotControlsProps) {
  return (
    <SectionCard
      title="Robot Controls"
      description="Manual override — commands sent via REST API"
      action={
        <Badge variant="secondary" className="gap-1.5">
          <Gamepad2 className="h-3 w-3" />
          Manual Mode
        </Badge>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {controls.map((control) => {
          const Icon = iconMap[control.icon];
          return (
            <Button
              key={control.id}
              variant={control.variant}
              className="h-auto flex-col gap-2 py-4"
              disabled
              aria-label={control.label}
            >
              {Icon && <Icon className="h-5 w-5" />}
              <span className="text-xs">{control.label}</span>
            </Button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Controls are disabled until backend integration is complete
      </p>
    </SectionCard>
  );
}
