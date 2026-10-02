import React, { useState } from "react";
import { FieldMapCard } from "./FieldMapCard";
import { SideElevationCard } from "./SideElevationCard";
import { CameraViewCard } from "./CameraViewCard";
import { TeleopCard } from "./TeleopCard";
import type { OperationMode } from "../../components/layout/TopBar";
import { ApiService } from "../../services/api";

export interface DigitalTwinViewProps {
  mode: OperationMode;
  isEstopActive: boolean;
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({
  mode,
  isEstopActive,
}) => {
  const [posX, setPosX] = useState(48); // 0 - 100%
  const [posY, setPosY] = useState(52); // 0 - 100%
  const [depthZ, setDepthZ] = useState(30); // 0 - 100%
  const [shootsCount, setShootsCount] = useState(24);

  // 3D Camera Translation units in plantation space
  const [camMoveX, setCamMoveX] = useState(0); // Sideways left/right across rows
  const [camMoveZ, setCamMoveZ] = useState(0); // Forward/backward through tea leaves

  const isAutonomous = mode === "autonomous" || isEstopActive;

  // Handle movement from D-pad, keyboard or waypoint click
  const handleMove = (deltaX: number, deltaY: number) => {
    if (isAutonomous) return;

    // Update Field map coordinates
    setPosX((prev) => Math.min(95, Math.max(5, prev + deltaX)));
    setPosY((prev) => Math.min(95, Math.max(5, prev + deltaY)));

    // Move camera in 3D plantation space:
    // deltaY < 0 (W/Up) moves forward 10m through the tea leaves!
    // deltaY > 0 (S/Down) moves backward 10m!
    if (deltaY < 0) {
      setCamMoveZ((prev) => prev + 1);
    } else if (deltaY > 0) {
      setCamMoveZ((prev) => prev - 1);
    }

    // deltaX (A/D) turns camera view sideways left/right!
    if (deltaX !== 0) {
      setCamMoveX((prev) => prev + (deltaX > 0 ? 1 : -1));
    }

    // Send control command to backend asynchronously
    ApiService.sendCommand("MOVE", {
      x: posX + deltaX,
      y: posY + deltaY,
    }).catch(() => {});
  };

  const handleCellClick = (row: number, col: number) => {
    if (isAutonomous) return;
    const targetX = Math.round(((col + 0.5) / 10) * 100);
    const targetY = Math.round(((row + 0.5) / 8) * 100);
    setPosX(targetX);
    setPosY(targetY);

    // Sync 3D camera translation with clicked field sector
    setCamMoveX((col - 5) * 8);
    setCamMoveZ((row - 4) * 8);

    ApiService.sendCommand("GOTO", { x: targetX, y: targetY }).catch(() => {});
  };

  const handlePluck = () => {
    if (isAutonomous) return;
    setShootsCount((prev) => prev + 1);
    ApiService.sendCommand("PLUCK", { depth: depthZ }).catch(() => {});
  };

  const handleDepthChange = (newDepth: number) => {
    if (isAutonomous) return;
    setDepthZ(newDepth);
    ApiService.sendCommand("SET_DEPTH", { depth: newDepth }).catch(() => {});
  };

  return (
    <div className="space-y-6">
      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Row 1, Left: Field map (8 cols) */}
        <div className="lg:col-span-8">
          <FieldMapCard
            posX={posX}
            posY={posY}
            onCellClick={handleCellClick}
            className="h-full"
          />
        </div>

        {/* Row 1, Right: Side elevation (4 cols) */}
        <div className="lg:col-span-4">
          <SideElevationCard
            depthZ={depthZ}
            shootsCount={shootsCount}
            className="h-full"
          />
        </div>

        {/* Row 2, Left: 3D Three.js Tea Plantation Street View Camera (7 cols) */}
        <div className="lg:col-span-7">
          <CameraViewCard
            moveX={camMoveX}
            moveZ={camMoveZ}
            depthZ={depthZ}
            className="h-full"
          />
        </div>

        {/* Row 2, Right: Manual controls (5 cols) */}
        <div className="lg:col-span-5">
          <TeleopCard
            isAutonomous={isAutonomous}
            posX={posX}
            posY={posY}
            depthZ={depthZ}
            onMove={handleMove}
            onDepthChange={handleDepthChange}
            onPluck={handlePluck}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};
