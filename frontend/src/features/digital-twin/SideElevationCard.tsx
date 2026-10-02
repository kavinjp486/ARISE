import { Card } from "../../components/ui/card";

export interface SideElevationCardProps {
  depthZ: number; // 0 to 100%
  shootsCount?: number;
  maxShoots?: number;
  className?: string;
}

export const SideElevationCard: React.FC<SideElevationCardProps> = ({
  depthZ,
  shootsCount = 24,
  maxShoots = 60,
  className = "",
}) => {
  const hopperPercent = Math.min(100, Math.round((shootsCount / maxShoots) * 100));

  // SVG dimensions
  const svgWidth = 280;
  const svgHeight = 240;

  // Rail dimensions
  const railLeftX = 40;
  const railRightX = svgWidth - 40;
  const railTopY = 30;
  const railBottomY = 210;

  // Payload vertical position based on depthZ
  const payloadY = railTopY + 20 + (depthZ / 100) * (railBottomY - railTopY - 60);
  const payloadCenterX = svgWidth / 2;

  return (
    <Card
      title="Side elevation"
      headerAction={
        <span className="text-xs font-mono text-[#8FA19C]">
          Depth{" "}
          <strong className="text-[#E6EDEB] font-semibold">
            {Math.round(depthZ)}%
          </strong>
        </span>
      }
      className={className}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Line drawing SVG */}
        <div className="w-full aspect-[4/3] bg-[#0E1514] rounded-[10px] border border-[#26332F] overflow-hidden relative select-none">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Top crossbeam */}
            <line
              x1={railLeftX}
              y1={railTopY}
              x2={railRightX}
              y2={railTopY}
              stroke="#26332F"
              strokeWidth="2"
            />

            {/* Left Rail (1px outline) */}
            <line
              x1={railLeftX}
              y1={railTopY}
              x2={railLeftX}
              y2={railBottomY}
              stroke="#26332F"
              strokeWidth="1.5"
            />
            {/* Right Rail (1px outline) */}
            <line
              x1={railRightX}
              y1={railTopY}
              x2={railRightX}
              y2={railBottomY}
              stroke="#26332F"
              strokeWidth="1.5"
            />

            {/* Horizontal labels near rails */}
            <text
              x={railLeftX - 6}
              y={railTopY + 14}
              textAnchor="end"
              className="fill-[#8FA19C] text-[9px] font-mono select-none"
            >
              Tower A
            </text>
            <text
              x={railRightX + 6}
              y={railTopY + 14}
              textAnchor="start"
              className="fill-[#8FA19C] text-[9px] font-mono select-none"
            >
              Tower B
            </text>

            {/* Suspension lines from top corners to payload */}
            <line
              x1={railLeftX}
              y1={railTopY}
              x2={payloadCenterX - 24}
              y2={payloadY}
              stroke="#4ADE80"
              strokeWidth="1.2"
              strokeOpacity="0.8"
            />
            <line
              x1={railRightX}
              y1={railTopY}
              x2={payloadCenterX + 24}
              y2={payloadY}
              stroke="#4ADE80"
              strokeWidth="1.2"
              strokeOpacity="0.8"
            />

            {/* Payload Carrier Block */}
            <g transform={`translate(${payloadCenterX - 28}, ${payloadY})`}>
              <rect
                x="0"
                y="0"
                width="56"
                height="24"
                rx="4"
                fill="#141D1C"
                stroke="#4ADE80"
                strokeWidth="1.5"
              />
              <text
                x="28"
                y="15"
                textAnchor="middle"
                className="fill-[#E6EDEB] text-[9px] font-mono font-medium"
              >
                CARRIER
              </text>
            </g>

            {/* Plucker Lead-Screw Extension downward */}
            <line
              x1={payloadCenterX}
              y1={payloadY + 24}
              x2={payloadCenterX}
              y2={payloadY + 44}
              stroke="#8FA19C"
              strokeWidth="2"
              strokeDasharray="2,2"
            />
            {/* End effector cutter head */}
            <rect
              x={payloadCenterX - 8}
              y={payloadY + 44}
              width="16"
              height="8"
              rx="2"
              fill="#4ADE80"
            />

            {/* Dimension line on the right */}
            <line
              x1={railRightX - 16}
              y1={railTopY}
              x2={railRightX - 16}
              y2={payloadY + 48}
              stroke="#8FA19C"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            <circle cx={railRightX - 16} cy={railTopY} r="2" fill="#8FA19C" />
            <circle cx={railRightX - 16} cy={payloadY + 48} r="2" fill="#8FA19C" />
            <text
              x={railRightX - 22}
              y={(railTopY + payloadY + 48) / 2 + 3}
              textAnchor="end"
              className="fill-[#8FA19C] text-[9px] font-mono"
            >
              Z {Math.round(depthZ)}%
            </text>

            {/* Canopy datum line at bottom */}
            <line
              x1={railLeftX}
              y1={railBottomY}
              x2={railRightX}
              y2={railBottomY}
              stroke="#26332F"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <text
              x={payloadCenterX}
              y={railBottomY - 6}
              textAnchor="middle"
              className="fill-[#8FA19C] text-[8.5px] font-mono uppercase tracking-wider"
            >
              Canopy Baseline (0.0 m)
            </text>
          </svg>
        </div>

        {/* Hopper Fill Level (Thin progress bar with shoots text) */}
        <div className="mt-4 pt-3 border-t border-[#26332F] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8FA19C]">Hopper load</span>
            <span className="font-mono text-[#E6EDEB] font-medium">
              {shootsCount} shoots{" "}
              <span className="text-[#8FA19C]">({hopperPercent}%)</span>
            </span>
          </div>

          <div className="w-full bg-[#1B2625] h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4ADE80] transition-all duration-300 rounded-full"
              style={{ width: `${hopperPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
