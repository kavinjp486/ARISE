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

  // 3D Perspective Math:
  // Forward/Backward (posY: 0..100) translates Z-depth from -250px (far) to +180px (close/passing camera)
  // Left/Right (posX: 0..100) translates X-offset from +180px to -180px
  const translateZVal = -220 + (posY / 100) * 360;
  const translateXVal = (posX - 50) * -4.2;

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#04080F] border border-cyan-500/20 rounded-2xl overflow-hidden flex flex-col font-sans select-none shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      {/* Top Header / Viewport HUD Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 backdrop-blur-md z-30">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-orb font-black text-xs text-cyan-400 tracking-wider">
            VIEWPORT C — 👁️ 3D FIRST-PERSON PERSPECTIVE (FORWARD/BACKWARD PROJECTION)
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            <Camera className="h-3 w-3" />
            <span>3D FOV 1080p @ 60 FPS</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <Sparkles className="h-3 w-3" />
            <span>3D Z-DEPTH: {Math.round(translateZVal)}px</span>
          </div>
        </div>
      </div>

      {/* Main 3D Perspective Projection Viewport Container */}
      <div
        className="relative flex-1 w-full bg-[#030907] overflow-hidden flex items-center justify-center"
        style={{ perspective: "750px", perspectiveOrigin: "50% 50%" }}
      >
        {/* 3D WORLD STAGE (PRESERVE-3D) */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            transform: `translate3d(${translateXVal}px, 0px, ${translateZVal}px) rotateX(12deg)`,
          }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          {/* Layer 1: Background Misty Tea Estate Hills (Far Z-Plane) */}
          <div
            className="absolute -inset-20 bg-cover bg-center opacity-60"
            style={{
              backgroundImage: `url('/tea_plantation_fpv.png')`,
              transform: "translateZ(-300px) scale(1.4)",
            }}
          />

          {/* Layer 2: 3D Ground Mesh Plantation Grid (Mid Z-Plane) */}
          <div
            className="absolute inset-x-0 bottom-0 h-[600px] border-t-2 border-emerald-500/40 opacity-30"
            style={{
              transform: "rotateX(75deg) translateZ(-100px)",
              backgroundImage: `radial-gradient(#00FF66 1.5px, transparent 1.5px), linear-gradient(to right, rgba(0, 240, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.15) 1px, transparent 1px)`,
              backgroundSize: "60px 60px, 60px 60px, 60px 60px",
            }}
          />

          {/* Layer 3: 3D Tea Crop Rows (Passing By Camera in 3D Space) */}
          <div
            className="absolute inset-0 flex flex-col justify-around py-8 pointer-events-none"
            style={{ transform: "translateZ(-50px) rotateX(-8deg)" }}
          >
            {[1, 2, 3].map((rowIdx) => (
              <div
                key={rowIdx}
                className="w-full flex justify-around px-12 opacity-80"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-24 h-20 rounded-t-full bg-gradient-to-t from-[#092612] via-[#00A86B] to-[#42f0a5] border-t-2 border-emerald-300 shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center text-[10px] font-mono text-cyan-200 font-bold"
                  >
                    <span>SHOOT #{rowIdx}.{i + 1}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Layer 4: 3D AI Target Bounding Boxes floating in 3D Space */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ transform: "translateZ(80px)" }}
          >
            {isDiseaseZone ? (
              <div className="w-72 h-52 border-2 border-red-500 rounded bg-red-500/20 shadow-[0_0_40px_rgba(255,60,60,0.7)] flex flex-col items-center justify-between p-3">
                <div className="w-full flex justify-between items-center text-xs font-mono font-bold text-red-400 bg-black/90 px-2 py-1 rounded border border-red-500/40">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                    BLISTER BLIGHT PATHOLOGY
                  </span>
                  <span>[92% CONF]</span>
                </div>
                <div className="font-orb text-xs font-bold text-red-300 bg-red-500/30 px-3 py-1 rounded border border-red-500/40 animate-pulse">
                  ⚠ BIO-FUNGICIDE SPRAY REQUIRED
                </div>
              </div>
            ) : isHarvestedZone ? (
              <div className="w-72 h-52 border-2 border-emerald-400 rounded bg-emerald-500/20 shadow-[0_0_40px_rgba(0,168,107,0.7)] flex flex-col items-center justify-between p-3">
                <div className="w-full flex justify-between items-center text-xs font-mono font-bold text-emerald-400 bg-black/90 px-2 py-1 rounded border border-emerald-500/40">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    HARVEST COMPLETE
                  </span>
                  <span>[100% FLUSH]</span>
                </div>
                <div className="font-orb text-xs font-bold text-emerald-300 bg-emerald-500/30 px-3 py-1 rounded border border-emerald-500/40">
                  ✓ TEA SHOOTS PLUCKED & COLLECTED
                </div>
              </div>
            ) : (
              <div className="w-72 h-52 border-2 border-cyan-400 rounded bg-cyan-500/20 shadow-[0_0_40px_rgba(0,240,255,0.7)] flex flex-col items-center justify-between p-3">
                <div className="w-full flex justify-between items-center text-xs font-mono font-bold text-cyan-400 bg-black/90 px-2 py-1 rounded border border-cyan-500/40">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                    APICAL TEA SHOOTS
                  </span>
                  <span>[98% CONF]</span>
                </div>
                <div className="font-orb text-xs font-bold text-cyan-300 bg-cyan-500/30 px-3 py-1 rounded border border-cyan-500/40">
                  SELECTIVE PLUCK READY
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04080F] via-transparent to-black/50 pointer-events-none z-10" />

        {/* 2D HUD OVERLAY (Static Target Reticle in Front of Camera Lens) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="relative w-52 h-52 border-2 border-dashed border-cyan-400/50 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.3)]">
            <Crosshair className="h-10 w-10 text-cyan-400 animate-pulse" />
            <span className="absolute -top-3 text-[9px] font-mono text-cyan-400 bg-black/90 px-2 py-0.5 rounded border border-cyan-500/40">
              3D PERSPECTIVE CAMERA LENS
            </span>
          </div>
        </div>

        {/* ACTIVE CUTTER HARVESTING PARTICLES IN FIRST PERSON */}
        {isHarvesting && (
          <motion.div
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.6 }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="absolute z-30 pointer-events-none flex flex-col items-center justify-center"
          >
            <div className="text-4xl animate-spin">✂️</div>
            <div className="font-orb font-black text-xs text-emerald-400 bg-black/90 px-3 py-1 rounded border border-emerald-400 shadow-xl">
              PLUCKING LEAVES IN 3D...
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
              <span>3D FIRST-PERSON PROJECTION:</span>
              <span className="text-emerald-400 font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30">
                ROW {row + 1} · COL {col + 1}
              </span>
            </div>
            <div className="text-[11px] text-white/60 font-mono mt-0.5">
              {isDiseaseZone
                ? "Pathology detected in 3D space — Bio-fungicide spray recommended."
                : isHarvestedZone
                ? "Zone harvested — Move forward to next tea canopy sector."
                : "3D perspective active — Press FORWARD/BACKWARD to navigate depth, PLUCK to harvest."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
