import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { StatusPill } from "../../components/ui/StatusPill";
import { Button } from "../../components/ui/button";
import { ShieldCheck, AlertCircle, BookmarkCheck } from "lucide-react";
import type { LiveDetectionResult } from "./LiveFeedCard";

export interface ResultCardProps {
  isCameraOnline: boolean;
  detectionResult?: LiveDetectionResult | null;
  className?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  isCameraOnline,
  detectionResult,
  className = "",
}) => {
  const [markedForTreatment, setMarkedForTreatment] = useState(false);

  const hasLeaf =
    Boolean(isCameraOnline &&
    detectionResult &&
    detectionResult.status !== "NO_LEAF_DETECTED" &&
    detectionResult.bounding_box.width > 0);

  const isHealthy = hasLeaf && detectionResult?.status === "HEALTHY";
  const isDiseased = hasLeaf && (detectionResult?.status === "DISEASED" || detectionResult?.status === "WARNING");

  const diagnosisName = !isCameraOnline
    ? "Sensor offline"
    : !hasLeaf
    ? "Searching for leaf..."
    : isHealthy
    ? "Healthy Tea Leaf"
    : detectionResult?.disease || "Chlorosis Detected";

  const statusLabel = !isCameraOnline
    ? "Offline"
    : !hasLeaf
    ? "Standby"
    : isHealthy
    ? "Healthy"
    : "Diseased";

  const statusVariant = !isCameraOnline || !hasLeaf
    ? "neutral"
    : isHealthy
    ? "accent"
    : "alert";

  const confidenceValue = hasLeaf ? detectionResult?.confidence ?? null : null;
  const defectArea = hasLeaf
    ? `${detectionResult?.yellow_percentage ?? 0}%`
    : "–";
  const bboxSize = hasLeaf
    ? `${detectionResult?.bounding_box.width} × ${detectionResult?.bounding_box.height} px`
    : "–";

  const recommendationText = !isCameraOnline
    ? "Webcam feed disconnected. Click Connect webcam to start detection."
    : !hasLeaf
    ? "Awaiting foliage entry into optical focal plane. Hold a tea leaf in front of the lens."
    : detectionResult?.recommendation ||
      (isHealthy
        ? "Optimal flush health detected — Ready for selective plucking."
        : "Chlorosis yellowing detected — Apply organic fungicide spray.");

  return (
    <Card
      title="Current leaf result"
      headerAction={
        <StatusPill label={statusLabel} variant={statusVariant} />
      }
      className={className}
    >
      <div className="flex flex-col justify-between h-full space-y-5">
        {/* Top: Diagnosis Name */}
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#8FA19C] block mb-1">
            Diagnosis (tea_leaf_detector.py)
          </span>
          <h2 className="text-xl font-semibold text-[#E6EDEB] tracking-tight">
            {diagnosisName}
          </h2>
        </div>

        {/* Confidence Display Mono + Thin Bar */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs text-[#8FA19C]">Model confidence</span>
            <span className="font-mono text-2xl font-semibold text-[#E6EDEB] tabular-nums">
              {confidenceValue !== null ? `${confidenceValue}%` : "–"}
            </span>
          </div>

          <div className="w-full bg-[#1B2625] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                confidenceValue === null
                  ? "bg-[#26332F]"
                  : isHealthy
                  ? "bg-[#4ADE80]"
                  : "bg-[#F5A524]"
              }`}
              style={{ width: `${confidenceValue || 0}%` }}
            />
          </div>
        </div>

        {/* Two Metric Tiles: Defect area & Bounding box */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1B2625] border border-[#26332F] rounded-[8px] p-3">
            <span className="text-[11px] font-medium text-[#8FA19C] uppercase tracking-wider block">
              Yellow area
            </span>
            <span className="font-mono text-base font-semibold text-[#E6EDEB] mt-1 block tabular-nums">
              {defectArea}
            </span>
          </div>

          <div className="bg-[#1B2625] border border-[#26332F] rounded-[8px] p-3">
            <span className="text-[11px] font-medium text-[#8FA19C] uppercase tracking-wider block">
              Bounding box
            </span>
            <span className="font-mono text-base font-semibold text-[#E6EDEB] mt-1 block tabular-nums">
              {bboxSize}
            </span>
          </div>
        </div>

        {/* Recommendation Block (3px left bar + action button) */}
        <div
          className={`border rounded-[10px] p-3.5 bg-[#1B2625] transition-colors ${
            !hasLeaf
              ? "border-l-[3px] border-[#26332F] border-l-[#8FA19C]"
              : isHealthy
              ? "border-l-[3px] border-[#26332F] border-l-[#4ADE80]"
              : "border-l-[3px] border-[#26332F] border-l-[#F5A524]"
          }`}
        >
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0">
              {isDiseased ? (
                <AlertCircle className="w-4 h-4 text-[#F5A524]" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
              )}
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-[#E6EDEB] block">
                Agronomic recommendation
              </span>
              <p className="mt-0.5 text-xs text-[#8FA19C] leading-relaxed">
                {recommendationText}
              </p>
            </div>
          </div>

          {isDiseased && (
            <div className="mt-3 pt-2.5 border-t border-[#26332F] flex justify-end">
              <Button
                variant={markedForTreatment ? "secondary" : "danger"}
                size="sm"
                icon={<BookmarkCheck className="w-3.5 h-3.5" />}
                onClick={() => setMarkedForTreatment(!markedForTreatment)}
              >
                {markedForTreatment
                  ? "Marked for fungicide treatment"
                  : "Mark sector for treatment"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
