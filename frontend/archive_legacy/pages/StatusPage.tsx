import { FieldMapCanvas } from "@/components/dashboard/FieldMapCanvas";
import type { Achievement, CellData, LevelInfo } from "@/types";

export const LEVELS: LevelInfo[] = [
  { n: 1, name: "Seedling", min: 0, max: 200, col: "#4ade80" },
  { n: 2, name: "Field Sprout", min: 200, max: 500, col: "#00A86B" },
  { n: 3, name: "Tea Expert", min: 500, max: 900, col: "#00c49a" },
  { n: 4, name: "Zone Master", min: 900, max: 1300, col: "#00F0FF" },
  { n: 5, name: "★ Harvest God", min: 1300, max: 1600, col: "#ffd700" },
];

interface StatusPageProps {
  cells: CellData[];
  robotPos: { r: number; c: number };
  battery: number;
  motorHealth: number;
  cableTension: number;
  xp: number;
  efficiency: number;
  isRunning: boolean;
  achievements: Achievement[];
  onToggleRun: () => void;
  onResetGame: () => void;
}

function StatTile({
  label,
  val,
  unit = "",
  icon,
  col = "#00F0FF",
  sub,
}: {
  label: string;
  val: string | number;
  unit?: string;
  icon: string;
  col?: string;
  sub?: string;
}) {
  return (
    <div className="glass-b rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2 text-white/40 text-xs font-semibold uppercase tracking-widest">
        <span className="text-base">{icon}</span>
        {label}
      </div>
      <div className="font-orb text-3xl font-black" style={{ color: col }}>
        {val}
        <span className="text-lg ml-1 opacity-50">{unit}</span>
      </div>
      {sub && <div className="text-xs text-white/30 mt-1">{sub}</div>}
    </div>
  );
}

