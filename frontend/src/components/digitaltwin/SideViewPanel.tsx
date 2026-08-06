import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Gauge, Scissors, ShieldAlert, Zap } from "lucide-react";

export function SideViewPanel() {
  const [posX, setPosX] = useState(30); // Horizontal position % (15% to 85%)
  const [armDepth, setArmDepth] = useState(45); // Harvesting arm depth % (10% to 80%)
  const [isPlucking, setIsPlucking] = useState(true);
  const [leafCount, setLeafCount] = useState(18);

  // Smooth continuous movement simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setPosX((prevX) => {
        // Move back and forth smoothly
        const nextX = prevX + (Math.sin(Date.now() * 0.001) * 0.8 + 0.5);
        return nextX > 82 ? 18 : nextX;
      });

      setArmDepth(() => 40 + Math.sin(Date.now() * 0.002) * 25);

      if (Math.random() > 0.4) {
        setLeafCount((c) => Math.min(100, c + 1));
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // SVG Catenary Cable Sag Math
  // Midpoint sag calculation based on payload position
  const startX = 60; // Left wooden post anchor
  const endX = 740; // Right wooden post anchor
  const anchorY = 70; // Top cable pulley height
  const payloadX = startX + (posX / 100) * (endX - startX);
  const sagY = anchorY + 28 + Math.sin((posX / 100) * Math.PI) * 12;

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#04080F] border border-cyan-500/20 rounded-2xl overflow-hidden flex flex-col font-sans select-none shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      {/* Top Header / Viewport HUD Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 backdrop-blur-md z-30">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-orb font-black text-xs text-cyan-400 tracking-wider">
            VIEWPORT B — 🔬 SIDE ELEVATION & MECHANICS (DIGITAL TWIN)
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            <Gauge className="h-3 w-3" />
            <span>Z-ARM DEPTH: {Math.round(armDepth)}%</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <Zap className="h-3 w-3" />
            <span>BASKET: {leafCount} SHOOTS</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Side-View Canvas */}
      <div className="relative flex-1 w-full bg-[#050B14] p-4 flex flex-col justify-end overflow-hidden">
        {/* Background Grid Pattern & Sky Gradient */}
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,240,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.06) 1px, transparent 1px)`,
            backgroundSize: "40px 40px, 40px 40px",
          }}
        />

        {/* SVG Cable Physics & Rigging Layer */}
        <svg
          viewBox="0 0 800 360"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          {/* Main Sagging Suspension Cable (Left Post ➔ Payload ➔ Right Post) */}
          <path
            d={`M ${startX} ${anchorY} Q ${payloadX} ${sagY + 25} ${endX} ${anchorY}`}
            fill="none"
            stroke="#00F0FF"
            strokeWidth="2.5"
            strokeDasharray="6 3"
            opacity="0.8"
            style={{ filter: "drop-shadow(0 0 8px #00F0FF)" }}
          />

          {/* Secondary Stabilizer Tension Cable */}
          <path
            d={`M ${startX} ${anchorY + 15} Q ${payloadX} ${sagY + 40} ${endX} ${anchorY + 15}`}
            fill="none"
            stroke="#00A86B"
            strokeWidth="1.5"
            opacity="0.4"
          />

          {/* Vertical Tether Cables Dropping to Carriage */}
          <line
            x1={payloadX}
            y1={anchorY}
            x2={payloadX}
            y2={sagY + 10}
            stroke="#00F0FF"
            strokeWidth="2"
            opacity="0.9"
          />
        </svg>

        {/* 1. WOODEN FRAME PROTOTYPE STRUCTURE */}
        {/* Left Wooden Support Tower */}
        <div className="absolute left-6 top-12 bottom-12 w-9 rounded-md bg-gradient-to-r from-[#5a3a1e] via-[#8c5a2b] to-[#422913] border-2 border-[#a6723c] shadow-2xl flex flex-col justify-between items-center py-3 z-20">
          <div className="w-5 h-5 rounded-full bg-[#2a1708] border border-[#a6723c] flex items-center justify-center font-mono text-[9px] text-[#ffc88a] font-bold">
            P1
          </div>
          <div className="w-full h-1 bg-[#3a220e] my-2" />
          <div className="w-full h-1 bg-[#3a220e] my-2" />
          <div className="w-[#a6723c] font-mono text-[9px] text-[#ffc88a] rotate-90 tracking-widest font-black">
            TIMBER TOWER A
          </div>
          <div className="w-5 h-5 rounded-full bg-[#2a1708] border border-[#a6723c] flex items-center justify-center font-mono text-[9px] text-[#ffc88a] font-bold">
            ⚡
          </div>
        </div>

        {/* Right Wooden Support Tower */}
        <div className="absolute right-6 top-12 bottom-12 w-9 rounded-md bg-gradient-to-r from-[#5a3a1e] via-[#8c5a2b] to-[#422913] border-2 border-[#a6723c] shadow-2xl flex flex-col justify-between items-center py-3 z-20">
          <div className="w-5 h-5 rounded-full bg-[#2a1708] border border-[#a6723c] flex items-center justify-center font-mono text-[9px] text-[#ffc88a] font-bold">
            P2
          </div>
          <div className="w-full h-1 bg-[#3a220e] my-2" />
          <div className="w-full h-1 bg-[#3a220e] my-2" />
          <div className="w-[#a6723c] font-mono text-[9px] text-[#ffc88a] -rotate-90 tracking-widest font-black">
            TIMBER TOWER B
          </div>
          <div className="w-5 h-5 rounded-full bg-[#2a1708] border border-[#a6723c] flex items-center justify-center font-mono text-[9px] text-[#ffc88a] font-bold">
            ⚡
          </div>
        </div>

        {/* Ground Plantation Base & Green Tea Canopy Bushes */}
        <div className="relative w-full h-24 bg-gradient-to-t from-[#06120a] via-[#0d2616] to-transparent border-t border-emerald-500/30 z-10 flex items-end justify-around px-16 pb-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="relative w-16 h-14 rounded-t-full bg-gradient-to-t from-[#0a3818] via-[#00A86B] to-[#2ce095] border-t border-emerald-300/40 shadow-[0_0_15px_rgba(0,168,107,0.3)]"
            >
              <div className="absolute top-1 left-3 w-3 h-3 rounded-full bg-[#49fca1] opacity-60 blur-[1px]" />
            </div>
          ))}
        </div>

        {/* 2. SUSPENDED PAYLOAD CARRIAGE & 3. HARVESTING ARM & 4. BASKET */}
        <motion.div
          className="absolute z-30 -translate-x-1/2"
          animate={{
            left: `${posX}%`,
            top: `${sagY + 20}px`,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 18,
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Payload Carriage Chassis Box */}
            <div className="relative w-28 h-16 rounded-xl bg-gradient-to-b from-[#08182b] to-[#040c17] border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.5)] flex items-center justify-between px-3 py-1.5 backdrop-blur-md">
              {/* Stepper Motor Wheel Pulley Accent */}
              <div className="w-4 h-4 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center animate-spin">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>

              <div className="text-center font-orb">
                <div className="text-[10px] font-black text-cyan-400 tracking-wider">
                  ARISE-01
                </div>
                <div className="text-[8px] font-mono text-white/50">
                  CABLE BOT
                </div>
              </div>

              <div className="w-4 h-4 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center animate-spin">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
            </div>

            {/* Vertical Z-Axis Lead-Screw Elevation Arm */}
            <motion.div
              className="w-2.5 bg-gradient-to-b from-cyan-400 via-emerald-400 to-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.7)] rounded-b flex flex-col items-center justify-end"
              animate={{ height: `${armDepth + 20}px` }}
              transition={{ type: "spring", stiffness: 140, damping: 15 }}
            >
              {/* Rotating Shear Plucker Blade Mechanism */}
              <div className="relative -bottom-3 flex items-center justify-center">
                <motion.div
                  className="w-10 h-10 rounded-full border-2 border-dashed border-cyan-300 bg-cyan-400/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.8)]"
                  animate={{ rotate: isPlucking ? 360 : 0 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    ease: "linear",
                  }}
                >
                  <Scissors className="h-5 w-5 text-cyan-300 transform -rotate-45" />
                </motion.div>
              </div>
            </motion.div>

            {/* 5. TEA LEAF COLLECTION BASKET (Attached under Payload) */}
            <div className="absolute top-4 -right-16 w-16 h-12 rounded-b-xl border-2 border-emerald-400 bg-emerald-950/90 shadow-[0_0_15px_rgba(0,168,107,0.4)] flex flex-col items-center justify-end p-1 backdrop-blur-md">
              <div className="text-[7px] font-orb font-bold text-emerald-300 tracking-tighter mb-0.5">
                TEA HOPPER
              </div>

              {/* Accumulated Leaf Particles */}
              <div className="w-full flex flex-wrap gap-0.5 justify-center overflow-hidden max-h-7">
                {Array.from({ length: Math.min(16, Math.floor(leafCount / 4)) }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, y: -10 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-2 h-2 rounded-tl-full rounded-br-full bg-emerald-400 shadow-[0_0_5px_#00A86B]"
                  />
                ))}
              </div>
            </div>

            {/* Falling Plucked Leaf Particles */}
            {isPlucking && (
              <motion.div
                initial={{ opacity: 1, y: armDepth + 10, x: -5 }}
                animate={{ opacity: 0, y: armDepth - 25, x: 25 }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="absolute w-2.5 h-2.5 rounded-tl-full rounded-br-full bg-emerald-300 shadow-[0_0_8px_#00A86B]"
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Status Mechanics Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-black/80 border-t border-white/10 text-xs font-mono text-white/50 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Activity className="h-3.5 w-3.5" />
            <span>Rigging: Wooden Timber Prototype Frame</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Scissors className="h-3.5 w-3.5" />
            <span>Plucker Blade: 3,200 RPM</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-emerald-400 font-bold">
            COLLECTION BASKET: {leafCount} SHOOTS HARVESTED
          </span>
        </div>
      </div>
    </div>
  );
}
