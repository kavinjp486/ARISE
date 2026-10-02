import React, { useState } from "react";
import { LiveFeedCard, type LiveDetectionResult } from "./LiveFeedCard";
import { ResultCard } from "./ResultCard";
import { ReferenceCard } from "./ReferenceCard";
import { ScanTableCard } from "./ScanTableCard";
import { StatusPill } from "../../components/ui/StatusPill";
import { Button } from "../../components/ui/button";
import { RefreshCw } from "lucide-react";

export const VisionAnalyticsView: React.FC = () => {
  const [isCameraOnline, setIsCameraOnline] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveResult, setLiveResult] = useState<LiveDetectionResult | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl font-semibold text-[#E6EDEB] tracking-tight">
            Leaf health detector
          </h1>
          <p className="text-xs text-[#8FA19C] mt-0.5">
            Real-time crop pathology and harvest readiness analysis via onboard optical sensor (tea_leaf_detector.py)
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <StatusPill
            label={isCameraOnline ? "Webcam Active · Live" : "Offline"}
            variant={isCameraOnline ? "accent" : "neutral"}
            pulse={isCameraOnline}
          />
          <Button
            variant="secondary"
            size="sm"
            icon={
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            }
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Row 1, Left: Live camera with real webcam stream (8 cols) */}
        <div className="lg:col-span-8">
          <LiveFeedCard
            isCameraOnline={isCameraOnline}
            onToggleCamera={() => setIsCameraOnline(!isCameraOnline)}
            onDetectionResult={setLiveResult}
            className="h-full"
          />
        </div>

        {/* Row 1, Right: Current leaf result connected to tea_leaf_detector.py (4 cols) */}
        <div className="lg:col-span-4">
          <ResultCard
            isCameraOnline={isCameraOnline}
            detectionResult={liveResult}
            className="h-full"
          />
        </div>

        {/* Row 2, Left: Classification reference (4 cols) */}
        <div className="lg:col-span-4">
          <ReferenceCard className="h-full" />
        </div>

        {/* Row 2, Right: Recent scans table (8 cols) */}
        <div className="lg:col-span-8">
          <ScanTableCard className="h-full" />
        </div>
      </div>
    </div>
  );
};
