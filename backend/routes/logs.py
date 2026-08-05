from fastapi import APIRouter
from backend.models.schemas import LogsResponse
from backend.services.dummy_service import DummyService

router = APIRouter()

@router.get("/logs", response_model=LogsResponse, summary="Retrieve recent telemetry event records")
async def get_logs():
    """
    Returns live activity telemetry log records.
    """
    return DummyService.get_logs()
