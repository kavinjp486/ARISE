import { Card } from "../../components/ui/card";
import { StatusPill } from "../../components/ui/StatusPill";
import { Check, AlertTriangle } from "lucide-react";

export const ReferenceCard: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <Card
      title="Classification reference"
      className={className}
    >
      <div className="flex flex-col justify-between h-full space-y-4">
        {/* Class 1: Healthy */}
        <div className="p-3 bg-[#1B2625] border border-[#26332F] rounded-[10px] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#E6EDEB]">
              Two Leaves & A Bud
            </span>
            <StatusPill label="Healthy" variant="accent" />
          </div>
          <p className="text-xs text-[#8FA19C] leading-relaxed">
            Tender apical flush with soft internode stem. High catechin content and nominal moisture ratio for premium Orthodox tea processing.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#4ADE80] font-mono">
            <Check className="w-3.5 h-3.5" />
            <span>Target for robotic harvest cut</span>
          </div>
        </div>

        {/* Class 2: Diseased */}
        <div className="p-3 bg-[#1B2625] border border-[#26332F] rounded-[10px] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#E6EDEB]">
              Anthracnose / Chlorosis
            </span>
            <StatusPill label="Diseased" variant="alert" />
          </div>
          <p className="text-xs text-[#8FA19C] leading-relaxed">
            Brown necrotic lesions and marginal leaf chlorosis caused by Colletotrichum fungus. Reduces photosynthetic yield.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#F5A524] font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Isolate & flag for targeted spray</span>
          </div>
        </div>

        {/* Muted footnote */}
        <div className="pt-2 border-t border-[#26332F] text-[11px] text-[#8FA19C]/80 font-mono flex items-center justify-between">
          <span>TRA CERTIFIED STANDARDS</span>
          <span>DATASET: 12,400 ANNOTATIONS</span>
        </div>
      </div>
    </Card>
  );
};
