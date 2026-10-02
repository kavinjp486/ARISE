import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./button";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1514]/80 backdrop-blur-sm">
      <div className="bg-[#141D1C] border border-[#26332F] rounded-[14px] max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#F5A524]/12 border border-[#F5A524]/20 flex items-center justify-center text-[#F5A524] shrink-0">
              <AlertTriangle className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#E6EDEB]">{title}</h3>
              <p className="mt-1 text-sm text-[#8FA19C]">{description}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-[#8FA19C] hover:text-[#E6EDEB] p-1 rounded-[6px] hover:bg-[#1B2625] transition-colors"
          >
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="secondary" size="md" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            size="md"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
