import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/layout/SectionCard";
import type { CameraFeedData } from "@/types";
import { Camera, Circle } from "lucide-react";

interface LiveCameraFeedProps {
  data: CameraFeedData;
}

export function LiveCameraFeed({ data }: LiveCameraFeedProps) {
  return (
    <SectionCard
      title="Live Camera Feed"
      description={data.label}
      noPadding
      action={
        <div className="flex items-center gap-2">
          {data.isLive && (
            <Badge variant="danger" className="gap-1.5">
              <Circle className="h-2 w-2 fill-current" />
              LIVE
            </Badge>
          )}
          <Badge variant="secondary">{data.resolution}</Badge>
          <Badge variant="secondary">{data.fps} FPS</Badge>
        </div>
      }
    >
      <div className="relative flex h-full min-h-[280px] items-center justify-center overflow-hidden bg-muted/40 xl:min-h-[372px]">
        {/* Placeholder feed — replaced with real stream later */}
        <div className="scanline-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgb(16_185_129/0.08),transparent_50%,rgb(56_189_248/0.06))]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 flex flex-col items-center gap-3 text-muted-foreground"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card/80">
            <Camera className="h-7 w-7" />
          </div>
          <p className="text-sm font-medium text-foreground">Camera feed placeholder</p>
          <p className="max-w-xs text-center text-xs">
            ESP32 camera stream will connect here via backend proxy
          </p>
        </motion.div>

        {/* Crosshair overlay for industrial feel */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border border-accent/40" />
          <div className="absolute h-px w-full bg-accent/10" />
          <div className="absolute h-full w-px bg-accent/10" />
        </div>

        <div className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 font-mono text-xs text-accent">
          X: 142.5 &nbsp; Y: 87.3
        </div>
      </div>
    </SectionCard>
  );
}
