import { useEffect, useState } from "react";
import type { ActivityLogEntry, PredictionData, RobotStatusData } from "@/types";
import { ApiService } from "@/services/api";

export function useTelemetry(pollIntervalMs = 2000) {
  const [status, setStatus] = useState<RobotStatusData | null>(null);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadTelemetry() {
      try {
        const [statusData, predictionData, logsData] = await Promise.all([
          ApiService.getStatus(),
          ApiService.getPredictions(),
          ApiService.getLogs(),
        ]);

        if (isMounted) {
          setStatus(statusData);
          setPrediction(predictionData);
          setLogs(logsData);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    // Initial load
    loadTelemetry();

    // Periodic polling for live updates
    const interval = setInterval(loadTelemetry, pollIntervalMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pollIntervalMs]);

  return { status, prediction, logs, isLoading, setLogs };
}
