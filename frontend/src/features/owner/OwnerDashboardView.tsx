import React, { useState } from "react";
import {
  TrendingUp,
  Droplets,
  ShoppingBag,
  Users,
  CheckCircle2,
  AlertCircle,
  Activity,
  Download,
  Clock,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

// Minimalist flat SVG Line Chart component (no neon, no gradients, flat technical styling)
interface FlatLineChartProps {
  data: number[];
  color: string;
  height?: number;
  labels?: string[];
}

const FlatLineChart: React.FC<FlatLineChartProps> = ({
  data,
  color,
  height = 90,
  labels = ["06:00", "09:00", "12:00", "15:00", "18:00"],
}) => {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const width = 500;
  const paddingY = 8;
  const usableH = height - paddingY * 2;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = paddingY + (usableH - ((val - min) / (max - min || 1)) * usableH);
    return { x, y, val };
  });

  const pathD =
    "M" +
    points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ");

  return (
    <div className="w-full space-y-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        style={{ height }}
      >
        {/* Simple flat grid guidelines */}
        <line
          x1="0"
          y1={paddingY}
          x2={width}
          y2={paddingY}
          stroke="#26332F"
          strokeDasharray="2 4"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="#26332F"
          strokeDasharray="2 4"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1={height - 2}
          x2={width}
          y2={height - 2}
          stroke="#26332F"
          strokeWidth="1"
        />

        {/* Flat Primary Line (No glow, no gradient fill) */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 3.5 : 2}
            fill={i === points.length - 1 ? color : "#16201E"}
            stroke={color}
            strokeWidth="1.5"
          />
        ))}
      </svg>

      {/* Axis timestamps */}
      <div className="flex justify-between text-[10px] font-mono text-[#8FA19C]">
        {labels.map((lbl, idx) => (
          <span key={idx}>{lbl}</span>
        ))}
      </div>
    </div>
  );
};

