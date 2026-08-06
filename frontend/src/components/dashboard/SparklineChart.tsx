interface SparklineChartProps {
  data: number[];
  col: string;
  height?: number;
}

export function SparklineChart({ data, col, height = 70 }: SparklineChartProps) {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data, 1);
  const min = 0;
  const W = 300;

  const xs = data.map((_, i) => (i / (data.length - 1)) * W);
  const ys = data.map((v) => height - ((v - min) / (max - min)) * height);

  const path = "M" + xs.map((x, i) => `${x},${ys[i]}`).join("L");
  const area = `${path}L${W},${height}L0,${height}Z`;
  const last = { x: xs[xs.length - 1], y: ys[ys.length - 1] };
  const gradId = `g${col.replace("#", "")}`;

  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col} stopOpacity={0.28} />
          <stop offset="100%" stopColor={col} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path
        d={path}
        fill="none"
        stroke={col}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 5px ${col})` }}
      />
      <circle
        cx={last.x}
        cy={last.y}
        r="4"
        fill={col}
        style={{ filter: `drop-shadow(0 0 7px ${col})` }}
      />
    </svg>
  );
}
