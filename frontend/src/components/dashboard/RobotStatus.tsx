import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/layout/SectionCard";
import type { RobotStatusData } from "@/types";
import { Battery, Gauge, MapPin, Thermometer, Weight } from "lucide-react";

interface RobotStatusProps {
  data: RobotStatusData;
}

function StatusRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Battery;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <span className="font-mono text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function RobotStatus({ data }: RobotStatusProps) {
  const connectionVariant =
    data.connection === "connected"
      ? "success"
      : data.connection === "degraded"
        ? "warning"
        : "danger";

  return (
    <SectionCard
      title="Robot Status"
      description={`Updated ${data.lastUpdate}`}
      action={
        <Badge variant={connectionVariant} className="capitalize">
          {data.connection}
        </Badge>
      }
    >
      <div className="grid grid-cols-2 gap-2">
        <StatusRow icon={Battery} label="Battery" value={`${data.battery}%`} />
        <StatusRow icon={Gauge} label="Speed" value={`${data.speed} m/s`} />
        <StatusRow
          icon={MapPin}
          label="Position"
          value={`${data.position.x}, ${data.position.y}`}
        />
        <StatusRow icon={Thermometer} label="Temp" value={`${data.temperature}°C`} />
        <StatusRow icon={Weight} label="Payload" value={`${data.payload} kg`} />
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5">
          <span className="text-xs text-muted-foreground">Mode</span>
          <Badge variant="info" className="capitalize">
            {data.mode}
          </Badge>
        </div>
      </div>
    </SectionCard>
  );
}
