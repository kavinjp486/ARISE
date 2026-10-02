import React, { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Minus, RotateCcw, Navigation, Info } from "lucide-react";

export interface TeaEstateStreetViewProps {
  moveX: number; // Left / Right trigger from manual controls (A/D)
  moveZ: number; // Forward / Backward trigger from manual controls (W/S)
  depthZ: number; // Plucker depth (altitude)
}

const STATIONS = [
  "/images/tea_row_0m.jpg",
  "/images/tea_row_10m.jpg",
  "/images/tea_row_20m.jpg",
];

export const TeaEstateStreetView: React.FC<TeaEstateStreetViewProps> = ({
  moveX,
  moveZ,
  depthZ,
}) => {
  // Station index (0 = 0m, 1 = 10m, 2 = 20m)
  const [stationIdx, setStationIdx] = useState(0);
  const [distanceMeters, setDistanceMeters] = useState(0);

  // Google Street View camera animation state
  const [isWarping, setIsWarping] = useState(false);
  const [warpDirection, setWarpDirection] = useState<"forward" | "backward">("forward");

  // Free-look Pan & Tilt (in pixels)
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [zoom, setZoom] = useState(1.0); // 1.0 to 1.8
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const prevMoveZRef = useRef(moveZ);
  const prevMoveXRef = useRef(moveX);

  // Calculate compass heading (0° - 359°)
  const headingDeg = Math.round(((((panX / 300) * 180 + 248) % 360) + 360) % 360);

  const getCardinal = (deg: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(deg / 45) % 8];
  };

  // Google Street View 10-meter forward leap animation
  const stepForward = useCallback(() => {
    setWarpDirection("forward");
    setIsWarping(true);

    setTimeout(() => {
      setStationIdx((prev) => (prev + 1) % STATIONS.length);
      setDistanceMeters((prev) => prev + 10);
      setIsWarping(false);
    }, 280);
  }, []);

  // Google Street View 10-meter backward glide animation
  const stepBackward = useCallback(() => {
    setWarpDirection("backward");
    setIsWarping(true);

    setTimeout(() => {
      setStationIdx((prev) => (prev - 1 + STATIONS.length) % STATIONS.length);
      setDistanceMeters((prev) => Math.max(0, prev - 10));
      setIsWarping(false);
    }, 280);
  }, []);

  // React to manual controls (moveZ and moveX changes)
  useEffect(() => {
    // When moveZ increases (W / Up pressed), move forward 10m!
    if (moveZ > prevMoveZRef.current) {
      stepForward();
    } else if (moveZ < prevMoveZRef.current) {
      stepBackward();
    }
    prevMoveZRef.current = moveZ;
  }, [moveZ, stepForward, stepBackward]);

  useEffect(() => {
    // When moveX changes (A / D pressed), turn the camera view sideways!
    const delta = moveX - prevMoveXRef.current;
    if (delta !== 0) {
      setPanX((prev) => Math.max(-250, Math.min(250, prev - delta * 20)));
    }
    prevMoveXRef.current = moveX;
  }, [moveX]);

  // Mouse drag free-look
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPanX(Math.max(-250, Math.min(250, newX)));
      setPanY(Math.max(-80, Math.min(80, newY)));
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panX,
        y: e.touches[0].clientY - panY,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newX = e.touches[0].clientX - dragStart.x;
    const newY = e.touches[0].clientY - dragStart.y;
    setPanX(Math.max(-250, Math.min(250, newX)));
    setPanY(Math.max(-80, Math.min(80, newY)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Scroll wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.max(1.0, Math.min(1.8, prev - e.deltaY * 0.0015)));
  };

  const handleReset = () => {
    setPanX(0);
    setPanY(0);
    setZoom(1.0);
  };

  // Plucker depth altitude offset: lowering Z moves camera slightly down into canopy
  const altitudeOffset = (depthZ / 100) * 35;

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className={`relative w-full h-full overflow-hidden bg-[#0C1312] select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* Google Street View Sharp Panoramic Stage */}
      <div
        className={`absolute inset-0 overflow-hidden ${
          isWarping
            ? "transition-all duration-[280ms] ease-out"
            : isDragging
            ? "transition-none"
            : "transition-transform duration-200 ease-out"
        }`}
        style={{
          transform: isWarping
            ? warpDirection === "forward"
              ? `scale(1.4) translate3d(${panX * 0.5}px, ${panY + 25}px, 0)`
              : `scale(0.85) translate3d(${panX * 0.5}px, ${panY - 15}px, 0)`
            : `scale(${zoom}) translate3d(${panX}px, ${panY + altitudeOffset}px, 0)`,
          transformOrigin: "center 55%",
          filter: isWarping ? "blur(1.5px)" : "none",
        }}
      >
        <img
          src={STATIONS[stationIdx]}
          alt="Tea Plantation Street View"
          className="w-full h-full object-cover scale-110"
          draggable={false}
        />
      </div>

      {/* Street View Top-Left Location Breadcrumb Badge */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none">
        <div className="bg-[#0E1514]/85 border border-[#26332F] rounded-[8px] px-3 py-2 backdrop-blur-md text-xs shadow-md">
          <div className="flex items-center gap-2 text-[#E6EDEB] font-semibold tracking-tight">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse-dot" />
            <span>Tea Plantation · Canopy Aisle</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-[#8FA19C]">
            <span className="text-[#4ADE80] font-semibold">
              Position: +{distanceMeters} m
            </span>
            <span className="text-[#26332F]">·</span>
            <span>Elevation: {(1.8 - (depthZ / 100) * 0.8).toFixed(1)} m</span>
            <span className="text-[#26332F]">·</span>
            <span className="text-[#E6EDEB]">
              Heading {headingDeg}° {getCardinal(headingDeg)}
            </span>
          </div>
        </div>
      </div>

      {/* Street View Top-Right Compass Widget (Click resets to North) */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={handleReset}
          className="w-10 h-10 rounded-full bg-[#0E1514]/85 border border-[#26332F] hover:border-[#4ADE80]/40 flex items-center justify-center text-[#E6EDEB] shadow-md backdrop-blur-md transition-all group"
          title="Click to reset orientation to North"
        >
          <div
            className="w-6 h-6 flex items-center justify-center transition-transform duration-150"
            style={{ transform: `rotate(${-headingDeg}deg)` }}
          >
            <Navigation className="w-4 h-4 fill-[#F5A524] text-[#F5A524]" />
          </div>
        </button>
      </div>

      {/* Google Street View Zoom & Reset Controls */}
      <div className="absolute bottom-4 right-3 z-20 flex flex-col items-center gap-1.5">
        <div className="bg-[#0E1514]/85 border border-[#26332F] rounded-[8px] overflow-hidden backdrop-blur-md shadow-md flex flex-col">
          <button
            onClick={() => setZoom((prev) => Math.min(1.8, prev + 0.15))}
            disabled={zoom >= 1.8}
            className="w-8 h-8 flex items-center justify-center text-[#8FA19C] hover:text-[#E6EDEB] hover:bg-[#1B2625] disabled:opacity-30 transition-colors"
            title="Zoom In (+)"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="w-full h-px bg-[#26332F]" />
          <button
            onClick={() => setZoom((prev) => Math.max(1.0, prev - 0.15))}
            disabled={zoom <= 1.0}
            className="w-8 h-8 flex items-center justify-center text-[#8FA19C] hover:text-[#E6EDEB] hover:bg-[#1B2625] disabled:opacity-30 transition-colors"
            title="Zoom Out (-)"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleReset}
          className="w-8 h-8 rounded-[8px] bg-[#0E1514]/85 border border-[#26332F] flex items-center justify-center text-[#8FA19C] hover:text-[#E6EDEB] hover:bg-[#1B2625] backdrop-blur-md shadow-md transition-colors"
          title="Reset Pan & Zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Google Street View Forward / Backward Navigation Notice */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
        <div className="bg-[#0E1514]/85 border border-[#26332F] rounded-[6px] px-2.5 py-1 text-[11px] text-[#8FA19C] font-mono flex items-center gap-1.5 backdrop-blur-sm">
          <Info className="w-3 h-3 text-[#4ADE80]" />
          <span>Press W to move forward 10m down row · S backward · A/D look sideways</span>
        </div>
      </div>
    </div>
  );
};
