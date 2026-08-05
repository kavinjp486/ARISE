import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { StatCardData } from "@/types";
import { PLACEHOLDER_YIELD_DATA } from "@/utils/placeholderData";
import { TrendingDown, TrendingUp, Minus, BarChart3 } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface StatisticsCardsProps {
  stats: StatCardData[];
}

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendColor = {
  up: "text-accent",
  down: "text-danger",
  neutral: "text-muted-foreground",
};

function StatCard({ stat, index }: { stat: StatCardData; index: number }) {
  const TrendIcon = trendIcon[stat.trend];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
    >
      <Card className="h-full">
        <CardContent className="space-y-3 pt-5">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>
            <TrendIcon className={`h-4 w-4 ${trendColor[stat.trend]}`} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
            {stat.unit && (
              <span className="text-sm text-muted-foreground">{stat.unit}</span>
            )}
          </div>
          <Badge variant="secondary" className={trendColor[stat.trend]}>
            {stat.change}
          </Badge>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatisticsCards({ stats }: StatisticsCardsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.id} stat={stat} index={index} />
        ))}
      </div>

      {/* Yield trend chart — demo visualization */}
      <Card>
        <CardContent className="pt-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
                Harvest Yield Trend
              </p>
              <p className="text-xs text-muted-foreground">Placeholder hourly data (kg)</p>
            </div>
            <Badge variant="outline" className="gap-1.5">
              <BarChart3 className="h-3 w-3" />
              Today
            </Badge>
          </div>
          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PLACEHOLDER_YIELD_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="hour"
                  tick={{ fill: "#8fa399", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#8fa399", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111916",
                    border: "1px solid #243029",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "#8fa399" }}
                  itemStyle={{ color: "#10b981" }}
                />
                <Area
                  type="monotone"
                  dataKey="yield"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#yieldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
