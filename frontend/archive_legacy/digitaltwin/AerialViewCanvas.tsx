import { useEffect, useRef } from "react";
import type { CellData } from "@/types";

interface AerialViewCanvasProps {
  cells: CellData[];
  robotPos: { r: number; c: number };
  controlX: number;
  controlY: number;
}

const GW = 10;
const GH = 8;

export function AerialViewCanvas({
  cells,
  robotPos,
  controlX,
  controlY,
}: AerialViewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapRef.current;
    if (!canvas || !wrapper) return;

    let animId: number;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const width = entries[0].contentRect.width;
      canvas.width = Math.round(width);
      canvas.height = Math.round(width * 0.65);
    });

    resizeObserver.observe(wrapper);

    const render = (ts: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;
      const PAD = 24;
      const cw = (W - PAD * 2) / GW;
      const ch = (H - PAD * 2) / GH;
      const p = (Math.sin(ts * 0.003) + 1) / 2;

      ctx.fillStyle = "#04080F";
      ctx.fillRect(0, 0, W, H);

      // Render Tactical Grid Lines
      ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Render 10x8 Zone Grid
      cells.forEach((cell) => {
        const cx = PAD + cell.col * cw;
        const cy = PAD + cell.row * ch;
        const isR = cell.row === robotPos.r && cell.col === robotPos.c;

        let fill = "rgba(255, 255, 255, 0.02)";
        let stroke = "rgba(255, 255, 255, 0.06)";
        let shadow = "";
        let shadowBlur = 0;

        if (cell.status === "harvested") {
          fill = `rgba(0, 168, 107, ${0.18 + p * 0.08})`;
          stroke = "rgba(0, 168, 107, 0.7)";
          shadow = "rgba(0, 168, 107, 0.5)";
          shadowBlur = 6;
        } else if (cell.status === "disease") {
          fill = `rgba(255, 60, 60, ${0.2 + p * 0.25})`;
          stroke = "rgba(255, 60, 60, 0.8)";
          shadow = "rgba(255, 60, 60, 0.7)";
          shadowBlur = 10;
        } else if (isR) {
          fill = `rgba(0, 240, 255, ${0.15 + p * 0.15})`;
          stroke = "#00F0FF";
          shadow = "#00F0FF";
          shadowBlur = 12;
        }

        ctx.shadowColor = shadow || "transparent";
        ctx.shadowBlur = shadowBlur;
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.roundRect(cx + 2, cy + 2, cw - 4, ch - 4, 4);
        ctx.fill();

        ctx.strokeStyle = stroke;
        ctx.lineWidth = isR ? 2 : 1;
        ctx.beginPath();
        ctx.roundRect(cx + 2, cy + 2, cw - 4, ch - 4, 4);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Zone ID & Icons
        const fs = Math.min(cw, ch) * 0.28;
        ctx.font = `${fs}px Orbitron, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (cell.status === "harvested") {
          ctx.fillStyle = "rgba(0,168,107,0.7)";
          ctx.fillText("✓", cx + cw / 2, cy + ch / 2);
        } else if (cell.status === "disease") {
          ctx.fillStyle = `rgba(255,100,100,${0.7 + p * 0.3})`;
          ctx.fillText("⚠", cx + cw / 2, cy + ch / 2);
        } else {
          ctx.fillStyle = "rgba(255,255,255,0.18)";
          ctx.fillText(`Z${cell.id + 1}`, cx + cw / 2, cy + ch / 2);
        }
      });

      // 4 Corner Cable Support Towers
      const towers = [
        { name: "TOWER A", x: PAD, y: PAD },
        { name: "TOWER B", x: W - PAD, y: PAD },
        { name: "TOWER C", x: PAD, y: H - PAD },
        { name: "TOWER D", x: W - PAD, y: H - PAD },
      ];

      // Smooth Robot Position Calculation
      const rx = PAD + (controlX / 100) * (W - PAD * 2);
      const ry = PAD + (controlY / 100) * (H - PAD * 2);

      // Render Cable Suspension Lines from Towers to Robot
      towers.forEach((tower) => {
        // Outer glow cable line
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.25 + p * 0.1})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(tower.x, tower.y);
        ctx.lineTo(rx, ry);
        ctx.stroke();
        ctx.setLineDash([]);

        // Tower Anchor Node
        const tg = ctx.createRadialGradient(
          tower.x,
          tower.y,
          0,
          tower.x,
          tower.y,
          12
        );
        tg.addColorStop(0, "#00A86B");
        tg.addColorStop(1, "rgba(0, 168, 107, 0)");
        ctx.fillStyle = tg;
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#00A86B";
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Animated Cable Robot Carriage (Digital Twin Node)
      const rg = ctx.createRadialGradient(rx, ry, 0, rx, ry, 26 + p * 8);
      rg.addColorStop(0, `rgba(0, 240, 255, ${0.8 + p * 0.2})`);
      rg.addColorStop(0.5, "rgba(0, 168, 107, 0.35)");
      rg.addColorStop(1, "rgba(0, 240, 255, 0)");
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(rx, ry, 26 + p * 8, 0, Math.PI * 2);
      ctx.fill();

      // Robot Body Box
      ctx.fillStyle = "rgba(4, 12, 24, 0.95)";
      ctx.strokeStyle = "#00F0FF";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.roundRect(rx - 14, ry - 10, 28, 20, 4);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Robot Lens Core
      ctx.fillStyle = "#00F0FF";
      ctx.beginPath();
      ctx.arc(rx, ry, 4, 0, Math.PI * 2);
      ctx.fill();

      // Coordinate HUD Overlay Tag
      ctx.font = "9px Orbitron, monospace";
      ctx.fillStyle = "#00F0FF";
      ctx.textAlign = "center";
      ctx.fillText(
        `X:${Math.round(controlX)}% Y:${Math.round(controlY)}%`,
        rx,
        ry + 22
      );

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [cells, robotPos, controlX, controlY]);

  return (
    <div ref={wrapRef} className="w-full h-full relative flex flex-col">
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10 font-orb text-xs font-bold text-cyan-400 select-none">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          VIEWPORT A — 🛰️ AERIAL TRACK & CROP HEATMAP
        </span>
        <span className="font-mono text-[10px] text-white/40">
          GRID 10×8 | TOP-DOWN
        </span>
      </div>
      <div className="flex-1 w-full relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
}
