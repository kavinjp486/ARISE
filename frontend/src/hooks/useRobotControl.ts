import { useState } from "react";
import { ApiService } from "@/services/api";
import type { ActivityLogEntry } from "@/types";

export function useRobotControl(
  onLogAdd?: (log: ActivityLogEntry) => void
) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const executeCommand = async (
    command: string,
    params: Record<string, unknown> = {}
  ) => {
    setIsExecuting(true);
    setLastFeedback(`Sending ${command}...`);

    try {
      const res = await ApiService.sendCommand(command, params);
      setLastFeedback(res.message);

      // Create new activity log entry for dashboard feedback
      if (onLogAdd) {
        const timeStr = new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        onLogAdd({
          id: String(Date.now()),
          timestamp: timeStr,
          message: `Command triggered: ${command.toUpperCase()} ${
            res.message ? `(${res.message})` : ""
          }`,
          level: command === "stop" ? "warning" : "info",
        });
      }
    } catch (err) {
      setLastFeedback(`Failed to execute ${command}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return { executeCommand, isExecuting, lastFeedback };
}
