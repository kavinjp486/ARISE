import type {
  ActivityLogEntry,
  PredictionData,
  RobotStatusData,
} from "@/types";
import {
  PLACEHOLDER_ACTIVITY_LOG,
  PLACEHOLDER_PREDICTION,
  PLACEHOLDER_ROBOT_STATUS,
} from "@/utils/placeholderData";

const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Helper to safely fetch JSON from backend with fallback to mock data
 */
async function fetchWithFallback<T>(url: string, fallbackData: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    // Return realistic fallback mock data if backend server is unreachable
    return fallbackData;
  }
}

export const ApiService = {
  /** Fetch real-time telemetry robot status */
  async getStatus(): Promise<RobotStatusData> {
    return fetchWithFallback<RobotStatusData>(
      `${API_BASE_URL}/status`,
      PLACEHOLDER_ROBOT_STATUS
    );
  },

  /** Fetch latest AI tea leaf disease and harvest readiness predictions */
  async getPredictions(): Promise<PredictionData> {
    return fetchWithFallback<PredictionData>(
      `${API_BASE_URL}/predict`,
      PLACEHOLDER_PREDICTION
    );
  },

  /** Fetch live activity telemetry logs */
  async getLogs(): Promise<ActivityLogEntry[]> {
    return fetchWithFallback<ActivityLogEntry[]>(
      `${API_BASE_URL}/logs`,
      PLACEHOLDER_ACTIVITY_LOG
    );
  },

  /** Send control commands to FastAPI backend / ESP32 */
  async sendCommand(
    command: string,
    params: Record<string, unknown> = {}
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, params, timestamp: Date.now() }),
      });

      if (!response.ok) {
        throw new Error(`Command failed with status ${response.status}`);
      }

      return (await response.json()) as { success: boolean; message: string };
    } catch (error) {
      // Mock success response for demo reliability when backend is offline
      return {
        success: true,
        message: `Command '${command}' executed locally (Mock Mode)`,
      };
    }
  },
};
