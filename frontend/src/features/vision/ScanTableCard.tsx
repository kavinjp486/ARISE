import { Card } from "../../components/ui/card";
import { StatusPill } from "../../components/ui/StatusPill";

export interface ScanRecord {
  id: string;
  time: string;
  status: "healthy" | "diseased";
  diagnosis: string;
  confidence: number;
}

export const ScanTableCard: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  // Realistic, unique sequential scans with unique timestamps
  const scans: ScanRecord[] = [
    {
      id: "SCN-1048",
      time: "14:28:42",
      status: "healthy",
      diagnosis: "Two Leaves & A Bud",
      confidence: 96.4,
    },
    {
      id: "SCN-1047",
      time: "14:26:19",
      status: "healthy",
      diagnosis: "Two Leaves & A Bud",
      confidence: 98.1,
    },
    {
      id: "SCN-1046",
      time: "14:22:04",
      status: "diseased",
      diagnosis: "Chlorosis / Margin Yellowing",
      confidence: 91.8,
    },
    {
      id: "SCN-1045",
      time: "14:18:55",
      status: "healthy",
      diagnosis: "Two Leaves & A Bud",
      confidence: 95.7,
    },
    {
      id: "SCN-1044",
      time: "14:15:30",
      status: "diseased",
      diagnosis: "Anthracnose lesions",
      confidence: 94.1,
    },
    {
      id: "SCN-1043",
      time: "14:11:12",
      status: "healthy",
      diagnosis: "Two Leaves & A Bud",
      confidence: 97.3,
    },
    {
      id: "SCN-1042",
      time: "14:07:48",
      status: "healthy",
      diagnosis: "Two Leaves & A Bud",
      confidence: 99.0,
    },
    {
      id: "SCN-1041",
      time: "14:03:22",
      status: "healthy",
      diagnosis: "Two Leaves & A Bud",
      confidence: 93.5,
    },
  ];

  return (
    <Card
      title="Recent scans"
      subtitle="(Last 8 verified canopy samples)"
      headerAction={
        <span className="text-xs font-mono text-[#8FA19C]">
          Field Canopy
        </span>
      }
      noPadding
      className={className}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm select-none">
          <thead>
            <tr className="border-b border-[#26332F] text-[11px] font-medium text-[#8FA19C] uppercase tracking-wider bg-[#0E1514]">
              <th className="py-2.5 px-5">Scan ID</th>
              <th className="py-2.5 px-4">Time</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Diagnosis</th>
              <th className="py-2.5 px-5 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#26332F]">
            {scans.map((scan) => (
              <tr
                key={scan.id}
                className="h-[44px] hover:bg-[#1B2625] transition-colors duration-150"
              >
                <td className="py-2 px-5 font-mono text-xs font-medium text-[#E6EDEB]">
                  {scan.id}
                </td>
                <td className="py-2 px-4 font-mono text-xs text-[#8FA19C] tabular-nums">
                  {scan.time}
                </td>
                <td className="py-2 px-4">
                  <StatusPill
                    label={scan.status === "healthy" ? "Healthy" : "Diseased"}
                    variant={scan.status === "healthy" ? "accent" : "alert"}
                  />
                </td>
                <td className="py-2 px-4 text-xs text-[#E6EDEB]">
                  {scan.diagnosis}
                </td>
                <td className="py-2 px-5 font-mono text-xs font-medium text-[#E6EDEB] text-right tabular-nums">
                  {scan.confidence.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-[#26332F] bg-[#141D1C] flex items-center justify-between text-xs text-[#8FA19C]">
        <span>Showing 8 of 142 session scans</span>
        <button className="text-xs text-[#4ADE80] hover:underline font-medium">
          Export CSV log
        </button>
      </div>
    </Card>
  );
};
