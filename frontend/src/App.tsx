import { useCallback, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ControlPage } from "@/pages/ControlPage";
import { DataPage } from "@/pages/DataPage";
import { LandingPage } from "@/pages/LandingPage";
import { StatusPage } from "@/pages/StatusPage";
import type { Achievement, CellData, NavTab } from "@/types";

const GW = 10;
const GH = 8;
const TOTAL = GW * GH;

const ACH_DEF: Achievement[] = [
  { id: "first", icon: "🌱", name: "First Cut!", desc: "Harvested first zone", unlocked: false },
  { id: "quarter", icon: "⚡", name: "25% Cleared", desc: "Quarter field done", unlocked: false },
  { id: "half", icon: "🔥", name: "Halfway Hero", desc: "50% field covered", unlocked: false },
  { id: "disease", icon: "🔬", name: "Disease Buster", desc: "Treated a disease zone", unlocked: false },
  { id: "full", icon: "🏆", name: "Full Harvest!", desc: "100% field complete", unlocked: false },
  { id: "speed", icon: "💎", name: "Speed Champion", desc: "Covered 10 zones fast", unlocked: false },
];

function snakePath() {
  const p: { r: number; c: number }[] = [];
  for (let r = 0; r < GH; r++) {
    if (r % 2 === 0) for (let c = 0; c < GW; c++) p.push({ r, c });
    else for (let c = GW - 1; c >= 0; c--) p.push({ r, c });
  }
  return p;
}

const PATH = snakePath();

function makeCells(): CellData[] {
  const dis = new Set<number>();
  while (dis.size < 6) {
    const i = Math.floor(Math.random() * TOTAL);
    if (Math.floor(i / GW) >= 2) dis.add(i);
  }
  return Array.from({ length: TOTAL }, (_, i) => ({
    id: i,
    row: Math.floor(i / GW),
    col: i % GW,
    status: dis.has(i) ? "disease" : "pending",
  }));
}

interface AppState {
  cells: CellData[];
  robotPos: { r: number; c: number };
  pathIdx: number;
  battery: number;
  motorHealth: number;
  cableTension: number;
  xp: number;
  efficiency: number;
  isRunning: boolean;
  achievements: Achievement[];
  history: Array<{ covered: number; battery: number; eff: number }>;
  controlX: number;
  controlY: number;
}

function makeInitialState(): AppState {
  return {
    cells: makeCells(),
    robotPos: { r: 0, c: 0 },
    pathIdx: 0,
    battery: 100,
    motorHealth: 96,
    cableTension: 88,
    xp: 0,
    efficiency: 97,
    isRunning: true,
    achievements: ACH_DEF,
    history: Array.from({ length: 20 }, () => ({ covered: 0, battery: 100, eff: 97 })),
    controlX: 50,
    controlY: 50,
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("landing");
  const [state, setState] = useState<AppState>(makeInitialState);

  // Simulation Loop Tick
  useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      setState((prev) => {
        const nextIdx = (prev.pathIdx + 1) % PATH.length;
        const pos = PATH[nextIdx];
        const cellId = pos.r * GW + pos.c;

        const newCells = prev.cells.map((c) => {
          if (c.id === cellId) {
            return {
              ...c,
              status: c.status === "disease" ? ("disease" as const) : ("harvested" as const),
            };
          }
          return c;
        });

        const harvestedCount = newCells.filter((c) => c.status === "harvested").length;
        const newXp = harvestedCount * 20;

        // Unlock achievements
        const newAch = prev.achievements.map((a) => {
          let unlock = a.unlocked;
          if (a.id === "first" && harvestedCount >= 1) unlock = true;
          if (a.id === "quarter" && harvestedCount >= 20) unlock = true;
          if (a.id === "half" && harvestedCount >= 40) unlock = true;
          if (a.id === "full" && harvestedCount >= 80) unlock = true;
          return { ...a, unlocked: unlock };
        });

        // Dynamic History
        const newHistory = [
          ...prev.history.slice(1),
          {
            covered: harvestedCount * 12,
            battery: Math.max(20, prev.battery - 0.2),
            eff: prev.efficiency,
          },
        ];

        return {
          ...prev,
          cells: newCells,
          pathIdx: nextIdx,
          robotPos: pos,
          battery: Math.max(15, prev.battery - 0.05),
          xp: newXp,
          achievements: newAch,
          history: newHistory,
          // Sync control X/Y percentage position
          controlX: ((pos.c + 0.5) / GW) * 100,
          controlY: ((pos.r + 0.5) / GH) * 100,
        };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [state.isRunning]);

  const handleToggleRun = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const handleResetGame = useCallback(() => {
    setState(makeInitialState());
  }, []);

  const handleControlChange = useCallback((x: number, y: number) => {
    setState((prev) => ({
      ...prev,
      controlX: x,
      controlY: y,
    }));
  }, []);

  const handleHarvestPulse = useCallback(() => {
    setState((prev) => {
      const currentCellId = prev.robotPos.r * GW + prev.robotPos.c;
      const newCells = prev.cells.map((c) =>
        c.id === currentCellId ? { ...c, status: "harvested" as const } : c
      );
      return {
        ...prev,
        cells: newCells,
        xp: prev.xp + 25,
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#070b14] text-white font-sans selection:bg-g selection:text-black">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "landing" && <LandingPage go={setActiveTab} />}

      {activeTab === "status" && (
        <StatusPage
          cells={state.cells}
          robotPos={state.robotPos}
          battery={state.battery}
          motorHealth={state.motorHealth}
          cableTension={state.cableTension}
          xp={state.xp}
          efficiency={state.efficiency}
          isRunning={state.isRunning}
          achievements={state.achievements}
          onToggleRun={handleToggleRun}
          onResetGame={handleResetGame}
        />
      )}

      {activeTab === "data" && (
        <DataPage
          cells={state.cells}
          robotPos={state.robotPos}
          battery={state.battery}
          efficiency={state.efficiency}
          history={state.history}
        />
      )}

      {activeTab === "control" && (
        <ControlPage
          controlX={state.controlX}
          controlY={state.controlY}
          isRunning={state.isRunning}
          onControlChange={handleControlChange}
          onToggleRun={handleToggleRun}
          onHarvestPulse={handleHarvestPulse}
        />
      )}
    </div>
  );
}
