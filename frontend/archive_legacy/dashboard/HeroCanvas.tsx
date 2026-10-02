import { useEffect, useRef } from "react";

export function HeroCanvas() {
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
      canvas.height = Math.round(width * 0.58);
    });

    resizeObserver.observe(wrapper);

    const render = (ts: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Sky Linear Gradient
      const sk = ctx.createLinearGradient(0, 0, 0, H);
      sk.addColorStop(0, "#04080f");
      sk.addColorStop(0.55, "#071530");
      sk.addColorStop(1, "#0a1a0a");
      ctx.fillStyle = sk;
      ctx.fillRect(0, 0, W, H);

      // Star Particles
      for (let i = 0; i < 55; i++) {
        const sx = (i * 113.7) % W;
        const sy = (i * 79.3) % (H * 0.5);
        const al = 0.2 + 0.6 * Math.sin(ts * 0.001 + i * 1.3);
        ctx.fillStyle = `rgba(255,255,255,${al})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.7 + (i % 2) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tea Bush Rows
      for (let row = 0; row < 5; row++) {
        const ry = H * 0.62 + row * H * 0.08;
        for (let bx = 0; bx < W; bx += 26) {
          const green = `rgba(${8 + row * 4},${60 + row * 12},${14 + row * 4},${0.65 - row * 0.08
            })`;
          ctx.fillStyle = green;
          ctx.beginPath();
          ctx.ellipse(
            bx + 13,
            ry + Math.sin(bx * 0.05) * 4,
            12,
            8,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }

      // Ground Base
      const gg = ctx.createLinearGradient(0, H * 0.65, 0, H);
      gg.addColorStop(0, "#112212");
      gg.addColorStop(1, "#06100a");
      ctx.fillStyle = gg;
      ctx.fillRect(0, H * 0.65, W, H);

      // Cable Towers
      const pad = W * 0.08;
      const poles = [
        { x: pad, y: H * 0.12 },
        { x: W - pad, y: H * 0.12 },
        { x: pad, y: H * 0.58 },
        { x: W - pad, y: H * 0.58 },
      ];

      poles.forEach((p) => {
        ctx.strokeStyle = "rgba(0,168,107,0.55)";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, H * 0.82);
        ctx.stroke();

        const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 16);
        gr.addColorStop(0, "rgba(0,168,107,0.9)");
        gr.addColorStop(1, "rgba(0,168,107,0)");
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
        ctx.fill();
      });

      // Robot Cable Movement Loop
      const t = (ts * 0.00028) % 1;
      let rx = 0;
      let ry = 0;
      const x0 = poles[0].x;
      const y0 = poles[0].y;
      const x1 = poles[1].x;
      const y1 = poles[2].y;

      if (t < 0.25) {
        rx = x0 + (x1 - x0) * (t / 0.25);
        ry = y0;
      } else if (t < 0.5) {
        rx = x1;
        ry = y0 + (y1 - y0) * ((t - 0.25) / 0.25);
      } else if (t < 0.75) {
        rx = x1 - (x1 - x0) * ((t - 0.5) / 0.25);
        ry = y1;
      } else {
        rx = x0;
        ry = y1 - (y1 - y0) * ((t - 0.75) / 0.25);
      }

      // Cable Tethers to Robot
      poles.forEach((p) => {
        ctx.strokeStyle = "rgba(0,240,255,0.2)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 5]);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(rx, ry);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Robot Payload Carriage
      const pl = (Math.sin(ts * 0.003) + 1) / 2;
      ctx.fillStyle = "rgba(0,10,25,0.9)";
      ctx.strokeStyle = `rgba(0,240,255,${0.7 + pl * 0.3})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = 18 + pl * 12;

      // Rounded rectangle body
      ctx.beginPath();
      ctx.roundRect(rx - 16, ry - 10, 32, 20, 5);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Camera Lens
      ctx.fillStyle = "#00F0FF";
      ctx.beginPath();
      ctx.arc(rx - 5, ry, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(rx - 5, ry, 2, 0, Math.PI * 2);
      ctx.fill();

      // Harvesting Arm
      const armL = 28 + 10 * Math.sin(ts * 0.002);
      ctx.strokeStyle = "rgba(0,240,255,0.65)";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(rx + 5, ry + 10);
      ctx.lineTo(rx + 5, ry + 10 + armL);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Blade Ring Glow
      const bg = ctx.createRadialGradient(
        rx + 5,
        ry + 10 + armL,
        0,
        rx + 5,
        ry + 10 + armL,
        12 + pl * 5
      );
      bg.addColorStop(0, `rgba(0,240,255,${0.9 + pl * 0.1})`);
      bg.addColorStop(1, "rgba(0,240,255,0)");
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(rx + 5, ry + 10 + armL, 12 + pl * 5, 0, Math.PI * 2);
      ctx.fill();

      // Blade Symbol
      ctx.font = "14px Inter";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✂", rx + 5, ry + 10 + armL);

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
        height={395}
        className="w-full rounded-2xl border border-white/10 shadow-2xl"
      />
    </div>
  );
}
