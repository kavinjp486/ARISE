from datetime import datetime
import random
from backend.models.schemas import PredictionData, ActivityLogEntry, LogsResponse

class DummyService:
    @staticmethod
    def get_prediction() -> PredictionData:
        """Returns realistic AI vision predictions for tea leaf disease & harvest readiness."""
        statuses = ["ready_harvest", "healthy", "disease"]
        chosen_status = random.choice(["ready_harvest", "ready_harvest", "healthy"]) # Bias towards ready harvest for demo
        
        if chosen_status == "ready_harvest":
            return PredictionData(
                primaryLabel="Ready for Harvest",
                confidence=0.94,
                status="ready_harvest",
                recommendation="Proceed with selective plucking on rows 14–16.",
                detectedIssues=["Moisture level optimal", "Apical flush density peak (94%)"],
                lastScan=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            )
        elif chosen_status == "disease":
            return PredictionData(
                primaryLabel="Blister Blight Detected",
                confidence=0.88,
                status="disease",
                recommendation="Apply targeted bio-fungicide treatment on sector C.",
                detectedIssues=["Fungal lesion on upper canopy (4%)", "High local humidity alert"],
                lastScan=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            )
        else:
            return PredictionData(
                primaryLabel="Healthy Vegetative Growth",
                confidence=0.97,
                status="healthy",
                recommendation="Continue automated cable monitoring route.",
                detectedIssues=["No leaf pathology detected"],
                lastScan=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            )

    @staticmethod
    def get_logs() -> LogsResponse:
        """Returns historical and live activity telemetry event logs."""
        now_str = datetime.now().strftime("%H:%M:%S")
        logs = [
            ActivityLogEntry(
                id="1",
                timestamp=now_str,
                message="Autonomous harvest cycle active on Sector B cable line.",
                level="success"
            ),
            ActivityLogEntry(
                id="2",
                timestamp="21:44:31",
                message="AI vision scan completed — high harvest-readiness detected.",
                level="info"
            ),
            ActivityLogEntry(
                id="3",
                timestamp="21:43:10",
                message="ESP32 cable tension & motor temperatures within safe bounds.",
                level="info"
            ),
            ActivityLogEntry(
                id="4",
                timestamp="21:41:55",
                message="Battery level at 78% — solar trickle charger active.",
                level="success"
            ),
            ActivityLogEntry(
                id="5",
                timestamp="21:40:22",
                message="Minor cable vibration spike auto-corrected by ESP32 PID controller.",
                level="warning"
            )
        ]
        return LogsResponse(logs=logs)
