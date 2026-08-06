import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Crosshair,
  Eye,
  Maximize2,
  Sparkles,
  Zap,
} from "lucide-react";

export interface DetectionBox {
  id: string;
  label: string;
  confidence: number;
  type: "harvest_ready" | "young_bud" | "disease";
  x: number; // percentage
  y: number; // percentage
  w: number; // percentage
  h: number; // percentage
  action: string;
}

const INITIAL_DETECTIONS: DetectionBox[] = [
  {
    id: "det-1",
    label: "Apical Flush (Ready)",
    confidence: 98,
    type: "harvest_ready",
    x: 18,
    y: 22,
    w: 28,
    h: 32,
    action: "SELECTIVE PLUCK ACTIVE",
  },
  {
    id: "det-2",
    label: "Young Bud (Growth)",
    confidence: 94,
    type: "young_bud",
    x: 58,
    y: 18,
    w: 24,
    h: 28,
    action: "DEFER FOR 3 DAYS",
  },
  {
    id: "det-3",
    label: "Blister Blight Pathology",
    confidence: 91,
    type: "disease",
    x: 38,
    y: 56,
    w: 32,
    h: 34,
    action: "BIO-SPRAY TREATMENT REQUIRED",
  },
];

export function RobotVisionHUD() {
  const [detections, setDetections] = useState<DetectionBox[]>(INITIAL_DETECTIONS);
  const [activeBoxId, setActiveBoxId] = useState<string>("det-1");
  const [fps, setFps] = useState(60);

  // Dynamic AI inference confidence flickering & tracking animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDetections((prev) =>
        prev.map((d) => ({
          ...d,
          confidence: Math.min(99, Math.max(88, d.confidence + (Math.floor(Math.random() * 3) - 1))),
        }))
      );
      setFps(58 + Math.floor(Math.random() * 4));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const activeBox = detections.find((d) => d.id === activeBoxId) || detections[0];

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#04080F] border border-cyan-500/20 rounded-2xl overflow-hidden flex flex-col font-sans select-none shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      {/* Top Header / Viewport HUD Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 backdrop-blur-md z-30">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-orb font-black text-xs text-cyan-400 tracking-wider flex items-center gap-2">
            VIEWPORT C — 👁️ ONBOARD AI CAMERA VISION (YOLOv8 + OPENCV)
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            <Camera className="h-3 w-3" />
            <span>1080p @ {fps} FPS</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <Sparkles className="h-3 w-3" />
            <span>AI CONFIDENCE: {activeBox.confidence}%</span>
          </div>
        </div>
      </div>

      {/* Main AI Camera Stream Viewport */}
      <div className="relative flex-1 w-full bg-[#050E0A] overflow-hidden flex items-center justify-center">
        {/* Synthetic Tea Leaf Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1200&auto=format&fit=crop')`,
          }}
        />

        {/* Dark Vignette & Synthetic Sensor Line Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04080F] via-transparent to-black/60 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px, 40px 40px",
          }}
        />

        {/* Center Target Crosshairs HUD */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="relative w-36 h-36 border border-cyan-400/30 rounded-full flex items-center justify-center animate-spin-slow">
            <Crosshair className="h-8 w-8 text-cyan-400/60" />
            <span className="absolute -top-2 text-[9px] font-mono text-cyan-400">
              FOCAL RETICLE
            </span>
          </div>
        </div>

        {/* AI DETECTION BOUNDING BOXES OVERLAY */}
        {detections.map((box) => {
          const isSelected = box.id === activeBoxId;
          const isDisease = box.type === "disease";
          const isReady = box.type === "harvest_ready";

          const boxColor = isDisease
            ? "#ff3c3c"
            : isReady
            ? "#00A86B"
            : "#00F0FF";

          return (
            <motion.div
              key={box.id}
              onClick={() => setActiveBoxId(box.id)}
              className="absolute cursor-pointer z-30 transition-transform hover:scale-105"
              style={{
                left: `${box.x}%`,
                top: `${box.y}%`,
                width: `${box.w}%`,
                height: `${box.h}%`,
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Bounding Box Frame */}
              <div
                className={`w-full h-full rounded border-2 transition-all relative ${
                  isSelected ? "shadow-2xl" : "opacity-80"
                }`}
                style={{
                  borderColor: boxColor,
                  backgroundColor: `${boxColor}15`,
                  boxShadow: isSelected ? `0 0 25px ${boxColor}88` : "none",
                }}
              >
                {/* Corner Corner Reticle Accents */}
                <span
                  className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2"
                  style={{ borderColor: boxColor }}
                />
                <span
                  className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2"
                  style={{ borderColor: boxColor }}
                />
                <span
                  className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2"
                  style={{ borderColor: boxColor }}
                />
                <span
                  className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2"
                  style={{ borderColor: boxColor }}
                />

                {/* Floating AI Label Badge */}
                <div
                  className="absolute -top-7 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg whitespace-nowrap"
                  style={{
                    backgroundColor: "#04080F",
                    color: boxColor,
                    border: `1px solid ${boxColor}66`,
                  }}
                >
                  {isDisease ? (
                    <AlertTriangle className="h-3 w-3 text-red-400" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  )}
                  <span>{box.label}</span>
                  <span className="opacity-60">[{box.confidence}%]</span>
                </div>

                {/* Action Sub-Badge */}
                <div
                  className="absolute -bottom-6 right-0 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${boxColor}33`,
                    color: boxColor,
                    border: `1px solid ${boxColor}44`,
                  }}
                >
                  {box.action}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom AI Harvest Recommendation Banner */}
      <div className="px-4 py-3 bg-[#040C16] border-t border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 z-30">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <div className="font-orb text-xs font-bold text-white flex items-center gap-2">
              <span>HARVEST RECOMMENDATION:</span>
              <span className="text-emerald-400 font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30">
                OPTIMAL CROP DENSITY (94%)
              </span>
            </div>
            <div className="text-[11px] text-white/60 font-mono mt-0.5">
              Target active shoot <span className="text-cyan-400 font-bold">{activeBox.label}</span> — {activeBox.action}
            </div>
          </div>
        </div>

        {/* Selection Switcher Pills */}
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          {detections.map((box) => (
            <button
              key={box.id}
              onClick={() => setActiveBoxId(box.id)}
              className={`px-2.5 py-1 rounded transition-all border ${
                activeBoxId === box.id
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50 font-bold"
                  : "bg-white/5 text-white/40 border-white/10 hover:text-white"
              }`}
            >
              {box.type === "disease" ? "🚨 Pathology" : "🌿 Shoot"} [{box.confidence}%]
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
