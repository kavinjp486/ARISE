import React, { useState, useEffect } from "react";
import {
  Droplets,
  CloudSun,
  Wind,
  Gauge,
  Thermometer,
  Power,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface ZoneMoisture {
  id: number;
  name: string;
  moisture: number; // percentage
  targetMoisture: number;
  sprinklerActive: boolean;
  soilTemp: number; // Celsius
  lastWatered: string;
}

export const IrrigationView: React.FC = () => {
  const [autoMode, setAutoMode] = useState(true);

  // 12 Tea Estate Canopy Zones
  const [zones, setZones] = useState<ZoneMoisture[]>(() =>
    Array.from({ length: 12 }, (_, i) => {
      const initialMoisture = 24 + ((i * 17) % 55);
      return {
        id: i + 1,
        name: `Canopy Zone ${String(i + 1).padStart(2, "0")}`,
        moisture: initialMoisture,
        targetMoisture: 55,
        sprinklerActive: initialMoisture < 35,
        soilTemp: 19.5 + (i % 4) * 0.4,
        lastWatered: `${(i % 5) * 2 + 1}h ago`,
      };
    })
  );

  // Microclimate telemetry (Flat values)
  const [weather] = useState({
    ambientTemp: 22.4,
    humidity: 74,
    windSpeed: 8.6,
    evapotranspiration: "3.2 mm/day",
  });

  // Dynamic simulation of moisture decay & active sprinkler watering
  useEffect(() => {
    const timer = setInterval(() => {
      setZones((prevZones) =>
        prevZones.map((z) => {
          let m = z.moisture;
          let isSprinkling = z.sprinklerActive;

          if (autoMode) {
            if (m < 35) {
              isSprinkling = true;
            } else if (m >= 58) {
              isSprinkling = false;
            }
          }

          if (isSprinkling) {
            m = Math.min(68, +(m + 1.2).toFixed(1));
          } else {
            m = Math.max(18, +(m - 0.25).toFixed(1));
          }

          return {
            ...z,
            moisture: m,
            sprinklerActive: isSprinkling,
          };
        })
      );
    }, 1500);

    return () => clearInterval(timer);
  }, [autoMode]);

  const toggleSprinkler = (id: number) => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === id
          ? {
              ...z,
              sprinklerActive: !z.sprinklerActive,
            }
          : z
      )
    );
  };

  const handleWaterAllDry = () => {
    setZones((prev) =>
      prev.map((z) => ({
        ...z,
        sprinklerActive: z.moisture < 45 ? true : z.sprinklerActive,
      }))
    );
  };

  const handleHaltAll = () => {
    setZones((prev) =>
      prev.map((z) => ({
        ...z,
        sprinklerActive: false,
      }))
    );
  };

  // Metrics
  const dryCount = zones.filter((z) => z.moisture < 35).length;
  const optimalCount = zones.filter((z) => z.moisture >= 35 && z.moisture <= 60).length;
  const activeCount = zones.filter((z) => z.sprinklerActive).length;
  const totalWaterUsed = zones.reduce(
    (acc, z) => acc + (z.sprinklerActive ? 140 : z.moisture > 45 ? 60 : 25),
    0
  );

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Quick Controls (Simple, flat layout) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#4ADE80] uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
            <span>Precision Irrigation & Micro-Misting Network</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#E6EDEB]">
            Smart Irrigation Control
          </h1>
          <p className="text-xs md:text-sm text-[#8FA19C] mt-0.5">
            AI-driven soil moisture telemetry, automatic deficit micro-misting, and weather drift compensation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className={`font-mono text-xs border-[#26332F] ${
              autoMode ? "text-[#4ADE80]" : "text-[#8FA19C]"
            }`}
            onClick={() => setAutoMode(!autoMode)}
          >
            <Power className="w-3.5 h-3.5 mr-1.5" />
            <span>AUTO LOOP: {autoMode ? "ON" : "OFF"}</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="text-xs border-[#26332F] text-[#E6EDEB] hover:bg-[#1B2625]"
            onClick={handleWaterAllDry}
          >
            <Play className="w-3.5 h-3.5 mr-1.5 text-[#4ADE80]" />
            <span>Water All Dry</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="text-xs border-[#26332F] text-[#F5A524] hover:bg-[#1B2625]"
            onClick={handleHaltAll}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Halt All</span>
          </Button>
        </div>
      </div>

      {/* 2. Key Status Tiles (Flat cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="p-4 bg-[#16201E] border-[#26332F] space-y-1.5">
          <div className="flex items-center justify-between text-[#8FA19C] text-xs font-mono">
            <span>WATER CONSUMED</span>
            <Droplets className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#E6EDEB]">
            {totalWaterUsed} <span className="text-xs font-normal text-[#8FA19C]">L</span>
          </div>
          <div className="text-[11px] text-[#4ADE80] font-mono">
            ↓ 58% vs manual flood irrigation
          </div>
        </Card>

        <Card className="p-4 bg-[#16201E] border-[#26332F] space-y-1.5">
          <div className="flex items-center justify-between text-[#8FA19C] text-xs font-mono">
            <span>DRY / DEFICIT ZONES</span>
            <AlertTriangle className="w-4 h-4 text-[#F5A524]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F5A524]">
            {dryCount}{" "}
            <span className="text-xs font-normal text-[#8FA19C]">/ 12 zones</span>
          </div>
          <div className="text-[11px] text-[#8FA19C]">
            {dryCount > 0 ? "Targeted micro-misting triggered" : "No deficit detected"}
          </div>
        </Card>

        <Card className="p-4 bg-[#16201E] border-[#26332F] space-y-1.5">
          <div className="flex items-center justify-between text-[#8FA19C] text-xs font-mono">
            <span>OPTIMAL HYDRATION</span>
            <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#4ADE80]">
            {optimalCount}{" "}
            <span className="text-xs font-normal text-[#8FA19C]">/ 12 zones</span>
          </div>
          <div className="text-[11px] text-[#8FA19C]">
            Ideal 35% - 60% root zone saturation
          </div>
        </Card>

        <Card className="p-4 bg-[#16201E] border-[#26332F] space-y-1.5">
          <div className="flex items-center justify-between text-[#8FA19C] text-xs font-mono">
            <span>ACTIVE SPRINKLERS</span>
            <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#4ADE80]">
            {activeCount}{" "}
            <span className="text-xs font-normal text-[#8FA19C]">Valves Open</span>
          </div>
          <div className="text-[11px] text-[#8FA19C]">
            Low-pressure overhead misting active
          </div>
        </Card>
      </div>

      {/* 3. Main Area: Microclimate telemetry + Zone Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Left Column: Environmental Station (Flat panel) */}
        <Card className="p-4 bg-[#16201E] border-[#26332F] space-y-4 h-fit">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E6EDEB] border-b border-[#26332F] pb-2.5">
            <CloudSun className="w-4 h-4 text-[#4ADE80]" />
            <span>Field Microclimate Station</span>
          </div>

          <div className="text-center py-1">
            <div className="text-3xl font-bold font-mono text-[#E6EDEB]">
              {weather.ambientTemp}°C
            </div>
            <div className="text-[11px] text-[#8FA19C] mt-0.5 font-mono">
              Ambient Temperature (Canopy)
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between py-1 border-b border-[#26332F] text-xs">
              <span className="flex items-center gap-1.5 text-[#8FA19C]">
                <Droplets className="w-3.5 h-3.5 text-[#4ADE80]" /> Relative Humidity
              </span>
              <span className="font-mono text-[#E6EDEB]">
                {weather.humidity}%
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#26332F] text-xs">
              <span className="flex items-center gap-1.5 text-[#8FA19C]">
                <Wind className="w-3.5 h-3.5 text-[#4ADE80]" /> Wind Speed
              </span>
              <span className="font-mono text-[#E6EDEB]">
                {weather.windSpeed} km/h
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#26332F] text-xs">
              <span className="flex items-center gap-1.5 text-[#8FA19C]">
                <Thermometer className="w-3.5 h-3.5 text-[#4ADE80]" /> Avg Soil Temp
              </span>
              <span className="font-mono text-[#E6EDEB]">19.8°C</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#26332F] text-xs">
              <span className="flex items-center gap-1.5 text-[#8FA19C]">
                <Gauge className="w-3.5 h-3.5 text-[#4ADE80]" /> Evapotranspiration
              </span>
              <span className="font-mono text-[#E6EDEB]">
                {weather.evapotranspiration}
              </span>
            </div>
          </div>

          {/* Agronomic Advisory Card (Flat) */}
          <div className="rounded-[8px] p-3 bg-[#0E1514] border border-[#26332F] space-y-1">
            <div className="text-[10px] font-mono uppercase text-[#4ADE80] font-semibold">
              AGRONOMY LOCK PROTOCOL
            </div>
            <p className="text-xs text-[#8FA19C] leading-relaxed">
              Misting automatically shuts off when the cable robot commences plucking to preserve shoot turgidity.
            </p>
          </div>
        </Card>

        {/* Right Column: 12-Zone Moisture Telemetry Grid */}
        <div className="xl:col-span-3 space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <div className="text-xs font-semibold text-[#E6EDEB] flex items-center gap-2">
              <Droplets className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span>Canopy Zone Moisture Matrix</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-[#8FA19C]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#F5A524]" /> Deficit (&lt;35%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#4ADE80]" /> Optimal (35-60%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#8FA19C]" /> Saturated (&gt;60%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {zones.map((zone) => {
              const isDry = zone.moisture < 35;
              const isSaturated = zone.moisture > 60;
              const statusColor = isDry
                ? "#F5A524"
                : isSaturated
                ? "#8FA19C"
                : "#4ADE80";

              return (
                <div
                  key={zone.id}
                  className={`rounded-[10px] p-3.5 bg-[#16201E] border flex flex-col justify-between space-y-3 ${
                    zone.sprinklerActive
                      ? "border-[#4ADE80]"
                      : "border-[#26332F]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-[#8FA19C] uppercase">
                        {zone.name}
                      </div>
                      <div
                        className="text-xl font-bold font-mono mt-0.5"
                        style={{ color: statusColor }}
                      >
                        {zone.moisture}%
                      </div>
                    </div>
                    {zone.sprinklerActive ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium text-[#4ADE80] border border-[#4ADE80]/40">
                        MIST ACTIVE
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-[#8FA19C]">
                        {zone.lastWatered}
                      </span>
                    )}
                  </div>

                  {/* Flat progress bar */}
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full bg-[#0E1514] overflow-hidden border border-[#26332F]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, zone.moisture)}%`,
                          backgroundColor: statusColor,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-[#8FA19C]">
                      <span>0%</span>
                      <span>Target: {zone.targetMoisture}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Flat Action Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    className={`w-full text-xs font-mono py-1 h-7 border-[#26332F] ${
                      zone.sprinklerActive
                        ? "text-[#F5A524] hover:bg-[#1B2625]"
                        : "text-[#8FA19C] hover:text-[#E6EDEB] hover:bg-[#1B2625]"
                    }`}
                    onClick={() => toggleSprinkler(zone.id)}
                  >
                    {zone.sprinklerActive ? "Stop Misting" : "Trigger Mist"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
