import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { StatusPill } from "../../components/ui/StatusPill";
import { VideoOff, RefreshCw, Camera } from "lucide-react";
import { Button } from "../../components/ui/button";
import { TeaEstateStreetView } from "./TeaEstateStreetView";

export interface CameraViewCardProps {
  moveX: number; // Left / Right translation from manual controls
  moveZ: number; // Forward / Backward translation from manual controls
  depthZ: number; // Plucker depth
  className?: string;
}

export const CameraViewCard: React.FC<CameraViewCardProps> = ({
  moveX,
  moveZ,
  depthZ,
  className = "",
}) => {
  const [isCameraOnline, setIsCameraOnline] = useState(true);

  return (
    <Card
      title="Camera view"
      headerAction={
        <div className="flex items-center gap-2">
          <StatusPill
            label={isCameraOnline ? "3D Street View · Live" : "Camera offline"}
            variant={isCameraOnline ? "accent" : "neutral"}
            pulse={isCameraOnline}
          />

          {/* Quick toggle button to test offline/online honest states */}
          <button
            onClick={() => setIsCameraOnline(!isCameraOnline)}
            className="text-xs text-[#8FA19C] hover:text-[#E6EDEB] p-1 rounded hover:bg-[#1B2625] transition-colors"
            title="Toggle simulation of camera online/offline state"
          >
            {isCameraOnline ? (
              <Camera className="w-3.5 h-3.5" />
            ) : (
              <VideoOff className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      }
      className={className}
    >
      <div className="relative aspect-[16/9] w-full rounded-[10px] overflow-hidden bg-[#0C1312] border border-[#26332F] flex flex-col justify-between select-none">
        {isCameraOnline ? (
          /* True 3D Three.js Street View of Tea Plantation movable through tea rows */
          <TeaEstateStreetView
            moveX={moveX}
            moveZ={moveZ}
            depthZ={depthZ}
          />
        ) : (
          /* Honest Offline State */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0E1514]">
            <div className="w-10 h-10 rounded-[10px] bg-[#1B2625] border border-[#26332F] flex items-center justify-center text-[#8FA19C] mb-3">
              <VideoOff className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h4 className="text-sm font-semibold text-[#E6EDEB]">Camera offline</h4>
            <p className="mt-1 text-xs text-[#8FA19C] max-w-xs">
              Optical payload link disconnected. Reconnect camera to view 3D tea canopy stream.
            </p>
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              className="mt-3.5"
              onClick={() => setIsCameraOnline(true)}
            >
              Retry connection
            </Button>
          </div>
        )}
      </div>

      {/* Footer telemetry bar */}
      <div className="mt-3.5 pt-3 border-t border-[#26332F] flex items-center justify-between text-xs font-mono text-[#8FA19C]">
        <div className="flex items-center gap-3">
          <span>CANOPY CLEARANCE: <strong className="text-[#E6EDEB]">{Math.max(10, 50 - Math.round(depthZ * 0.4))} cm</strong></span>
          <span className="text-[#26332F]">|</span>
          <span>PLUCKER ELEVATION: <strong className="text-[#E6EDEB]">{Math.round(depthZ)}%</strong></span>
        </div>
        <span className="text-[#4ADE80]">3D EQUIRECTANGULAR ENGINE ACTIVE</span>
      </div>
    </Card>
  );
};
