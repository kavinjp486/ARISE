import { motion } from "framer-motion";
import { Compass, Layers, Radio, ShieldCheck, Zap } from "lucide-react";
import type { CellData } from "@/types";

interface AerialViewPanelProps {
  posX: number;
  posY: number;
  row: number;
  col: number;
  cells: CellData[];
  isHarvesting: boolean;
}

const GW = 10;
const GH = 8;

export function AerialViewPanel({
  posX,
  posY,
  row,
  col,
  cells,
  isHarvesting,
}: AerialViewPanelProps) {
  // Map posX (0..100) and posY (0..100) to percentage within visual bounds (12% to 88%)
  const posXPercent = (posX / 100) * 76 + 12;
  const posYPercent = (posY / 100) * 76 + 12;

  const harvestedCount = cells.filter((c) => c.status === "harvested").length;
  const progressPct = Math.round((harvestedCount / 80) * 100);

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#04080F] border border-cyan-500/20 rounded-2xl overflow-hidden flex flex-col font-sans select-none shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      {/* Top Header / Viewport HUD Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 backdrop-blur-md z-30">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-orb font-black text-xs text-cyan-400 tracking-wider">
            VIEWPORT A — 🛰️ TOP VIEW (WOODEN FRAME PROTOTYPE)
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>FIELD COVERAGE: {progressPct}%</span>
          </div>

          <div className="text-white/40 font-mono">
            X:{Math.round(posX)}% Y:{Math.round(posY)}%
          </div>
        </div>
      </div>

      {/* Main Viewport Container: Wooden Frame Top Perimeter */}
      <div className="relative flex-1 w-full bg-[#050B14] p-6 flex flex-col justify-center items-center overflow-hidden">
        {/* Background Plantation Row Lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage: `radial-gradient(#00A86B 1px, transparent 1px), linear-gradient(to right, rgba(0, 240, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: "32px 32px, 32px 32px",
          }}
        />

        {/* 1. WOODEN FRAME TOP PERIMETER BEAMS (Matching Physical Prototype Image) */}
        <div className="absolute inset-4 border-[10px] border-[#8c5a2b] rounded-xl shadow-2xl z-20 pointer-events-none flex flex-col justify-between p-1">
          {/* Top Timber Beam Label */}
          <div className="w-full flex justify-between px-2 text-[9px] font-mono font-black text-[#ffc88a] uppercase">
            <span>TIMBER FRAME BEAM NW</span>
            <span>TIMBER FRAME BEAM NE</span>
          </div>

          {/* Bottom Timber Beam Label */}
          <div className="w-full flex justify-between px-2 text-[9px] font-mono font-black text-[#ffc88a] uppercase">
            <span>TIMBER FRAME BEAM SW</span>
            <span>TIMBER FRAME BEAM SE</span>
          </div>
        </div>

        {/* 2. TOP 4 CORNER IDLER PULLEYS (Matching Prototype Annotations) */}
        {/* Top-Left Idler */}
        <div className="absolute top-6 left-6 z-30 flex items-center gap-1.5 text-[9px] font-mono text-[#7cfc00] bg-black/80 border border-emerald-500/40 px-2 py-0.5 rounded shadow-lg">
          <span className="w-3 h-3 rounded-full bg-[#1b4317] border border-[#7cfc00] flex items-center justify-center font-bold text-[7px] text-[#7cfc00]">
            ⚙
          </span>
          <span>IDLER (NW)</span>
        </div>

        {/* Top-Right Idler */}
        <div className="absolute top-6 right-6 z-30 flex items-center gap-1.5 text-[9px] font-mono text-[#7cfc00] bg-black/80 border border-emerald-500/40 px-2 py-0.5 rounded shadow-lg">
          <span>IDLER (NE)</span>
          <span className="w-3 h-3 rounded-full bg-[#1b4317] border border-[#7cfc00] flex items-center justify-center font-bold text-[7px] text-[#7cfc00]">
            ⚙
          </span>
        </div>

        {/* Bottom-Left Idler */}
        <div className="absolute bottom-6 left-6 z-30 flex items-center gap-1.5 text-[9px] font-mono text-[#7cfc00] bg-black/80 border border-emerald-500/40 px-2 py-0.5 rounded shadow-lg">
          <span className="w-3 h-3 rounded-full bg-[#1b4317] border border-[#7cfc00] flex items-center justify-center font-bold text-[7px] text-[#7cfc00]">
            ⚙
          </span>
          <span>IDLER (SW)</span>
        </div>

        {/* Bottom-Right Idler */}
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-1.5 text-[9px] font-mono text-[#7cfc00] bg-black/80 border border-emerald-500/40 px-2 py-0.5 rounded shadow-lg">
          <span>IDLER (SE)</span>
          <span className="w-3 h-3 rounded-full bg-[#1b4317] border border-[#7cfc00] flex items-center justify-center font-bold text-[7px] text-[#7cfc00]">
            ⚙
          </span>
        </div>

        {/* 3. HIGH-CONTRAST GREEN CABLES (Matching Prototype Green Cable Rigging) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
          {/* Top-Left Green Cable */}
          <line
            x1="35"
            y1="35"
            x2={`${posXPercent}%`}
            y2={`${posYPercent}%`}
            stroke="#00FF66"
            strokeWidth="2.5"
            style={{ filter: "drop-shadow(0 0 6px #00FF66)" }}
          />
          {/* Top-Right Green Cable */}
          <line
            x1="95%"
            y1="35"
            x2={`${posXPercent}%`}
            y2={`${posYPercent}%`}
            stroke="#00FF66"
            strokeWidth="2.5"
            style={{ filter: "drop-shadow(0 0 6px #00FF66)" }}
          />
          {/* Bottom-Left Green Cable */}
          <line
            x1="35"
            y1="93%"
            x2={`${posXPercent}%`}
            y2={`${posYPercent}%`}
            stroke="#00FF66"
            strokeWidth="2.5"
            style={{ filter: "drop-shadow(0 0 6px #00FF66)" }}
          />
          {/* Bottom-Right Green Cable */}
          <line
            x1="95%"
            y1="93%"
            x2={`${posXPercent}%`}
            y2={`${posYPercent}%`}
            stroke="#00FF66"
            strokeWidth="2.5"
            style={{ filter: "drop-shadow(0 0 6px #00FF66)" }}
          />
        </svg>

        {/* 4. 10×8 TEA PLANTATION CROP GRID UNDERNEATH */}
        <div className="relative z-10 grid grid-cols-10 gap-1.5 w-full max-w-3xl p-3 bg-black/50 border border-white/10 rounded-xl backdrop-blur-sm">
          {cells.map((cell) => {
            const isActiveTarget = cell.row === row && cell.col === col;

            return (
              <div
                key={cell.id}
                className={`relative aspect-square rounded flex flex-col items-center justify-center transition-all duration-300 border ${
                  cell.status === "harvested"
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(0,168,107,0.3)]"
                    : cell.status === "disease"
                    ? "bg-red-500/25 border-red-400 text-red-300 animate-pulse shadow-[0_0_12px_rgba(255,60,60,0.4)]"
                    : "bg-white/[0.02] border-white/10 text-white/20"
                }`}
              >
                {/* Active Target Reticle Highlight */}
                {isActiveTarget && (
                  <div className="absolute -inset-1 rounded border-2 border-cyan-400 bg-cyan-400/15 shadow-[0_0_20px_rgba(0,240,255,0.7)] z-20 pointer-events-none">
                    <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-300" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-300" />
                    <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-300" />
                    <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-300" />
                  </div>
                )}

                <span className="text-[10px] font-mono font-bold">
                  {cell.status === "harvested" ? (
                    "✓"
                  ) : cell.status === "disease" ? (
                    "⚠"
                  ) : (
                    <span className="text-[8px] opacity-30">
                      {cell.row + 1}.{cell.col + 1}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* 5. CENTER SQUARE PAYLOAD PLATFORM (Matching Prototype Square Platform) */}
        <motion.div
          className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          animate={{
            left: `${posXPercent}%`,
            top: `${posYPercent}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 22,
          }}
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* Active Plucking Pulse Effect */}
            {isHarvesting && (
              <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-emerald-400/40" />
            )}

            {/* Square Wooden/Metallic Payload Carriage Box */}
            <div className="relative w-14 h-14 rounded-lg bg-gradient-to-b from-[#8c5a2b] via-[#5a3a1e] to-[#2d1b0d] border-2 border-[#ffc88a] shadow-[0_0_25px_rgba(0,255,102,0.5)] flex flex-col items-center justify-center p-1">
              {/* Cable Eyelet Attachments at Corners */}
              <span className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-[#00FF66]" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#00FF66]" />
              <span className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-[#00FF66]" />
              <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#00FF66]" />

              <div className="font-orb text-[8px] font-black text-[#ffc88a] tracking-tighter">
                PAYLOAD
              </div>
              <div className="text-[7px] font-mono text-cyan-300 font-bold">
                R{row + 1}·C{col + 1}
              </div>
            </div>

            {/* Position HUD Tag */}
            <div className="absolute -bottom-6 px-2 py-0.5 rounded bg-black/90 border border-cyan-400/40 text-[9px] font-mono text-cyan-400 font-bold shadow-lg">
              X:{Math.round(posX)}% Y:{Math.round(posY)}%
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Status Legend Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-black/80 border-t border-white/10 text-xs font-mono text-white/50 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Compass className="h-3.5 w-3.5" />
            <span>Target: Row {row + 1}, Col {col + 1}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00FF66] font-bold">
            <span>4 Green Suspension Cables Locked</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-emerald-400 font-bold">
            HARVESTED: {harvestedCount} ZONES
          </span>
        </div>
      </div>
    </div>
  );
}
