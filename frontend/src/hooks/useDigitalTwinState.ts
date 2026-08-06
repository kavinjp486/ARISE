import { useCallback, useState } from "react";
import type { CellData } from "@/types";

const GW = 10;
const GH = 8;
const TOTAL_CELLS = GW * GH;

function createInitialCells(): CellData[] {
  const diseaseSet = new Set<number>([14, 27, 43, 58, 62]);
  return Array.from({ length: TOTAL_CELLS }, (_, i) => ({
    id: i,
    row: Math.floor(i / GW),
    col: i % GW,
    status: diseaseSet.has(i) ? "disease" : "pending",
  }));
}

export function useDigitalTwinState() {
  const [posX, setPosX] = useState(50); // 0% (Left) to 100% (Right)
  const [posY, setPosY] = useState(50); // 0% (Top/Far) to 100% (Bottom/Near)
  const [posZ, setPosZ] = useState(30); // 0% (Retracted Top) to 100% (Canopy Pluck Depth)
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [cells, setCells] = useState<CellData[]>(createInitialCells);
  const [leafCount, setLeafCount] = useState(24);
  const [speedProfile, setSpeedProfile] = useState<"normal" | "turbo">("normal");
  const [battery] = useState(88);
  const [motorTemp] = useState(38);

  // Derive current row and column from posX and posY
  const col = Math.min(GW - 1, Math.max(0, Math.floor((posX / 100) * GW)));
  const row = Math.min(GH - 1, Math.max(0, Math.floor((posY / 100) * GH)));
  const currentCellId = row * GW + col;

  // Move robot payload manually via D-Pad or Sliders
  const movePayload = useCallback((direction: "up" | "down" | "left" | "right") => {
    const step = speedProfile === "turbo" ? 12 : 6;
    setPosX((prevX) => {
      if (direction === "left") return Math.max(0, prevX - step);
      if (direction === "right") return Math.min(100, prevX + step);
      return prevX;
    });
    setPosY((prevY) => {
      if (direction === "up") return Math.max(0, prevY - step);
      if (direction === "down") return Math.min(100, prevY + step);
      return prevY;
    });
  }, [speedProfile]);

  const setCoordinates = useCallback((x: number, y: number) => {
    setPosX(Math.max(0, Math.min(100, x)));
    setPosY(Math.max(0, Math.min(100, y)));
  }, []);

  const setArmDepthZ = useCallback((z: number) => {
    setPosZ(Math.max(0, Math.min(100, z)));
  }, []);

  // Trigger Harvest Plucker Actuator
  const triggerHarvest = useCallback(() => {
    setIsHarvesting(true);
    setLeafCount((c) => Math.min(200, c + 3));

    // Mark current grid cell as harvested
    setCells((prevCells) =>
      prevCells.map((cell) => {
        if (cell.id === currentCellId && cell.status !== "disease") {
          return { ...cell, status: "harvested" };
        }
        return cell;
      })
    );

    // Auto turn off harvesting pulse after 1.5s
    setTimeout(() => {
      setIsHarvesting(false);
    }, 1500);
  }, [currentCellId]);

  return {
    posX,
    posY,
    posZ,
    row,
    col,
    currentCellId,
    isHarvesting,
    cells,
    leafCount,
    speedProfile,
    battery,
    motorTemp,
    setSpeedProfile,
    movePayload,
    setCoordinates,
    setArmDepthZ,
    triggerHarvest,
  };
}

export type DigitalTwinState = ReturnType<typeof useDigitalTwinState>;