function HBar({ label, val, icon }: { label: string; val: number; icon: string }) {
  const col = val > 60 ? "#00A86B" : val > 30 ? "#ffd700" : "#ff4444";
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="flex items-center gap-1.5 font-medium text-white/80">
          <span>{icon}</span>
          {label}
        </span>
        <span className="font-orb font-bold text-sm" style={{ color: col }}>
          {Math.round(val)}%
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${val}%`,
            background: `linear-gradient(90deg,${col}88,${col})`,
            boxShadow: `0 0 8px ${col}70`,
          }}
        />
      </div>
    </div>
  );
}

export function StatusPage({
  cells,
  robotPos,
  battery,
  motorHealth,
  cableTension,
  xp,
  efficiency,
  isRunning,
  achievements,
  onToggleRun,
  onResetGame,
}: StatusPageProps) {
  const TOTAL = 80;
  const hCount = cells.filter((c) => c.status === "harvested").length;
  const pct = Math.round((hCount / TOTAL) * 100);
  const disCount = cells.filter((c) => c.status === "disease").length;

  const lvl = LEVELS.find((l) => xp >= l.min && xp < l.max) || LEVELS[4];
  const xpPct = Math.min(
    100,
    Math.round(((xp - lvl.min) / (lvl.max - lvl.min)) * 100)
  );

  return (
    <div className="min-h-screen pt-20 px-4 pb-12 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-orb text-2xl font-black">
            Robot <span className="text-b">Status & Map</span>
          </div>
          <p className="text-white/30 text-sm mt-0.5">
            Live 10×8 field grid dashboard · Nilgiris Estate
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-orb ${isRunning ? "glass-g text-g panim-g" : "glass text-white/30"
              }`}
          >
            {isRunning ? "● RUNNING" : "○ PAUSED"}
          </span>
          <button
            onClick={onToggleRun}
            className={`btn-press px-4 py-2 rounded-xl font-orb font-bold text-xs border-2 ${isRunning
                ? "border-red-500/60 text-red-400 hover:bg-red-500/10"
                : "border-g text-g hover:bg-g/10"
              }`}
          >
            {isRunning ? "⏸ Pause" : "▶ Resume"}
          </button>
          <button
            onClick={onResetGame}
            className="btn-press px-4 py-2 rounded-xl font-orb font-bold text-xs glass border border-white/10 text-white/40 hover:border-white/30 hover:text-white"
          >
            ↺ Reset Map
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT 2-COLUMNS: 10x8 Field Map */}
        <div className="xl:col-span-2 space-y-5">
          <div className="glass-b rounded-2xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="font-orb font-bold text-sm">
                🗺️ Live Plantation Field Map (10×8 Grid)
              </span>
              <div className="flex flex-wrap gap-3 text-xs">
                {[
                  ["#00A86B", "Harvested"],
                  ["#00F0FF", "Working"],
                  ["#ff3c3c", "Disease Alert"],
                  ["rgba(255,255,255,.25)", "Pending"],
                ].map(([col, lbl]) => (
                  <div key={lbl} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{ background: col, display: "inline-block" }}
                    />
                    <span className="text-white/40">{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
            <FieldMapCanvas cells={cells} robotPos={robotPos} />
          </div>

          {/* Progress Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatTile
              label="Field Covered"
              val={pct}
              unit="%"
              icon="🌾"
              col="#00A86B"
              sub={`${hCount} of ${TOTAL} zones`}
            />
            <StatTile
              label="Robot Location"
              val={`R${robotPos.r + 1}·C${robotPos.c + 1}`}
              icon="📍"
              col="#00F0FF"
              sub="Row · Column"
            />
            <StatTile
              label="Efficiency"
              val={Math.round(efficiency)}
              unit="%"
              icon="⚡"
              col="#00A86B"
              sub="System Performance"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Gamification & Robot Health */}
        <div className="space-y-5">
          {/* Level & XP Progression */}
          <div className="glass-b rounded-2xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs text-white/35 font-semibold uppercase tracking-widest">
                  Level {lvl.n}
                </div>
                <div
                  className="font-orb text-xl font-black mt-0.5"
                  style={{ color: lvl.col }}
                >
                  {lvl.name}
                </div>
              </div>
              <div className="text-right">
                <div className="font-orb text-2xl font-black text-b">{xp}</div>
                <div className="text-xs text-white/30">XP</div>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-white/25 mb-1 font-orb">
              <span>{lvl.min} XP</span>
              <span>{lvl.max} XP</span>
            </div>
            <div className="h-4 rounded-full bg-white/5 overflow-hidden border border-white/8">
              <div
                className="h-full rounded-full xp-bar transition-all duration-500"
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <div className="text-[11px] text-white/30 mt-1.5 text-right font-orb">
              {xpPct}% to next level
            </div>

            {/* Level Tier Indicators */}
            <div className="flex gap-1.5 mt-3">
              {LEVELS.map((l) => (
                <div
                  key={l.n}
                  className="flex-1 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    background:
                      xp >= l.min ? l.col : "rgba(255,255,255,.08)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Robot Hardware Health */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <div className="font-orb font-bold text-sm text-white">
              ⚙️ Cable Robot Hardware Metrics
            </div>
            <div className="flex flex-col gap-4">
              <HBar label="Battery Pack" val={battery} icon="🔋" />
              <HBar label="Motor Driver Power" val={motorHealth} icon="⚙️" />
              <HBar label="Cable Line Tension" val={cableTension} icon="🪢" />
            </div>
          </div>

          {/* Disease Warning Alert Box */}
          {disCount > 0 && (
            <div className="rounded-2xl p-4 panim-r border border-red-500/35 bg-red-500/10 glass">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">⚠️</span>
                <span className="font-orb font-bold text-sm text-red-400">
                  Disease Detection Alert!
                </span>
              </div>
              <p className="text-xs text-white/60">
                {disCount} zone{disCount > 1 ? "s" : ""} detected with leaf pathology.
                Robot will pulse bio-fungicide treatment.
              </p>
            </div>
          )}

          {/* Achievements Grid */}
          <div className="glass rounded-2xl p-5">
            <div className="font-orb font-bold text-sm mb-3 text-white">
              🏆 Achievements
            </div>
            <div className="grid grid-cols-3 gap-2">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-center transition-all ${a.unlocked
                      ? "glass-b panim-b" + (a.justUnlocked ? " ach-pop" : "")
                      : "glass opacity-25 grayscale"
                    }`}
                >
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-[10px] font-semibold leading-tight text-white/70">
                    {a.name}
                  </span>
                  {a.unlocked && (
                    <span className="text-[9px] text-b font-orb font-bold">
                      UNLOCKED
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
