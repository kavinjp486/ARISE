import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/layout/SectionCard";
import type { PredictionData, PredictionStatus } from "@/types";
import { Brain, CheckCircle2, AlertTriangle, Leaf } from "lucide-react";

interface AIPredictionPanelProps {
  data: PredictionData;
}

const statusConfig: Record<
  PredictionStatus,
  { label: string; variant: "success" | "warning" | "danger"; icon: typeof Leaf }
> = {
  healthy: { label: "Healthy", variant: "success", icon: CheckCircle2 },
  disease: { label: "Disease Detected", variant: "danger", icon: AlertTriangle },
  ready_harvest: { label: "Ready to Harvest", variant: "success", icon: Leaf },
};

export function AIPredictionPanel({ data, prediction }: AIPredictionPanelProps) {
  const item = data || prediction || {
    primaryLabel: "Ready for Harvest",
    confidence: 0.92,
    status: "ready_harvest" as const,
    recommendation: "Proceed with selective plucking on rows 14–16.",
    detectedIssues: ["Moisture level optimal"],
    lastScan: "2026-08-05 21:45:00",
  };

  const config = statusConfig[item.status] || statusConfig.ready_harvest;
  const StatusIcon = config.icon;
  const confidencePercent = Math.round(item.confidence * 100);

  return (
    <SectionCard
      title="AI Prediction Panel"
      description={`Last scan: ${item.lastScan}`}
      action={
        <Badge variant="info" className="gap-1.5">
          <Brain className="h-3 w-3" />
          ML Model
        </Badge>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-foreground">{item.primaryLabel}</p>
            <Badge variant={config.variant} className="mt-2 gap-1.5">
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </Badge>
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-bold text-accent">{confidencePercent}%</p>
            <p className="text-xs text-muted-foreground">Confidence</p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Model confidence</span>
            <span>{confidencePercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidencePercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-accent"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Recommendation
          </p>
          <p className="mt-1 text-sm text-foreground">{item.recommendation}</p>
        </div>

        <ul className="space-y-1.5">
          {item.detectedIssues.map((issue) => (
            <li key={issue} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {issue}
            </li>
          ))}
        </ul>
      </div>
    </SectionCard>
  );
}
