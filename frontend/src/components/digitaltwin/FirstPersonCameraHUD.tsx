import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Crosshair,
  Eye,
  Layers,
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

  // Harmonic Cable Bobbing & Sway Physics Simulation (Suspended Cable Payload)
  const [cableSwayX, setCableSwayX] = useState(0);
  const [cableBobY, setCableBobY] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const start = Date.now();

    const animateCableSway = () => {
      const elapsed = (Date.now() - start) * 0.002;
      // Gentle harmonic oscillation simulating cable sway
      setCableSwayX(Math.sin(elapsed * 1.5) * 3.5);
      setCableBobY(Math.cos(elapsed * 2.2) * 2.5);
      animationFrameId = requestAnimationFrame(animateCableSway);
    };

    animationFrameId = requestAnimationFrame(animateCableSway);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Smooth Spring Easing for Inertial Traversal Acceleration & Deceleration
  const springY = useSpring(posY, { stiffness: 120, damping: 20 });
  const springX = useSpring(posX, { stiffness: 120, damping: 20 });

  // 3D Parallax Perspective Depth Calculations:
  // Forward/Backward (posY: 0..100) -> Continuous Z-plane translation + infinite row loop offset
  const continuousRowOffset = useTransform(springY, (v) => ((100 - v) * 12) % 360);
  const parallaxZ = useTransform(springY, (v) => -180 + ((100 - v) / 100) * 320);
  const parallaxX = useTransform(springX, (v) => (50 - v) * 3.8);

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#04080F] border border-cyan-500/20 rounded-2xl overflow-hidden flex flex-col font-sans select-none shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      {/* Top Header / Viewport HUD Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 backdrop-blur-md z-30">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-orb font-black text-xs text-cyan-400 tracking-wider">
            VIEWPORT C — 👁️ CINEMATIC STREET-VIEW 3D TRAVERSAL (CABLE CAMERA)
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
            <Camera className="h-3 w-3" />
            <span>PAYLOAD CAM 1080p @ 60 FPS</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <Sparkles className="h-3 w-3" />
            <span>CABLE SWAY: NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Main 3D Perspective Projection Viewport Stage */}
      <div
        className="relative flex-1 w-full bg-[#030907] overflow-hidden flex items-center justify-center"
        style={{ perspective: "800px", perspectiveOrigin: "50% 45%" }}
      >
        {/* 3D WORLD CONTAINER (GPU Transform Preserving 3D Space) */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            x: parallaxX,
            rotateZ: cableSwayX * 0.25,
            y: cableBobY,
          }}
        >
          {/* Layer 1: Distant Stable Horizon (Tea Estate Misty Hills) */}
          <div
            className="absolute -inset-24 bg-cover bg-center pointer-events-none opacity-60"
            style={{
              backgroundImage: `url('/tea_plantation_fpv.png')`,
              transform: "translateZ(-350px) scale(1.5)",
            }}
          />

          {/* Layer 2: 3D Ground Perspective Track (Centered Plantation Row) */}
          <div
            className="absolute inset-x-0 bottom-0 h-[700px] pointer-events-none opacity-25"
            style={{
              transform: "rotateX(78deg) translateZ(-120px)",
              backgroundImage: `linear-gradient(to right, rgba(0, 240, 255, 0.2) 2px, transparent 2px), linear-gradient(to bottom, rgba(0, 255, 102, 0.2) 2px, transparent 2px)`,
              backgroundSize: "80px 80px, 80px 80px",
            }}
          />

          {/* Layer 3: CONTINUOUS ENDLESS RECYCLED TEA BUSHES (Parallax Rows) */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-around py-4 pointer-events-none"
            style={{
              transformStyle: "preserve-3d",
              z: parallaxZ,
            }}
          >
            {/* 4 Recycled Depth Segment Rows creating an endless Street View corridor */}
            {[0, 1, 2, 3].map((segmentIdx) => {
              const zDepth = -280 + segmentIdx * 140;

              return (
                <motion.div
                  key={segmentIdx}
                  className="absolute inset-x-0 flex justify-between px-8"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `translate3d(0px, 40px, ${zDepth}px)`,
                  }}
                >
                  {/* Left Tea Bush Corridor Row */}
                  <div className="w-48 h-36 rounded-t-full bg-gradient-to-t from-[#051c0d] via-[#00A86B] to-[#36eb9f] border-t-2 border-emerald-300 shadow-[0_0_30px_rgba(0,168,107,0.4)] flex flex-col items-center justify-center p-2 backdrop-blur-sm">
                    <span className="font-mono text-[9px] font-bold text-cyan-200 bg-black/60 px-1.5 py-0.5 rounded">
                      LEFT CANOPY S#{segmentIdx + 1}
                    </span>
                  </div>

                  {/* Right Tea Bush Corridor Row */}
                  <div className="w-48 h-36 rounded-t-full bg-gradient-to-t from-[#051c0d] via-[#00A86B] to-[#36eb9f] border-t-2 border-emerald-300 shadow-[0_0_30px_rgba(0,168,107,0.4)] flex flex-col items-center justify-center p-2 backdrop-blur-sm">
                    <span className="font-mono text-[9px] font-bold text-cyan-200 bg-black/60 px-1.5 py-0.5 rounded">
                      RIGHT CANOPY S#{segmentIdx + 1}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Layer 4: AI TARGET DETECTION BOXES (Anchored in 3D Space) */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ transform: "translate3d(0px, 0px, 60px)" }}
          >
            {isDiseaseZone ? (
              <div className="w-72 h-52 border-2 border-red-500 rounded bg-red-500/20 shadow-[0_0_40px_rgba(255,60,60,0.7)] flex flex-col items-center justify-between p-3 backdrop-blur-sm">
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
              <div className="w-72 h-52 border-2 border-emerald-400 rounded bg-emerald-500/20 shadow-[0_0_40px_rgba(0,168,107,0.7)] flex flex-col items-center justify-between p-3 backdrop-blur-sm">
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
              <div className="w-72 h-52 border-2 border-cyan-400 rounded bg-cyan-500/20 shadow-[0_0_40px_rgba(0,240,255,0.7)] flex flex-col items-center justify-between p-3 backdrop-blur-sm">
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
              STREET-VIEW PARALLAX CAM
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

      {/* Bottom AI Recommendation Banner & Telemetry Readout */}
      <div className="px-4 py-2.5 bg-[#040C16] border-t border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 z-30">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <div className="font-orb text-xs font-bold text-white flex items-center gap-2">
              <span>CINEMATIC PARALLAX TRAVERSAL:</span>
              <span className="text-emerald-400 font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30">
                ROW {row + 1} · COL {col + 1}
              </span>
            </div>
            <div className="text-[11px] text-white/60 font-mono mt-0.5">
              {isDiseaseZone
                ? "Pathology detected in 3D space — Bio-fungicide spray recommended."
                : isHarvestedZone
                ? "Zone harvested — Move forward to next tea canopy sector."
                : "Smooth Street View traversal active — Press FORWARD/BACKWARD to navigate plantation row."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
