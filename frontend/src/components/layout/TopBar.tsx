import React, { useState } from "react";
import { Octagon, Sprout } from "lucide-react";
import { SegmentedControl } from "../ui/SegmentedControl";
import { ConfirmModal } from "../ui/ConfirmModal";

export type OperationMode = "autonomous" | "manual";

export interface TopBarProps {
  mode: OperationMode;
  onModeChange: (mode: OperationMode) => void;
  isEstopActive: boolean;
  onTriggerEstop: () => void;
  onReleaseEstop: () => void;
  onSelectHome?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  mode,
  onModeChange,
  isEstopActive,
  onTriggerEstop,
  onReleaseEstop,
  onSelectHome,
}) => {
  const [showReleaseModal, setShowReleaseModal] = useState(false);

  const handleEstopClick = () => {
    if (isEstopActive) {
      // Release requires confirmation
      setShowReleaseModal(true);
    } else {
      // Trigger is immediate without confirmation
      onTriggerEstop();
    }
  };

  const handleConfirmRelease = () => {
    setShowReleaseModal(false);
    onReleaseEstop();
  };

  return (
    <>
      <header className="h-16 bg-[#0E1514] border-b border-[#26332F] px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Brand & Sector Identification */}
        <button
          type="button"
          onClick={onSelectHome}
          className="flex items-center gap-3.5 group text-left cursor-pointer focus:outline-none"
          title="Return to Overview"
        >
          <div className="w-8 h-8 rounded-[8px] bg-[#4ADE80]/15 border border-[#4ADE80]/30 flex items-center justify-center text-[#4ADE80] group-hover:border-[#4ADE80] transition-colors">
            <Sprout className="w-4 h-4 stroke-[1.8]" />
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-semibold text-base text-[#E6EDEB] tracking-tight group-hover:text-[#4ADE80] transition-colors">
              ARISE
            </span>
          </div>
        </button>

        {/* Mode Switch & E-STOP */}
        <div className="flex items-center gap-3">
          <SegmentedControl<OperationMode>
            size="sm"
            options={[
              { value: "autonomous", label: "Autonomous" },
              { value: "manual", label: "Manual" },
            ]}
            value={mode}
            onChange={onModeChange}
          />

          {/* E-STOP Button */}
          <button
            type="button"
            onClick={handleEstopClick}
            className={`h-9 px-3.5 rounded-[10px] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all duration-150 select-none ${
              isEstopActive
                ? "bg-[#F5A524] text-[#0E1514] shadow-md animate-pulse"
                : "bg-transparent border border-[#F5A524] text-[#F5A524] hover:bg-[#F5A524]/12 active:bg-[#F5A524]/20"
            }`}
            title={isEstopActive ? "Click to release Emergency Stop" : "Trigger Emergency Stop immediately"}
          >
            <Octagon className="w-4 h-4 stroke-[2]" />
            <span>{isEstopActive ? "E-STOP ENGAGED" : "E-STOP"}</span>
          </button>
        </div>
      </header>

      {/* Confirmation Modal to Release E-Stop */}
      <ConfirmModal
        isOpen={showReleaseModal}
        title="Release Emergency Stop?"
        description="Verify the cable robot workspace and tension lines are clear before re-enabling motion control motors."
        confirmLabel="Release E-Stop"
        cancelLabel="Keep Engaged"
        variant="danger"
        onConfirm={handleConfirmRelease}
        onCancel={() => setShowReleaseModal(false)}
      />
    </>
  );
};
