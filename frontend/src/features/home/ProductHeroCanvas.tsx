import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

export const ProductHeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const isPlayingRef = useRef(true);
  isPlayingRef.current = isPlaying;

  const animStateRef = useRef({
    time: 0,
    speed: 1,
    robotPos: { x: 0, y: 0, z: 0 },
  });

  const handleReset = () => {
    animStateRef.current.time = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const handleResize = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width);
      const h = Math.round(Math.min(w * 0.52, 400));

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const render = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      if (isPlayingRef.current) {
        animStateRef.current.time += dt * animStateRef.current.speed;
      }

      const ctx = canvas.getContext("2d");
      if (ctx) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const W = canvas.width / dpr;
        const H = canvas.height / dpr;

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, W, H);

        const t = animStateRef.current.time;

        // 1. Flat Clean Background (No radial glow, no neon)
        ctx.fillStyle = "#0E1514";
        ctx.fillRect(0, 0, W, H);

        // Distant Hill Silhouette (Flat muted panel)
        ctx.beginPath();
        ctx.moveTo(0, H * 0.52);
        ctx.bezierCurveTo(W * 0.25, H * 0.46, W * 0.45, H * 0.56, W * 0.7, H * 0.48);
        ctx.bezierCurveTo(W * 0.85, H * 0.44, W * 0.95, H * 0.52, W, H * 0.5);
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        ctx.fillStyle = "#121C1A";
        ctx.fill();

        // 2. Flat Tea Rows (Layered bushes with calm matte colors)
        const rows = 4;
        for (let row = 0; row < rows; row++) {
          const rowY = H * 0.65 + row * (H * 0.09);
          const bushR = 15 + row * 4;
          const stepX = 26 + row * 4;

          // Flat row color progression
          const rowColors = ["#172B24", "#1C362D", "#224337", "#2B5244"];
          ctx.fillStyle = rowColors[row] || "#1C362D";

          for (let bx = -bushR; bx < W + bushR * 2; bx += stepX) {
            const bushY = rowY + Math.sin((bx + row * 30) * 0.035) * 5;
            ctx.beginPath();
            ctx.ellipse(bx, bushY, bushR, bushR * 0.62, 0, 0, Math.PI * 2);
            ctx.fill();

            // Simple 1px subtle leaf mark at canopy surface
            if (row >= 1 && (bx * 7) % 4 === 0) {
              ctx.strokeStyle = "#3D705C";
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(bx - 2, bushY - bushR * 0.6);
              ctx.lineTo(bx, bushY - bushR * 0.85);
              ctx.lineTo(bx + 2, bushY - bushR * 0.6);
              ctx.stroke();
            }
          }
        }

        // 3. 4 Suspension Pylons (Flat, clean, industrial)
        const padX = W * 0.08;
        const poleTopY = H * 0.16;
        const poleBaseY = H * 0.82;

        const poles = [
          { x: padX, y: poleTopY },
          { x: W - padX, y: poleTopY },
          { x: padX * 1.3, y: H * 0.58 },
          { x: W - padX * 1.3, y: H * 0.58 },
        ];

        poles.forEach((p) => {
          // Flat vertical pylon mast
          ctx.strokeStyle = "#26332F";
          ctx.lineWidth = 3;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, poleBaseY);
          ctx.stroke();

          // Pulley wheel
          ctx.fillStyle = "#16201E";
          ctx.strokeStyle = "#4ADE80";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Solid LED indicator (flat dot, no glow)
          ctx.fillStyle = "#4ADE80";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();

          // Pylon base
          ctx.fillStyle = "#26332F";
          ctx.fillRect(p.x - 5, poleBaseY - 2, 10, 4);
        });

        // 4. Robot Trajectory Calculation (Rectangular sweep)
        const loopDuration = 16;
        const cycleProgress = (t % loopDuration) / loopDuration;

        const p0 = poles[0];
        const p1 = poles[1];
        const p2 = poles[3];
        const p3 = poles[2];

        let rx = 0;
        let ry = 0;
        if (cycleProgress < 0.25) {
          const u = cycleProgress / 0.25;
          rx = p0.x + (p1.x - p0.x) * u;
          ry = p0.y + (p1.y - p0.y) * u;
        } else if (cycleProgress < 0.5) {
          const u = (cycleProgress - 0.25) / 0.25;
          rx = p1.x + (p2.x - p1.x) * u;
          ry = p1.y + (p2.y - p1.y) * u;
        } else if (cycleProgress < 0.75) {
          const u = (cycleProgress - 0.5) / 0.25;
          rx = p2.x + (p3.x - p2.x) * u;
          ry = p2.y + (p3.y - p2.y) * u;
        } else {
          const u = (cycleProgress - 0.75) / 0.25;
          rx = p3.x + (p0.x - p3.x) * u;
          ry = p3.y + (p0.y - p3.y) * u;
        }

        animStateRef.current.robotPos = {
          x: Number(((rx / W) * 50).toFixed(1)),
          y: Number(((ry / H) * 40).toFixed(1)),
          z: Number((1.25 + Math.sin(t * 1.5) * 0.2).toFixed(2)),
        };

        // 5. Suspension Cables (Clean flat 1px lines, no bright pulse)
        poles.forEach((p) => {
          ctx.strokeStyle = "#384A45";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(rx, ry);
          ctx.stroke();
        });

        // 6. Downward Optical Scanning Region (Flat subtle stroke, no bright lasers)
        const scanConeHeight = 52;
        const scanConeWidth = 40;
        ctx.strokeStyle = "rgba(74, 222, 128, 0.25)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(rx, ry + 10);
        ctx.lineTo(rx - scanConeWidth / 2, ry + 10 + scanConeHeight);
        ctx.lineTo(rx + scanConeWidth / 2, ry + 10 + scanConeHeight);
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);

        // 7. Articulated Plucker Arm & Cutter
        const armCycle = Math.sin(t * 3.5);
        const armLength = 24 + armCycle * 5;
        const armX = rx + 6;
        const armY = ry + 10;

        ctx.strokeStyle = "#8FA19C";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(armX, armY);
        ctx.lineTo(armX, armY + armLength);
        ctx.stroke();

        const cutterY = armY + armLength;
        ctx.fillStyle = "#16201E";
        ctx.strokeStyle = "#4ADE80";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(armX, cutterY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 8. Robot Body Carriage (Flat dark slate, clean 1px border)
        const carW = 34;
        const carH = 18;
        const carX = rx - carW / 2;
        const carY = ry - carH / 2;

        ctx.fillStyle = "#16201E";
        ctx.strokeStyle = "#26332F";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(carX, carY, carW, carH, 4);
        ctx.fill();
        ctx.stroke();

        // Camera lens (flat dark circle)
        ctx.fillStyle = "#0E1514";
        ctx.strokeStyle = "#4ADE80";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(rx - 6, ry, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Status LED (flat green dot)
        ctx.fillStyle = "#4ADE80";
        ctx.beginPath();
        ctx.arc(rx + 8, ry - 3, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-[12px] overflow-hidden border border-[#26332F] bg-[#0E1514] select-none"
    >
      <canvas ref={canvasRef} className="block w-full" />

      {/* Top Left Telemetry Overlay (Flat, simple) */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-[6px] bg-[#16201E] border border-[#26332F] text-[11px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
          <span className="text-[#4ADE80] font-medium">4-CABLE KINEMATICS</span>
          <span className="text-[#8FA19C]">| 142 N</span>
        </div>
      </div>

      {/* Bottom Coordinates & Live Status Readout */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 pointer-events-none">
        <div className="px-2.5 py-1 rounded-[6px] bg-[#16201E] border border-[#26332F] text-[11px] font-mono text-[#E6EDEB] flex items-center gap-3">
          <span>
            X: <strong className="text-[#4ADE80] font-normal">{animStateRef.current.robotPos.x}m</strong>
          </span>
          <span>
            Y: <strong className="text-[#4ADE80] font-normal">{animStateRef.current.robotPos.y}m</strong>
          </span>
          <span>
            Z: <strong className="text-[#4ADE80] font-normal">-{animStateRef.current.robotPos.z}m</strong>
          </span>
        </div>
      </div>

      {/* Bottom Right Controls (Play/Pause, Reset) */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          className="h-7 px-2.5 rounded-[6px] bg-[#16201E] hover:bg-[#1B2625] border border-[#26332F] text-[#E6EDEB] text-xs font-mono flex items-center gap-1.5 transition-colors"
          title={isPlaying ? "Pause Simulation" : "Resume Simulation"}
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span className="hidden sm:inline">{isPlaying ? "Pause" : "Play"}</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="h-7 w-7 rounded-[6px] bg-[#16201E] hover:bg-[#1B2625] border border-[#26332F] text-[#8FA19C] hover:text-[#E6EDEB] flex items-center justify-center transition-colors"
          title="Reset Loop"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
