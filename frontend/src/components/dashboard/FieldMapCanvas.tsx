import { useEffect, useRef } from "react";
import type { CellData } from "@/types";

interface FieldMapCanvasProps {
  cells: CellData[];
  robotPos: { r: number; c: number };
}

const GW = 10;
const GH = 8;

export function FieldMapCanvas({ cells, robotPos }: FieldMapCanvasProps) {
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
      canvas.height = Math.round(width * (GH / GW) * 1.04);
    });

    resizeObserver.observe(wrapper);

    const render = (ts: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const CW = canvas.width;
      const CH = canvas.height;
      const PAD = 14;
      const cw = (CW - PAD * 2) / GW;
      const ch = (CH - PAD * 2) / GH;
      const p = (Math.sin(ts * 0.0035) + 1) / 2;

      ctx.fillStyle = "#070b14";
      ctx.fillRect(0, 0, CW, CH);

      // Render 10x8 Cells
      cells.forEach((cell) => {
        const cx = PAD + cell.col * cw;
        const cy = PAD + cell.row * ch;
        const isR = cell.row === robotPos.r && cell.col === robotPos.c;

        let fill = "rgba(255,255,255,.035)";
        let stroke = "rgba(255,255,255,.07)";
        let shadow = "";
        let shadowBlur = 0;

        switch (cell.status) {
          case "harvested":
            fill = `rgba(0,168,107,${0.2 + p * 0.08})`;
            stroke = "#00A86B";
            shadow = "rgba(0,168,107,.6)";
            shadowBlur = 8 + p * 5;
            break;
          case "in-progress":
            fill = `rgba(0,240,255,${0.15 + p * 0.18})`;
            stroke = "#00F0FF";
            shadow = "rgba(0,240,255,.8)";
            shadowBlur = 10 + p * 8;
            break;
          case "disease":
            fill = `rgba(255,60,60,${0.18 + p * 0.28})`;
            stroke = "#ff3c3c";
            shadow = "rgba(255,60,60,.7)";
            shadowBlur = 8 + p * 10;
            break;
        }

        ctx.shadowColor = shadow || "transparent";
        ctx.shadowBlur = shadowBlur;
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.roundRect(cx + 2, cy + 2, cw - 4, ch - 4, 3);
        ctx.fill();

        ctx.strokeStyle = isR ? "#fff" : stroke;
        ctx.lineWidth = isR ? 2.5 : 1;
        ctx.beginPath();
        ctx.roundRect(cx + 2, cy + 2, cw - 4, ch - 4, 3);
        ctx.stroke();
        ctx.shadowBlur = 0;

        const fs = Math.min(cw, ch) * 0.32;
        ctx.font = `${fs}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (cell.status === "harvested") {
          ctx.fillStyle = "rgba(0,168,107,.55)";
          ctx.fillText("✓", cx + cw / 2, cy + ch / 2);
        }
        if (cell.status === "disease") {
          ctx.fillStyle = `rgba(255,100,100,${0.6 + p * 0.4})`;
          ctx.fillText("⚠", cx + cw / 2, cy + ch / 2);
        }
      });

      // Cables from Corners to Robot
      const rpx = PAD + robotPos.c * cw + cw / 2;
      const rpy = PAD + robotPos.r * ch + ch / 2;

      [
        [PAD, PAD],
        [PAD + GW * cw, PAD],
        [PAD, PAD + GH * ch],
        [PAD + GW * cw, PAD + GH * ch],
      ].forEach(([px, py]) => {
        ctx.strokeStyle = `rgba(0,240,255,${0.12 + p * 0.06})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 5]);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(rpx, rpy);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Robot Glow Indicator
      const rg = ctx.createRadialGradient(rpx, rpy, 0, rpx, rpy, cw * 0.45);
      rg.addColorStop(0, `rgba(0,240,255,${0.7 + p * 0.3})`);
      rg.addColorStop(0.5, "rgba(0,168,107,.3)");
      rg.addColorStop(1, "rgba(0,240,255,0)");
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(rpx, rpy, cw * 0.45, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = `${Math.min(cw, ch) * 0.5}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🤖", rpx, rpy);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [cells, robotPos]);

  return (
    <div ref={wrapRef} className="w-full">
      <canvas ref={canvasRef} width={640} height={535} className="w-full rounded-xl" />
    </div>
  );
}
