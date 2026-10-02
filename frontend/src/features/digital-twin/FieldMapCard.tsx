import { Card } from "../../components/ui/card";

export interface FieldMapCardProps {
  posX: number; // 0 to 100
  posY: number; // 0 to 100
  onCellClick?: (row: number, col: number) => void;
  className?: string;
}

export const FieldMapCard: React.FC<FieldMapCardProps> = ({
  posX,
  posY,
  onCellClick,
  className = "",
}) => {
  const rows = 8;
  const cols = 10;

  // Grid cells state (plucked, attention/disease, or pending)
  const isCellCovered = (r: number, c: number) => {
    // Demo covered pattern
    return (
      (r < 3 && c < 7) ||
      (r === 3 && c < 5) ||
      (Math.abs(r - Math.floor((posY / 100) * rows)) <= 1 &&
        c < Math.floor((posX / 100) * cols))
    );
  };

  const isCellAttention = (r: number, c: number) => {
    // Defined disease/attention cells
    return (r === 4 && c === 6) || (r === 2 && c === 8);
  };

  const currentCol = Math.min(cols, Math.max(1, Math.round((posX / 100) * (cols - 1)) + 1));
  const currentRow = Math.min(rows, Math.max(1, Math.round((posY / 100) * (rows - 1)) + 1));

  // Compute coverage percentage
  let coveredCount = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (isCellCovered(r, c)) coveredCount++;
    }
  }
  const coveragePercent = Math.round((coveredCount / (rows * cols)) * 100);

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 360;
  const pad = 36;
  const fieldW = svgWidth - pad * 2;
  const fieldH = svgHeight - pad * 2;

  // Payload coordinates in SVG
  const payloadX = pad + (posX / 100) * fieldW;
  const payloadY = pad + (posY / 100) * fieldH;

  return (
    <Card
      title="Field map"
      headerAction={
        <div className="flex items-center gap-4 text-xs font-mono text-[#8FA19C]">
          <span>
            Coverage{" "}
            <strong className="text-[#E6EDEB] font-semibold">
              {coveragePercent}%
            </strong>
          </span>
          <span className="text-[#26332F]">|</span>
          <span>
            Position{" "}
            <strong className="text-[#E6EDEB] font-semibold">
              X {Math.round(posX)} · Y {Math.round(posY)}
            </strong>
          </span>
        </div>
      }
      className={className}
    >
      <div className="relative w-full aspect-[16/10] max-h-[380px] bg-[#0E1514] rounded-[10px] border border-[#26332F] overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Defs for clean markers */}
          <defs>
            <pattern
              id="gridPattern"
              width={fieldW / cols}
              height={fieldH / rows}
              patternUnits="userSpaceOnUse"
            >
              <rect
                width={fieldW / cols}
                height={fieldH / rows}
                fill="none"
                stroke="#26332F"
                strokeWidth="0.75"
              />
            </pattern>
          </defs>

          {/* Grid background cells */}
          <g transform={`translate(${pad}, ${pad})`}>
            {Array.from({ length: rows }).map((_, r) =>
              Array.from({ length: cols }).map((_, c) => {
                const cellW = fieldW / cols;
                const cellH = fieldH / rows;
                const covered = isCellCovered(r, c);
                const attention = isCellAttention(r, c);

                return (
                  <g
                    key={`${r}-${c}`}
                    transform={`translate(${c * cellW}, ${r * cellH})`}
                    className="cursor-pointer"
                    onClick={() => onCellClick?.(r, c)}
                  >
                    <rect
                      width={cellW - 2}
                      height={cellH - 2}
                      rx="3"
                      fill={
                        attention
                          ? "rgba(245, 165, 36, 0.08)"
                          : covered
                          ? "rgba(74, 222, 128, 0.08)"
                          : "transparent"
                      }
                      stroke={
                        attention
                          ? "#F5A524"
                          : covered
                          ? "rgba(74, 222, 128, 0.25)"
                          : "#1B2625"
                      }
                      strokeWidth={attention ? "1.5" : "1"}
                    />
                    {attention && (
                      <circle
                        cx={cellW / 2 - 1}
                        cy={cellH / 2 - 1}
                        r="3"
                        fill="#F5A524"
                      />
                    )}
                  </g>
                );
              })
            )}
          </g>

          {/* Outer Frame boundary (Clean 1px outline, no wood textures) */}
          <rect
            x={pad}
            y={pad}
            width={fieldW}
            height={fieldH}
            fill="none"
            stroke="#26332F"
            strokeWidth="1.5"
            rx="4"
          />

          {/* 4 Corner Idlers (NW, NE, SW, SE) */}
          {[
            { label: "NW", x: pad, y: pad },
            { label: "NE", x: pad + fieldW, y: pad },
            { label: "SW", x: pad, y: pad + fieldH },
            { label: "SE", x: pad + fieldW, y: pad + fieldH },
          ].map((idler) => (
            <g key={idler.label}>
              <circle
                cx={idler.x}
                cy={idler.y}
                r="6"
                fill="#141D1C"
                stroke="#8FA19C"
                strokeWidth="1.5"
              />
              <circle cx={idler.x} cy={idler.y} r="2" fill="#8FA19C" />
              <text
                x={idler.x + (idler.label.includes("W") ? -12 : 12)}
                y={idler.y + (idler.label.includes("N") ? -8 : 14)}
                textAnchor="middle"
                className="fill-[#8FA19C] text-[10px] font-mono select-none"
              >
                {idler.label}
              </text>
            </g>
          ))}

          {/* 4 Suspension Cables (Thin 1.5px lines in #4ADE80 to payload) */}
          <line
            x1={pad}
            y1={pad}
            x2={payloadX}
            y2={payloadY}
            stroke="#4ADE80"
            strokeWidth="1.2"
            strokeOpacity="0.85"
          />
          <line
            x1={pad + fieldW}
            y1={pad}
            x2={payloadX}
            y2={payloadY}
            stroke="#4ADE80"
            strokeWidth="1.2"
            strokeOpacity="0.85"
          />
          <line
            x1={pad}
            y1={pad + fieldH}
            x2={payloadX}
            y2={payloadY}
            stroke="#4ADE80"
            strokeWidth="1.2"
            strokeOpacity="0.85"
          />
          <line
            x1={pad + fieldW}
            y1={pad + fieldH}
            x2={payloadX}
            y2={payloadY}
            stroke="#4ADE80"
            strokeWidth="1.2"
            strokeOpacity="0.85"
          />

          {/* Payload End-Effector */}
          <g transform={`translate(${payloadX}, ${payloadY})`}>
            {/* Crosshair lines */}
            <line x1="-12" y1="0" x2="12" y2="0" stroke="#4ADE80" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="0" y1="-12" x2="0" y2="12" stroke="#4ADE80" strokeWidth="1" strokeDasharray="2,2" />

            {/* Rounded square payload body */}
            <rect
              x="-9"
              y="-9"
              width="18"
              height="18"
              rx="4"
              fill="#141D1C"
              stroke="#4ADE80"
              strokeWidth="2"
            />
            <circle cx="0" cy="0" r="2.5" fill="#4ADE80" />

            {/* Position Chip Tag */}
            <g transform="translate(14, -14)">
              <rect
                x="0"
                y="-10"
                width="74"
                height="18"
                rx="4"
                fill="#1B2625"
                stroke="#26332F"
                strokeWidth="1"
              />
              <text
                x="6"
                y="3"
                className="fill-[#E6EDEB] text-[9.5px] font-mono font-medium"
              >
                R{currentRow}-C{currentCol} · {Math.round(posX)}%
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Legend under map (Single clean row: Payload, Covered, Attention) */}
      <div className="mt-4 flex items-center justify-between text-xs text-[#8FA19C] pt-3 border-t border-[#26332F]">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-[3px] bg-[#141D1C] border-2 border-[#4ADE80]" />
            <span>Payload</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-[3px] bg-[#4ADE80]/15 border border-[#4ADE80]/40" />
            <span>Covered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-[3px] bg-[#F5A524]/15 border border-[#F5A524]" />
            <span>Attention</span>
          </div>
        </div>

        <span className="text-[11px] text-[#8FA19C] font-mono">
          CANOPY GRID: 8 × 10 SECTORS
        </span>
      </div>
    </Card>
  );
};
