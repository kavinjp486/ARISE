import { useEffect, useState } from "react";
import { Activity, Battery, Cpu, Gauge, Zap } from "lucide-react";
import { SparklineChart } from "@/components/dashboard/SparklineChart";

export function TelemetryPhysicsPanel() {
  const [tensions, setTensions] = useState([142, 138, 145, 140]);
  const [motorTemp, setMotorTemp] = useState(38);
  const [battery, setBattery] = useState(88);
  const [yieldRate, setYieldRate] = useState(14.8);
  const [historyTension, setHistoryTension] = useState<number[]>([
    135, 138, 140, 142, 141, 144, 142, 145, 143, 142, 140, 142,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const t1 = 138 + Math.floor(Math.random() * 8);
      const t2 = 136 + Math.floor(Math.random() * 8);
      const t3 = 140 + Math.floor(Math.random() * 8);
      const t4 = 137 + Math.floor(Math.random() * 8);
      const avg = Math.round((t1 + t2 + t3 + t4) / 4);

      setTensions([t1, t2, t3, t4]);
      setMotorTemp(37 + Math.sin(Date.now() * 0.001) * 3);
      setBattery((b) => Math.max(20, b - 0.01));
      setYieldRate(14 + Math.sin(Date.now() * 0.002) * 2.5);
      setHistoryTension((prev) => [...prev.slice(1), avg]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#04080F] border border-cyan-500/20 rounded-2xl overflow-hidden flex flex-col font-sans select-none shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      {/* Top Header / Viewport HUD Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 backdrop-blur-md z-30">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-orb font-black text-xs text-cyan-400 tracking-wider">
            VIEWPORT D — 📊 CABLE TENSION & TELEMETRY ANALYTICS
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            <Activity className="h-3 w-3" />
            <span>AVG TENSION: {Math.round(tensions.reduce((a, b) => a + b, 0) / 4)} N</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <Zap className="h-3 w-3" />
            <span>YIELD: {yieldRate.toFixed(1)} KG/HR</span>
          </div>
        </div>
      </div>

      {/* Main Telemetry Gauges Grid */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto bg-[#050B14]">
        {/* 4-Cable Tension Balancer */}
        <div className="bg-black/60 border border-white/10 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between font-orb text-xs font-bold text-white">
            <span className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-cyan-400" />
              Quad-Cable Line Balance (Newtons)
            </span>
            <span className="font-mono text-[10px] text-cyan-400">NOMINAL</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
            {tensions.map((t, i) => (
              <div
                key={i}
                className="bg-white/5 border border-cyan-500/20 rounded-lg p-2.5 flex items-center justify-between"
              >
                <span className="text-white/40">CABLE 0{i + 1}:</span>
                <span className="font-orb font-bold text-cyan-400">{t} N</span>
              </div>
            ))}
          </div>

          {/* Real-time Tension Trend Sparkline */}
          <div className="pt-2">
            <div className="text-[10px] font-mono text-white/40 mb-1">
              REAL-TIME TENSION FLUTTER (PAST 20s)
            </div>
            <SparklineChart data={historyTension} col="#00F0FF" height={55} />
          </div>
        </div>

        {/* System Health & Yield Metrics */}
        <div className="bg-black/60 border border-white/10 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between font-orb text-xs font-bold text-white">
            <span className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              Hardware Thermal & Power Metrics
            </span>
            <span className="font-mono text-[10px] text-emerald-400">HEALTHY</span>
          </div>

          {/* Motor Driver Temp Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-white/50">Motor Driver Temp</span>
              <span className="font-bold text-amber-400">
                {motorTemp.toFixed(1)} °C
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 transition-all duration-500"
                style={{ width: `${(motorTemp / 80) * 100}%` }}
              />
            </div>
          </div>

          {/* Battery State Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-white/50 flex items-center gap-1">
                <Battery className="h-3 w-3 text-emerald-400" /> Battery Pack
              </span>
              <span className="font-bold text-emerald-400">
                {battery.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_8px_#00A86B]"
                style={{ width: `${battery}%` }}
              />
            </div>
          </div>

          {/* Yield Rate Output Tile */}
          <div className="bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-white/40 uppercase">
                Est. Harvest Rate
              </div>
              <div className="font-orb text-2xl font-black text-emerald-400">
                {yieldRate.toFixed(1)}{" "}
                <span className="text-xs font-mono opacity-60">kg / hr</span>
              </div>
            </div>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 text-lg">
              🌾
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