export const OwnerDashboardView: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"today" | "7d" | "30d">("today");

  const harvestTrend = [12, 28, 45, 62, 78, 86];
  const waterTrend = [420, 780, 1150, 1600, 1950, 2300];

  const alerts = [
    {
      id: "a1",
      icon: <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />,
      title: "Target Yield Surpassed",
      description: "86 bags harvested (2,150 kg fresh flush) with 94.2% Grade-A leaf quality rating.",
      time: "24m ago",
      tag: "YIELD",
      tagColor: "text-[#4ADE80] border-[#26332F]",
    },
    {
      id: "a2",
      icon: <Droplets className="w-4 h-4 text-[#8FA19C]" />,
      title: "Deficit Irrigation Optimization",
      description: "Automated micro-misting saved 2,300 litres (22% reduction against conventional baseline).",
      time: "1h ago",
      tag: "WATER",
      tagColor: "text-[#8FA19C] border-[#26332F]",
    },
    {
      id: "a3",
      icon: <Activity className="w-4 h-4 text-[#4ADE80]" />,
      title: "Hardware Kinematics Nominal",
      description: "Cable robot completed 14 autonomous passes. Motor temperature steady at 38°C.",
      time: "2h ago",
      tag: "ROBOTICS",
      tagColor: "text-[#4ADE80] border-[#26332F]",
    },
    {
      id: "a4",
      icon: <AlertCircle className="w-4 h-4 text-[#F5A524]" />,
      title: "Targeted Chlorosis Remediation",
      description: "Canopy AI vision flagged minor nutrient deficiency in Zone 07. Bio-treatment log created.",
      time: "4h ago",
      tag: "AGRONOMY",
      tagColor: "text-[#F5A524] border-[#26332F]",
    },
  ];

  const executiveSummary = [
    { label: "Canopy Harvest Coverage", value: "86.5%", detail: "12.4 Hectares swept" },
    { label: "System Operational Uptime", value: "99.2%", detail: "Zero unplanned motor stops" },
    { label: "Direct Labor Offset", value: "92%", detail: "18 worker-days saved today" },
    { label: "CO₂ Emissions Avoided", value: "18.4 kg", detail: "100% electric aerial cable winch" },
    { label: "Estimated Daily Crop Value", value: "₹ 34,400", detail: "Based on ₹400/kg premium Grade A" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Timeframe Switcher (Flat layout) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#4ADE80] uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
            <span>Executive Operations & Commercial Insights</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#E6EDEB]">
            Owner & Estate Dashboard
          </h1>
          <p className="text-xs md:text-sm text-[#8FA19C] mt-0.5">
            Holistic economic telemetry, harvest yield tracking, labor efficiency, and resource sustainability
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#16201E] border border-[#26332F] rounded-[6px] p-0.5">
            {(["today", "7d", "30d"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-xs font-mono rounded-[4px] transition-colors ${
                  timeframe === t
                    ? "bg-[#26332F] text-[#4ADE80] font-medium"
                    : "text-[#8FA19C] hover:text-[#E6EDEB]"
                }`}
              >
                {t === "today" ? "Today" : t === "7d" ? "7 Days" : "30 Days"}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="text-xs border-[#26332F] text-[#8FA19C] hover:text-[#E6EDEB] hidden md:flex items-center gap-1.5"
            onClick={() => alert("Exporting Estate Harvest Report...")}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* 2. Top Economic & Production Metric Tiles (Flat cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="p-4 bg-[#16201E] border-[#26332F] space-y-1.5">
          <div className="flex items-center justify-between text-[#8FA19C] text-xs font-mono">
            <span>COST SAVED TODAY</span>
            <div className="w-5 h-5 rounded bg-[#0E1514] border border-[#26332F] flex items-center justify-center text-[#4ADE80] text-xs">
              ₹
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#4ADE80]">
            ₹12,450
          </div>
          <div className="text-[11px] text-[#4ADE80] font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+8.3% vs contractor manual plucking</span>
          </div>
        </Card>

        <Card className="p-4 bg-[#16201E] border-[#26332F] space-y-1.5">
          <div className="flex items-center justify-between text-[#8FA19C] text-xs font-mono">
            <span>YIELD HARVESTED</span>
            <ShoppingBag className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#E6EDEB]">
            86 <span className="text-xs font-normal text-[#8FA19C]">Bags</span>
          </div>
          <div className="text-[11px] text-[#8FA19C]">
            ~2,150 kg fresh tender shoots (Grade A)
          </div>
        </Card>

        <Card className="p-4 bg-[#16201E] border-[#26332F] space-y-1.5">
          <div className="flex items-center justify-between text-[#8FA19C] text-xs font-mono">
            <span>LABOR REDUCTION</span>
            <Users className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#4ADE80]">
            92%
          </div>
          <div className="text-[11px] text-[#8FA19C]">
            Single remote supervisor vs 20 field laborers
          </div>
        </Card>

        <Card className="p-4 bg-[#16201E] border-[#26332F] space-y-1.5">
          <div className="flex items-center justify-between text-[#8FA19C] text-xs font-mono">
            <span>WATER CONSERVED</span>
            <Droplets className="w-4 h-4 text-[#8FA19C]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#E6EDEB]">
            2,300 <span className="text-xs font-normal text-[#8FA19C]">L</span>
          </div>
          <div className="text-[11px] text-[#8FA19C] font-mono">
            ↓ 22% less water via deficit misting
          </div>
        </Card>
      </div>

      {/* 3. Productivity & Conservation Charts (Flat line charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-4 bg-[#16201E] border-[#26332F] space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-xs font-semibold text-[#E6EDEB]">
                Cumulative Harvest Productivity
              </h3>
              <p className="text-[11px] text-[#8FA19C]">
                Bags of fresh tea flush harvested across daytime shifts
              </p>
            </div>
            <div className="text-right">
              <span className="text-base font-bold font-mono text-[#4ADE80]">86 Bags</span>
            </div>
          </div>

          <FlatLineChart
            data={harvestTrend}
            color="#4ADE80"
            height={90}
            labels={["07:00", "09:00", "11:00", "13:00", "15:00", "17:00"]}
          />
        </Card>

        <Card className="p-4 bg-[#16201E] border-[#26332F] space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-xs font-semibold text-[#E6EDEB]">
                Water Savings & Micro-Misting Efficiency
              </h3>
              <p className="text-[11px] text-[#8FA19C]">
                Targeted replenishment vs conventional baseline
              </p>
            </div>
            <div className="text-right">
              <span className="text-base font-bold font-mono text-[#8FA19C]">2,300 L</span>
            </div>
          </div>

          <FlatLineChart
            data={waterTrend}
            color="#8FA19C"
            height={90}
            labels={["07:00", "09:00", "11:00", "13:00", "15:00", "17:00"]}
          />
        </Card>
      </div>

      {/* 4. Live Events Log & Executive ESG Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 spans): Operational Alerts Stream */}
        <Card className="lg:col-span-2 p-4 bg-[#16201E] border-[#26332F] space-y-3">
          <div className="flex items-center justify-between border-b border-[#26332F] pb-2.5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#4ADE80]" />
              <h3 className="text-xs font-semibold text-[#E6EDEB]">
                Operational & Agronomic Feed
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#8FA19C]">
              4 events logged today
            </span>
          </div>

          <div className="space-y-2.5">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-[8px] p-3 bg-[#0E1514] border border-[#26332F] flex items-start gap-3"
              >
                <div className="mt-0.5 shrink-0">{alert.icon}</div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#E6EDEB]">
                      {alert.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#8FA19C] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-xs text-[#8FA19C] leading-relaxed">
                    {alert.description}
                  </p>
                </div>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase shrink-0 font-medium ${alert.tagColor}`}
                >
                  {alert.tag}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Column: Executive Summary (Flat panel) */}
        <Card className="p-4 bg-[#16201E] border-[#26332F] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#26332F] pb-2.5">
              <h3 className="text-xs font-semibold text-[#E6EDEB]">Estate Performance</h3>
              <span className="text-xs font-mono text-[#4ADE80]">GRADE A</span>
            </div>

            <div className="space-y-2">
              {executiveSummary.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-1 border-b border-[#26332F] text-xs"
                >
                  <div>
                    <div className="text-[#8FA19C]">{item.label}</div>
                    <div className="text-[10px] text-[#8FA19C]/60">{item.detail}</div>
                  </div>
                  <div className="text-right font-mono font-medium text-[#E6EDEB]">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Status Pill Banner (Flat) */}
          <div className="rounded-[8px] p-2.5 bg-[#0E1514] border border-[#26332F] text-center space-y-0.5">
            <div className="text-xs font-medium text-[#4ADE80] font-mono">
              HARVEST EFFICIENCY: OPTIMAL
            </div>
            <p className="text-[11px] text-[#8FA19C]">
              Continuous canopy coverage with zero terrain degradation.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
