import { SparklineChart } from "@/components/dashboard/SparklineChart";
import type { CellData } from "@/types";

interface DataPageProps {
  cells: CellData[];
  robotPos: { r: number; c: number };
  battery: number;
  efficiency: number;
  history: Array<{ covered: number; battery: number; eff: number }>;
}

export function DataPage({
  cells,
  robotPos,
  battery,
  efficiency,
  history,
}: DataPageProps) {
  const TOTAL = 80;
  const GW = 10;
  const hCount = cells.filter((c) => c.status === "harvested").length;
  const pct = Math.round((hCount / TOTAL) * 100);
  const diseaseZones = cells.filter((c) => c.status === "disease");

  const statuses: CellData["status"][] = [
    "harvested",
    "in-progress",
    "disease",
    "pending",
  ];
  const labels = ["Harvested", "Working", "Disease", "Waiting"];
  const cols = ["#00A86B", "#00F0FF", "#ff3c3c", "rgba(255,255,255,.25)"];

  return (
    <div className="min-h-screen pt-20 px-4 pb-12 max-w-7xl mx-auto space-y-6">
      {/* Header Title */}
      <div>
        <div className="font-orb text-2xl font-black">
          Live <span className="text-b">Data & Analytics</span>
        </div>
        <p className="text-white/40 text-sm mt-0.5">
          Real-time telemetry performance metrics and historical trends
        </p>
      </div>

      {/* Top Key Performance Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-b rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2 text-white/40 text-xs font-semibold uppercase tracking-widest">
            <span>🌾</span> Area Harvested
          </div>
          <div className="font-orb text-3xl font-black text-g">
            {hCount * 12}
            <span className="text-lg ml-1 opacity-50">m²</span>
          </div>
          <div className="text-xs text-white/30 mt-1">{pct}% of field</div>
        </div>

        <div className="glass-b rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2 text-white/40 text-xs font-semibold uppercase tracking-widest">
            <span>📍</span> Robot Location
          </div>
          <div className="font-orb text-3xl font-black text-b">
            Z{robotPos.r * GW + robotPos.c + 1}
          </div>
          <div className="text-xs text-white/30 mt-1">
            Row {robotPos.r + 1} · Col {robotPos.c + 1}
          </div>
        </div>

        <div className="glass-b rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2 text-white/40 text-xs font-semibold uppercase tracking-widest">
            <span>⚡</span> Efficiency
          </div>
          <div className="font-orb text-3xl font-black text-g">
            {Math.round(efficiency)}
            <span className="text-lg ml-1 opacity-50">%</span>
          </div>
          <div className="text-xs text-white/30 mt-1">Above average</div>
        </div>

        <div className="glass-b rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2 text-white/40 text-xs font-semibold uppercase tracking-widest">
            <span>🔋</span> Battery Level
          </div>
          <div
            className="font-orb text-3xl font-black"
            style={{ color: battery > 50 ? "#00A86B" : "#ffd700" }}
          >
            {Math.round(battery)}
            <span className="text-lg ml-1 opacity-50">%</span>
          </div>
          <div className="text-xs text-white/30 mt-1">
            ~{Math.round(battery * 0.18)}h remaining
          </div>
        </div>
      </div>

      {/* Analytics Trend Area Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-b rounded-2xl p-5">
          <div className="font-orb font-bold text-sm mb-3 text-white">
            📈 Area Covered Over Time (m²)
          </div>
          <SparklineChart data={history.map((h) => h.covered)} col="#00F0FF" height={90} />
          <div className="flex justify-between text-[10px] text-white/30 mt-2 font-mono">
            <span>Past 20 Telemetry Cycles</span>
            <span>Live Now</span>
          </div>
        </div>

        <div className="glass-g rounded-2xl p-5">
          <div className="font-orb font-bold text-sm mb-3 text-white">
            💚 Health vs Productivity Sparklines
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="text-[10px] text-white/40 mb-1 font-mono uppercase">
                Battery Pack %
              </div>
              <SparklineChart data={history.map((h) => h.battery)} col="#00A86B" height={45} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-white/40 mb-1 font-mono uppercase">
                Efficiency %
              </div>
              <SparklineChart data={history.map((h) => h.eff)} col="#ffd700" height={45} />
            </div>
          </div>
        </div>
      </div>

      {/* Zone Breakdown & Disease Alert Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="font-orb font-bold text-sm mb-4 text-white">
            🗺️ Plantation Zone Breakdown
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statuses.map((s, i) => {
              const count = cells.filter((c) => c.status === s).length;
              const p2 = Math.round((count / TOTAL) * 100);
              return (
                <div key={s} className="glass rounded-xl p-3 text-center">
                  <div
                    className="font-orb text-3xl font-black"
                    style={{ color: cols[i] }}
                  >
                    {count}
                  </div>
                  <div className="text-xs text-white/40 mt-1 mb-2">
                    {labels[i]}
                  </div>
                  <div className="h-1 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${p2}%`, background: cols[i] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="font-orb font-bold text-sm mb-4 text-white">
            🚨 Active Disease Alerts
          </div>
          {diseaseZones.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-xs text-white/40 font-mono">All 80 zones healthy!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {diseaseZones.map((cell) => (
                <div
                  key={cell.id}
                  className="rounded-lg px-3 py-2.5 border border-red-500/30 panim-r glass flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-red-400">
                      ⚠ Zone {cell.id + 1}
                    </div>
                    <div className="text-[10px] text-white/40">
                      Row {cell.row + 1} · Col {cell.col + 1}
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-red-500/20 text-red-300 font-bold font-orb">
                    ALERT
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
