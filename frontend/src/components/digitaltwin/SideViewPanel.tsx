import { motion } from "framer-motion";
import { Activity, Gauge, Scissors, Zap } from "lucide-react";

interface SideViewPanelProps {
  posX: number;
  posZ: number;
  isHarvesting: boolean;
  leafCount: number;
}

export function SideViewPanel({
  posX,
  posZ,
  isHarvesting,
  leafCount,
}: SideViewPanelProps) {
  // SVG Catenary Cable Sag Math
  const startX = 60; // Left wooden post anchor
  const endX = 740; // Right wooden post anchor
  const anchorY = 70; // Top cable pulley height
  const payloadX = startX + (posX / 100) * (endX - startX);
  const sagY = anchorY + 25 + Math.sin((posX / 100) * Math.PI) * 14;

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#04080F] border border-cyan-500/20 rounded-2xl overflow-hidden flex flex-col font-sans select-none shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      {/* Top Header / Viewport HUD Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 backdrop-blur-md z-30">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-orb font-black text-xs text-cyan-400 tracking-wider">
            VIEWPORT B — 🔬 SIDE ELEVATION (TIMBER FRAME & MECHANICS)
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            <Gauge className="h-3 w-3" />
            <span>Z-ELEVATOR DEPTH: {Math.round(posZ)}%</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <Zap className="h-3 w-3" />
            <span>HOPPER: {leafCount} SHOOTS</span>
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
          {/* Main Sagging Green Suspension Cable */}
          <path
            d={`M ${startX} ${anchorY} Q ${payloadX} ${sagY + 25} ${endX} ${anchorY}`}
            fill="none"
            stroke="#00FF66"
            strokeWidth="3"
            style={{ filter: "drop-shadow(0 0 8px #00FF66)" }}
          />

          {/* Vertical Drop Tether Cables */}
          <line
            x1={payloadX}
            y1={anchorY}
            x2={payloadX}
            y2={sagY + 10}
            stroke="#00FF66"
            strokeWidth="2"
          />

          {/* Belt Pulley Lines along Left/Right Timber Legs (Z-Axis Vertical Control) */}
          <line x1="45" y1="70" x2="45" y2="300" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <line x1="755" y1="70" x2="755" y2="300" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
        </svg>

        {/* 1. WOODEN TIMBER FRAME STRUCTURE (Matching Prototype Photo) */}
        {/* Left Wooden Support Tower */}
        <div className="absolute left-6 top-10 bottom-10 w-9 rounded-md bg-gradient-to-r from-[#5a3a1e] via-[#8c5a2b] to-[#422913] border-2 border-[#a6723c] shadow-2xl flex flex-col justify-between items-center py-2 z-20">
          <div className="w-5 h-5 rounded-full bg-[#2a1708] border border-[#a6723c] flex items-center justify-center font-mono text-[8px] text-[#ffc88a] font-bold">
            ⚙
          </div>
          <div className="w-[#a6723c] font-mono text-[8px] text-[#ffc88a] rotate-90 tracking-widest font-black">
            BELT PULLEY (Z-AXIS)
          </div>

          {/* Bottom Left Stepper Motor (Matching Prototype Photo) */}
          <div className="w-8 h-8 rounded bg-[#1a2332] border border-cyan-400/60 shadow-lg flex flex-col items-center justify-center">
            <span className="text-[7px] font-mono font-bold text-cyan-400">STEPPER</span>
            <span className="text-[6px] font-mono text-white/50">MOTOR A</span>
          </div>
        </div>

        {/* Right Wooden Support Tower */}
        <div className="absolute right-6 top-10 bottom-10 w-9 rounded-md bg-gradient-to-r from-[#5a3a1e] via-[#8c5a2b] to-[#422913] border-2 border-[#a6723c] shadow-2xl flex flex-col justify-between items-center py-2 z-20">
          <div className="w-5 h-5 rounded-full bg-[#2a1708] border border-[#a6723c] flex items-center justify-center font-mono text-[8px] text-[#ffc88a] font-bold">
            ⚙
          </div>
          <div className="w-[#a6723c] font-mono text-[8px] text-[#ffc88a] -rotate-90 tracking-widest font-black">
            BELT PULLEY (Z-AXIS)
          </div>

          {/* Bottom Right Stepper Motor (Matching Prototype Photo) */}
          <div className="w-8 h-8 rounded bg-[#1a2332] border border-cyan-400/60 shadow-lg flex flex-col items-center justify-center">
            <span className="text-[7px] font-mono font-bold text-cyan-400">STEPPER</span>
            <span className="text-[6px] font-mono text-white/50">MOTOR B</span>
          </div>
        </div>

        {/* Ground Base: Bench Power Supply + ESP32 Control System (Matching Prototype Photo) */}
        <div className="relative w-full h-24 bg-gradient-to-t from-[#06120a] via-[#0d2616] to-transparent border-t border-emerald-500/30 z-10 flex items-end justify-between px-16 pb-2">
          {/* Bench Power Supply Box Component */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141d2b] border border-cyan-500/40 shadow-xl text-xs font-mono">
            <div className="w-3 h-3 rounded bg-amber-400 border border-amber-300 flex items-center justify-center text-[7px] text-black font-bold">
              ⚡
            </div>
            <div>
              <div className="text-[9px] font-bold text-cyan-400">POWER SUPPLY</div>
              <div className="text-[8px] text-white/50">12V · 10A DC RAIL</div>
            </div>
          </div>

          {/* Tea Bushes */}
          <div className="flex-1 flex justify-around px-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="relative w-14 h-12 rounded-t-full bg-gradient-to-t from-[#0a3818] via-[#00A86B] to-[#2ce095] border-t border-emerald-300/40 shadow-[0_0_15px_rgba(0,168,107,0.3)]"
              />
            ))}
          </div>

          {/* ESP32 Control System Board */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e241b] border border-emerald-500/40 shadow-xl text-xs font-mono">
            <div className="w-3 h-3 rounded bg-emerald-400 border border-emerald-300 flex items-center justify-center text-[7px] text-black font-bold animate-pulse">
              MCU
            </div>
            <div>
              <div className="text-[9px] font-bold text-emerald-400">ESP32 CONTROLLER</div>
              <div className="text-[8px] text-white/50">PWM DRIVER ACTIVE</div>
            </div>
          </div>
        </div>

        {/* 2. SUSPENDED PAYLOAD CARRIAGE & 3. HARVESTING Z-ARM & 4. BASKET */}
        <motion.div
          className="absolute z-30 -translate-x-1/2"
          animate={{
            left: `${posX}%`,
            top: `${sagY + 20}px`,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Square Wooden/Metallic Payload Carriage Box */}
            <div className="relative w-28 h-16 rounded-xl bg-gradient-to-b from-[#8c5a2b] via-[#5a3a1e] to-[#2d1b0d] border-2 border-[#ffc88a] shadow-[0_0_25px_rgba(0,255,102,0.5)] flex items-center justify-between px-3 py-1.5 backdrop-blur-md">
              {/* Stepper Motor Wheel Pulley Accent */}
              <div className="w-4 h-4 rounded-full bg-[#00FF66]/20 border border-[#00FF66] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66]" />
              </div>

              <div className="text-center font-orb">
                <div className="text-[10px] font-black text-[#ffc88a] tracking-wider">
                  PAYLOAD
                </div>
                <div className="text-[8px] font-mono text-cyan-300 font-bold">
                  ARISE BOT
                </div>
              </div>

              <div className="w-4 h-4 rounded-full bg-[#00FF66]/20 border border-[#00FF66] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66]" />
              </div>
            </div>

            {/* Vertical Z-Axis Lead-Screw Elevation Arm */}
            <motion.div
              className="w-2.5 bg-gradient-to-b from-cyan-400 via-emerald-400 to-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.7)] rounded-b flex flex-col items-center justify-end"
              animate={{ height: `${(posZ / 100) * 75 + 20}px` }}
              transition={{ type: "spring", stiffness: 140, damping: 15 }}
            >
              {/* Rotating Shear Plucker Blade Mechanism */}
              <div className="relative -bottom-3 flex items-center justify-center">
                <motion.div
                  className="w-10 h-10 rounded-full border-2 border-dashed border-cyan-300 bg-cyan-400/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.8)]"
                  animate={{ rotate: isHarvesting ? 360 : 0 }}
                  transition={{
                    repeat: isHarvesting ? Infinity : 0,
                    duration: 0.4,
                    ease: "linear",
                  }}
                >
                  <Scissors className="h-5 w-5 text-cyan-300 transform -rotate-45" />
                </motion.div>
              </div>
            </motion.div>

            {/* TEA LEAF COLLECTION BASKET (Attached under Payload) */}
            <div className="absolute top-4 -right-16 w-16 h-12 rounded-b-xl border-2 border-emerald-400 bg-emerald-950/90 shadow-[0_0_15px_rgba(0,168,107,0.4)] flex flex-col items-center justify-end p-1 backdrop-blur-md">
              <div className="text-[7px] font-orb font-bold text-emerald-300 tracking-tighter mb-0.5">
                TEA HOPPER
              </div>

              {/* Accumulated Leaf Particles */}
              <div className="w-full flex flex-wrap gap-0.5 justify-center overflow-hidden max-h-7">
                {Array.from({ length: Math.min(16, Math.floor(leafCount / 3)) }).map((_, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-tl-full rounded-br-full bg-emerald-400 shadow-[0_0_5px_#00A86B]"
                  />
                ))}
              </div>
            </div>

            {/* Falling Plucked Leaf Particles */}
            {isHarvesting && (
              <motion.div
                initial={{ opacity: 1, y: (posZ / 100) * 75 + 10, x: -5 }}
                animate={{ opacity: 0, y: (posZ / 100) * 75 - 25, x: 25 }}
                transition={{ repeat: Infinity, duration: 0.5 }}
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
            <span>Prototype: Wooden Timber Frame Box + Steppers</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Scissors className="h-3.5 w-3.5" />
            <span>Plucker Status: {isHarvesting ? "PLUCKING ACTIVE" : "STANDBY"}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-emerald-400 font-bold">
            COLLECTION BASKET: {leafCount} SHOOTS
          </span>
        </div>
      </div>
    </div>
  );
}
