import React from "react";
import { StatTile } from "../ui/StatTile";

export interface StatusStripProps {
  gpsStatus?: "fixed" | "float" | "lost";
  gpsAccuracy?: string;
  cableTension?: number;
  batteryPercent?: number;
  latencyMs?: number;
}

export const StatusStrip: React.FC<StatusStripProps> = ({
  gpsStatus = "fixed",
  gpsAccuracy = "±1.2 cm",
  cableTension = 142,
  batteryPercent = 88,
  latencyMs = 12,
}) => {
  // Colour & status dot rules
  const gpsDot = gpsStatus === "fixed" ? "accent" : "alert";
  const gpsText = gpsStatus === "fixed" ? `Fixed · ${gpsAccuracy}` : `Float · ${gpsAccuracy}`;

  const tensionDot = cableTension >= 80 && cableTension <= 220 ? "accent" : "alert";
  const tensionText = `${cableTension} N`;

  const batteryDot = batteryPercent > 20 ? "accent" : "alert";
  const batteryText = `${batteryPercent}%`;

  const latencyDot = latencyMs < 50 ? "accent" : "alert";
  const latencyText = `${latencyMs} ms`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatTile
        label="RTK / GPS"
        value={gpsText}
        statusDot={gpsDot}
      />
      <StatTile
        label="Cable tension"
        value={tensionText}
        subValue="Nominal"
        statusDot={tensionDot}
      />
      <StatTile
        label="Battery"
        value={batteryText}
        statusDot={batteryDot}
        progressPercent={batteryPercent}
      />
      <StatTile
        label="Link latency"
        value={latencyText}
        subValue="ESP-NOW / Wi-Fi"
        statusDot={latencyDot}
      />
    </div>
  );
};
