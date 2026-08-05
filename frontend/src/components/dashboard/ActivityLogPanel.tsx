import { SectionCard } from "@/components/layout/SectionCard";
import { Badge } from "@/components/ui/badge";
import type { ActivityLogEntry } from "@/types";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

interface ActivityLogPanelProps {
  logs: ActivityLogEntry[];
}

function LogIcon({ level }: { level: ActivityLogEntry["level"] }) {
  switch (level) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-400" />;
    case "error":
      return <XCircle className="h-4 w-4 text-rose-400" />;
    default:
      return <Info className="h-4 w-4 text-sky-400" />;
  }
}

export function ActivityLogPanel({ logs }: ActivityLogPanelProps) {
  return (
    <SectionCard
      title="Live System Feed"
      description="Real-time telemetry and control logs"
      action={<Badge variant="outline">{logs.length} events</Badge>}
    >
      <div className="h-[280px] overflow-y-auto space-y-2 pr-1 font-mono text-xs">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-2.5 rounded-md border border-border/40 bg-muted/20 p-2.5 transition-colors hover:bg-muted/40"
          >
            <div className="mt-0.5 shrink-0">
              <LogIcon level={log.level} />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="font-semibold text-foreground">{log.timestamp}</span>
                <span className="capitalize text-[10px] opacity-75">{log.level}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{log.message}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
