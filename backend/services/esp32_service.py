import asyncio
import json
import logging
from datetime import datetime, timezone
import urllib.request
import urllib.error
from typing import Dict, Any, Optional

from backend.models.schemas import RobotStatusData, PositionSchema, ControlResponse

logger = logging.getLogger("ARISE.ESP32Service")

# ESP32 Default Wi-Fi Network Address
ESP32_DEFAULT_IP = "192.168.1.100"  # Configurable IP or AP gateway

class ESP32Service:
    _esp32_ip: str = ESP32_DEFAULT_IP
    _hardware_connected: bool = False
    
    # In-memory latest telemetry state
    _current_status: RobotStatusData = RobotStatusData(
        connection="connected",
        battery=78.0,
        position=PositionSchema(x=142.5, y=87.3),
        speed=0.8,
        mode="autonomous",
        temperature=34.0,
        payload=12.4,
        lastUpdate=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

    @classmethod
    def get_latest_status(cls) -> RobotStatusData:
        """Returns the latest telemetry state (real or mock fallback)."""
        cls._current_status.lastUpdate = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return cls._current_status

    @classmethod
    def update_telemetry(cls, data: RobotStatusData):
        """Allows ESP32 to push telemetry updates directly into backend cache."""
        cls._current_status = data
        cls._hardware_connected = True

    @classmethod
    async def dispatch_command(cls, command: str, params: Dict[str, Any]) -> ControlResponse:
        """
        Dispatches a control command to physical ESP32 via HTTP POST over Wi-Fi.
        Falls back to Mock Mode if ESP32 is offline.
        """
        cmd_upper = command.upper()
        
        # Update local in-memory state for mock feedback
        if command == "set_mode" and "mode" in params:
            cls._current_status.mode = str(params["mode"])
        elif command == "move" and "speed" in params:
            cls._current_status.speed = float(params["speed"])
        elif command == "stop" or command == "emergency_stop":
            cls._current_status.speed = 0.0

        # Construct JSON payload for ESP32
        payload_data = {
            "cmd": cmd_upper,
            "params": params,
            "timestamp": int(datetime.now(timezone.utc).timestamp())
        }
        json_bytes = json.dumps(payload_data).encode("utf-8")

        esp32_url = f"http://{cls._esp32_ip}/api/robot/control"

        try:
          req = urllib.request.Request(
              esp32_url,
              data=json_bytes,
              headers={"Content-Type": "application/json"},
              method="POST"
          )
          # Asynchronous executor for urllib request with 1.5s timeout
          loop = asyncio.get_event_loop()
          response = await loop.run_in_executor(
              None, lambda: urllib.request.urlopen(req, timeout=1.5)
          )

          if response.status == 200:
              cls._hardware_connected = True
              cls._current_status.connection = "connected"
              return ControlResponse(
                  success=True,
                  message=f"Command '{command}' executed on ESP32 over Wi-Fi",
                  hardware_ack=True
              )
        except Exception as err:
            logger.info(f"ESP32 hardware offline or unreachable ({err}). Operating in Mock Mode.")

        # Fallback to Mock Mode execution when ESP32 Wi-Fi is disconnected
        cls._hardware_connected = False
        return ControlResponse(
            success=True,
            message=f"Command '{command}' processed successfully (Mock Hardware Mode)",
            hardware_ack=False
        )
