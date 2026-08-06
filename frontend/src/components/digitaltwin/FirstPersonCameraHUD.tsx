import { motion } from "framer-motion";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Crosshair,
  Eye,
  Sparkles,
} from "lucide-react";
import type { CellData } from "@/types";

interface FirstPersonCameraHUDProps {
  posX: number;
  posY: number;
  row: number;
  col: number;
  isHarvesting: boolean;
  cells: CellData[];
}

export function FirstPersonCameraHUD({
  posX,
  posY,
  row,
  col,
  isHarvesting,
  cells,
}: FirstPersonCameraHUDProps) {
  const currentCellId = row * 10 + col;
  const currentCell = cells.find((c) => c.id === currentCellId);
  const isDiseaseZone = currentCell?.status === "disease";
  const isHarvestedZone = currentCell?.status === "harvested";

  // Pronounced First-Person Camera Motion:
  // Forward (UP button: posY -> 0): Zooms in + shifts image downward to simulate moving forward into foliage
  // Backward (DOWN button: posY -> 100): Zooms out + shifts image upward
  // Left / Right (posX: 0..100): Pans horizontally across screen (-180px to +180px)
  const zoomScale = 1.1 + ((100 - posY) / 100) * 0.55;
  const forwardPanY = (50 - posY) * 3.2;
  const lateralPanX = (50 - posX) * 3.5;

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#04080F] border border-cyan-500/20 rounded-2xl overflow-hidden flex flex-col font-sans select-none shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      {/* Top Header / Viewport HUD Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 backdrop-blur-md z-30">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-orb font-black text-xs text-cyan-400 tracking-wider">
            VIEWPORT C — 👁️ FIRST-PERSON VIEW (DYNAMIC CAMERA MOTION)
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            <Camera className="h-3 w-3" />
            <span>ESTATE FOV 1080p @ 60 FPS</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <Sparkles className="h-3 w-3" />
            <span>POSITION: X:{Math.round(posX)}% Y:{Math.round(posY)}%</span>
          </div>
        </div>
      </div>

      {/* Main First Person Camera Viewport */}
      <div className="relative flex-1 w-full bg-[#050E0A] overflow-hidden flex items-center justify-center">
        {/* Photorealistic First-Person Tea Estate Background with Responsive Motion */}
        <motion.div
          className="absolute -inset-16 bg-cover bg-center"
          animate={{
            scale: zoomScale,
            x: lateralPanX,
            y: forwardPanY,
          }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 18,
          }}
          style={{
            backgroundImage: `url('/tea_plantation_fpv.png')`,
          }}
        />

        {/* Natural Sun Flare Glow & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04080F] via-transparent to-black/40 pointer-events-none z-10" />
        <div
          className="absolute inset-0 opacity-15 pointer-events-none z-10"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 240, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.08) 1px, transparent 1px)`,
            backgroundSize: "40px 40px, 40px 40px",
          }}
        />

        {/* Tactical Crosshairs HUD */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="relative w-48 h-48 border-2 border-dashed border-cyan-400/40 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.25)]">
            <Crosshair className="h-10 w-10 text-cyan-400" />
            <span className="absolute -top-3 text-[9px] font-mono text-cyan-400 bg-black/80 px-2 py-0.5 rounded border border-cyan-500/30">
              CAMERA FOV [X:{Math.round(posX)}% Y:{Math.round(posY)}%]
            </span>
          </div>
        </div>

        {/* ACTIVE FIRST-PERSON AI BOUNDING BOX OVERLAYS */}
        <div className="absolute inset-12 z-20 flex items-center justify-center pointer-events-none">
          {isDiseaseZone ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-64 h-48 border-2 border-red-500 rounded bg-red-500/15 shadow-[0_0_30px_rgba(255,60,60,0.6)] flex flex-col items-center justify-between p-3"
            >
              <div className="w-full flex justify-between items-center text-xs font-mono font-bold text-red-400 bg-black/80 px-2 py-1 rounded border border-red-500/40">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                  BLISTER BLIGHT PATHOLOGY
                </span>
                <span>[92% CONF]</span>
              </div>
              <div className="font-orb text-xs font-bold text-red-300 bg-red-500/20 px-3 py-1 rounded border border-red-500/40 animate-pulse">
                ⚠ BIO-FUNGICIDE SPRAY REQUIRED
              </div>
            </motion.div>
          ) : isHarvestedZone ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-64 h-48 border-2 border-emerald-400 rounded bg-emerald-500/15 shadow-[0_0_30px_rgba(0,168,107,0.6)] flex flex-col items-center justify-between p-3"
            >
              <div className="w-full flex justify-between items-center text-xs font-mono font-bold text-emerald-400 bg-black/80 px-2 py-1 rounded border border-emerald-500/40">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  HARVEST COMPLETE
                </span>
                <span>[100% FLUSH]</span>
              </div>
              <div className="font-orb text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded border border-emerald-500/40">
                ✓ TEA SHOOTS PLUCKED & COLLECTED
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-64 h-48 border-2 border-cyan-400 rounded bg-cyan-500/15 shadow-[0_0_30px_rgba(0,240,255,0.6)] flex flex-col items-center justify-between p-3"
            >
              <div className="w-full flex justify-between items-center text-xs font-mono font-bold text-cyan-400 bg-black/80 px-2 py-1 rounded border border-cyan-500/40">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                  FRESH TEA SHOOTS
                </span>
                <span>[98% CONF]</span>
              </div>
              <div className="font-orb text-xs font-bold text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded border border-cyan-500/40">
                SELECTIVE PLUCK READY
              </div>
            </motion.div>
          )}
        </div>

        {/* ACTIVE CUTTER HARVESTING PARTICLES IN FIRST PERSON */}
        {isHarvesting && (
          <motion.div
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="absolute z-30 pointer-events-none flex flex-col items-center justify-center"
          >
            <div className="text-3xl animate-spin">✂️</div>
            <div className="font-orb font-black text-xs text-emerald-400 bg-black/80 px-2 py-1 rounded border border-emerald-400">
              PLUCKING LEAVES...
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom AI Recommendation Banner */}
      <div className="px-4 py-2.5 bg-[#040C16] border-t border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 z-30">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <div className="font-orb text-xs font-bold text-white flex items-center gap-2">
              <span>FIRST-PERSON PERSPECTIVE:</span>
              <span className="text-emerald-400 font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30">
                ROW {row + 1} · COL {col + 1}
              </span>
            </div>
            <div className="text-[11px] text-white/60 font-mono mt-0.5">
              {isDiseaseZone
                ? "Pathology detected — Bio-fungicide spray recommended."
                : isHarvestedZone
                ? "Zone harvested — Move to adjacent crop sector."
                : "Standing among fresh tea shoots (98% flush density) — Press PLUCK to harvest."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
