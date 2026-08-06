import { useEffect, useRef } from "react";

interface RobotVisCanvasProps {
  x: number; // 0 to 100
  y: number; // 0 to 100
}

export function RobotVisCanvas({ x, y }: RobotVisCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const smoothRef = useRef({ x, y });
  const targetRef = useRef({ x, y });

  useEffect(() => {
    targetRef.current = { x, y };
  }, [x, y]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapRef.current;
    if (!canvas || !wrapper) return;

    let animId: number;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const width = entries[0].contentRect.width;
      canvas.width = Math.round(width);
      canvas.height = Math.round(width * 0.62);
    });

    resizeObserver.observe(wrapper);

    const render = (ts: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;

      // Smooth interpolation for fluid interactive movements
      smoothRef.current.x += (targetRef.current.x - smoothRef.current.x) * 0.1;
      smoothRef.current.y += (targetRef.current.y - smoothRef.current.y) * 0.1;

      const sx = smoothRef.current.x;
      const sy = smoothRef.current.y;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#070b14";
      ctx.fillRect(0, 0, W, H);

      // Grid background
      ctx.strokeStyle = "rgba(0,240,255,.04)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 40) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      // Tea Bushes at Bottom
      for (let bx = 0; bx < W; bx += 28) {
        const by = H * 0.78 + ((bx * 13) % 16);
        ctx.fillStyle = "rgba(0,60,20,.55)";
        ctx.beginPath();
        ctx.ellipse(bx + 14, by, 13, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Support Towers (Poles)
      const pad = W * 0.09;
      const poleTop = H * 0.12;
      const poles = [{ x: pad }, { x: W - pad }];

      poles.forEach((p) => {
        ctx.strokeStyle = "rgba(0,168,107,.65)";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p.x, poleTop);
        ctx.lineTo(p.x, H * 0.79);
        ctx.stroke();

        const gr = ctx.createRadialGradient(p.x, poleTop, 0, p.x, poleTop, 15);
        gr.addColorStop(0, "rgba(0,168,107,1)");
        gr.addColorStop(1, "rgba(0,168,107,0)");
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(p.x, poleTop, 15, 0, Math.PI * 2);
        ctx.fill();
      });

      // Robot X position along cable track
      const rx = pad + (sx / 100) * (W - pad * 2);
      const cabY = poleTop + 10;
      const sag = 20;

      // Sagging Cable Line Left to Robot
      ctx.strokeStyle = "rgba(0,240,255,.5)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(poles[0].x, cabY);
      ctx.quadraticCurveTo(rx, cabY + sag, rx, cabY + sag * 0.5);
      ctx.stroke();

      // Sagging Cable Line Robot to Right
      ctx.beginPath();
      ctx.moveTo(rx, cabY + sag * 0.5);
      ctx.quadraticCurveTo(rx, cabY + sag, poles[1].x, cabY);
      ctx.stroke();

      const ry = cabY + sag * 0.5;

      // Robot Payload Carriage Body
      const pl = (Math.sin(ts * 0.003) + 1) / 2;
      ctx.fillStyle = "rgba(0,12,28,.92)";
      ctx.strokeStyle = `rgba(0,240,255,${0.75 + pl * 0.25})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = 18 + pl * 10;

      ctx.beginPath();
      ctx.roundRect(rx - 18, ry - 11, 36, 22, 6);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Camera Lens
      ctx.fillStyle = "#00F0FF";
      ctx.beginPath();
      ctx.arc(rx - 6, ry, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(rx - 6, ry, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Vertical Arm Extension Depth Y
      const armTop = ry + 11;
      const armLen = H * 0.52 * (sy / 100);

      ctx.strokeStyle = "rgba(0,240,255,.7)";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(rx + 7, armTop);
      ctx.lineTo(rx + 7, armTop + armLen);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Rotating Blade Cutter at Tip
      const bly = armTop + armLen;
      const bg2 = ctx.createRadialGradient(
        rx + 7,
        bly,
        0,
        rx + 7,
        bly,
        15 + pl * 6
      );
      bg2.addColorStop(0, `rgba(0,240,255,${0.88 + pl * 0.12})`);
      bg2.addColorStop(1, "rgba(0,240,255,0)");
      ctx.fillStyle = bg2;
      ctx.beginPath();
      ctx.arc(rx + 7, bly, 15 + pl * 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "14px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✂", rx + 7, bly);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="w-full">
      <canvas
        ref={canvasRef}
        width={680}
        height={420}
        className="w-full rounded-2xl border border-white/10 shadow-2xl"
      />
    </div>
  );
}
