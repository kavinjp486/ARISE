import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Compass, Cpu, Layers, Navigation, Radio, Zap } from "lucide-react";
import type { CellData } from "@/types";

const GW = 10;
const GH = 8;
const TOTAL_CELLS = GW * GH;

// Generate snake path for smooth continuous payload traversal
function generateSnakePath() {
  const path: { r: number; c: number }[] = [];
  for (let r = 0; r < GH; r++) {
    if (r % 2 === 0) {
      for (let c = 0; c < GW; c++) path.push({ r, c });
    } else {
      for (let c = GW - 1; c >= 0; c--) path.push({ r, c });
    }
  }
  return path;
}

const PATH = generateSnakePath();

function createInitialTeaGrid(): CellData[] {
  const diseaseSet = new Set<number>([14, 27, 43, 58, 62]);
  return Array.from({ length: TOTAL_CELLS }, (_, i) => ({
    id: i,
    row: Math.floor(i / GW),
    col: i % GW,
    status: diseaseSet.has(i) ? "disease" : "pending",
  }));
}

export function AerialViewPanel() {
  const [cells, setCells] = useState<CellData[]>(createInitialTeaGrid);
  const [pathIndex, setPathIndex] = useState(0);
  const [isAutoNav, setIsAutoNav] = useState(true);

  // Active target cell coordinates
  const currentPos = PATH[pathIndex];

  // Calculate percentage positions for Framer Motion payload and cable tethers
  // Map column (0..9) to 8%..92% X, and row (0..7) to 10%..90% Y
  const posXPercent = ((currentPos.c + 0.5) / GW) * 84 + 8;
  const posYPercent = ((currentPos.r + 0.5) / GH) * 80 + 10;

  // Automated traversal loop simulating industrial scanning & harvesting
  useEffect(() => {
    if (!isAutoNav) return;

    const interval = setInterval(() => {
      setPathIndex((prevIndex) => {
        const nextIdx = (prevIndex + 1) % PATH.length;
        const targetPos = PATH[nextIdx];
        const cellId = targetPos.r * GW + targetPos.c;

        setCells((prevCells) =>
          prevCells.map((cell) => {
            if (cell.id === cellId && cell.status !== "disease") {
              return { ...cell, status: "harvested" };
            }
            return cell;
          })
        );

        return nextIdx;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isAutoNav]);

  const harvestedCount = cells.filter((c) => c.status === "harvested").length;
  const diseaseCount = cells.filter((c) => c.status === "disease").length;
  const progressPct = Math.round((harvestedCount / TOTAL_CELLS) * 100);

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#04080F] border border-cyan-500/20 rounded-2xl overflow-hidden flex flex-col font-sans select-none shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      {/* Top Header / Viewport HUD Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 backdrop-blur-md z-30">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-orb font-black text-xs text-cyan-400 tracking-wider">
            VIEWPORT A — 🛰️ AERIAL DIGITAL TWIN (10×8 GRID)
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>COVERAGE: {progressPct}%</span>
          </div>

          <button
            onClick={() => setIsAutoNav(!isAutoNav)}
            className={`btn-press px-2.5 py-0.5 rounded font-orb text-[10px] font-bold border transition-colors ${
              isAutoNav
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                : "bg-white/5 text-white/40 border-white/10"
            }`}
          >
            {isAutoNav ? "● AUTO MESH SWEEP" : "○ MANUAL FREEZE"}
          </button>
        </div>
      </div>

      {/* Main Plantation Field Viewport */}
      <div className="relative flex-1 w-full bg-[#050B14] p-4 flex flex-col justify-center items-center overflow-hidden">
        {/* Synthetic Tactical Grid Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(#00F0FF 1px, transparent 1px), linear-gradient(to right, rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: "32px 32px, 32px 32px, 32px 32px",
          }}
        />

        {/* 4 Corner Cable Suspension Towers */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-1 rounded shadow-lg z-20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>TOWER 01 (NW)</span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-1 rounded shadow-lg z-20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>TOWER 02 (NE)</span>
        </div>

        <div className="absolute bottom-12 left-3 flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-1 rounded shadow-lg z-20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>TOWER 03 (SW)</span>
        </div>

        <div className="absolute bottom-12 right-3 flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-1 rounded shadow-lg z-20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>TOWER 04 (SE)</span>
        </div>

        {/* Dynamic Quad-Cable Suspension Lines (SVG Layer) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {/* Cable to NW Tower 01 */}
          <line
            x1="20"
            y1="20"
            x2={`${posXPercent}%`}
            y2={`${posYPercent}%`}
            stroke="#00F0FF"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.5"
          />
          {/* Cable to NE Tower 02 */}
          <line
            x1="98%"
            y1="20"
            x2={`${posXPercent}%`}
            y2={`${posYPercent}%`}
            stroke="#00F0FF"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.5"
          />
          {/* Cable to SW Tower 03 */}
          <line
            x1="20"
            y1="88%"
            x2={`${posXPercent}%`}
            y2={`${posYPercent}%`}
            stroke="#00F0FF"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.5"
          />
          {/* Cable to SE Tower 04 */}
          <line
            x1="98%"
            y1="88%"
            x2={`${posXPercent}%`}
            y2={`${posYPercent}%`}
            stroke="#00F0FF"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.5"
          />
        </svg>

        {/* 10×8 Tea Plantation Grid */}
        <div className="relative z-10 grid grid-cols-10 gap-1.5 w-full max-w-4xl p-2 bg-black/40 border border-white/5 rounded-xl backdrop-blur-sm">
          {cells.map((cell) => {
            const isActiveTarget =
              cell.row === currentPos.r && cell.col === currentPos.c;

            return (
              <div
                key={cell.id}
                className={`relative aspect-square rounded-md flex flex-col items-center justify-center transition-all duration-500 border ${
                  cell.status === "harvested"
                    ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(0,168,107,0.2)]"
                    : cell.status === "disease"
                    ? "bg-red-500/20 border-red-500/60 text-red-400 animate-pulse shadow-[0_0_12px_rgba(255,60,60,0.3)]"
                    : "bg-white/[0.02] border-white/10 text-white/20"
                }`}
              >
                {/* Active Target Glowing Reticle Frame */}
                {isActiveTarget && (
                  <motion.div
                    layoutId="activeTargetRing"
                    className="absolute -inset-1 rounded-lg border-2 border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(0,240,255,0.6)] z-20 pointer-events-none"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                  >
                    {/* Corner Reticle Accents */}
                    <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-300" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-300" />
                    <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-300" />
                    <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-300" />
                  </motion.div>
                )}

                {/* Plant Canopy Icon / Status Indicator */}
                <span className="text-xs font-mono font-bold">
                  {cell.status === "harvested" ? (
                    "✓"
                  ) : cell.status === "disease" ? (
                    "⚠"
                  ) : (
                    <span className="text-[9px] opacity-40">
                      {cell.row + 1}.{cell.col + 1}
                    </span>
                  )}
                </span>

                {/* Subtle Tea Bush Canopy Pulse Ring */}
                <div className="absolute inset-1 rounded bg-emerald-500/5 opacity-40 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* ANIMATED ROBOT PAYLOAD CARRIAGE (Framer Motion Digital Twin Node) */}
        <motion.div
          className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          animate={{
            left: `${posXPercent}%`,
            top: `${posYPercent}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
          }}
        >
          <div className="relative flex items-center justify-center">
            {/* Radar Pulse Effect */}
            <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-cyan-400/20 opacity-75" />
            <span className="absolute inline-flex h-12 w-12 rounded-full bg-emerald-500/20 border border-cyan-400/40" />

            {/* Robot Physical Box Body */}
            <div className="relative flex h-11 w-14 items-center justify-center rounded-lg border-2 border-cyan-400 bg-[#040C18] shadow-[0_0_25px_rgba(0,240,255,0.6)]">
              <Navigation className="h-5 w-5 text-cyan-400 transform rotate-45" />

              {/* Status LED */}
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
            </div>

            {/* Real-Time Telemetry Badge below Payload */}
            <div className="absolute -bottom-7 whitespace-nowrap px-2 py-0.5 rounded bg-black/90 border border-cyan-500/40 font-mono text-[9px] text-cyan-400 font-bold tracking-tight shadow-lg">
              PAYLOAD [ROW {currentPos.r + 1} · COL {currentPos.c + 1}]
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Status Legend & Coordinates Dock */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-black/80 border-t border-white/10 text-xs font-mono text-white/50 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-cyan-400" />
            <span>
              Target: Row {currentPos.r + 1}, Col {currentPos.c + 1}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Zap className="h-3.5 w-3.5" />
            <span>Harvested: {harvestedCount} Zones</span>
          </div>
          {diseaseCount > 0 && (
            <div className="flex items-center gap-1.5 text-red-400 font-bold">
              <span>⚠ Pathology Alerts: {diseaseCount}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
            <span className="text-[10px]">Harvested</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-cyan-400 inline-block" />
            <span className="text-[10px]">Active Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block" />
            <span className="text-[10px]">Disease Alert</span>
          </div>
        </div>
      </div>
    </div>
  );
}
