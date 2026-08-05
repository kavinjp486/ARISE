from fastapi import APIRouter
from backend.models.schemas import LogsResponse
from backend.services.dummy_service import DummyService

router = APIRouter()

@router.get("/logs", response_model=LogsResponse, summary="Retrieve recent backend log records")
async def get_logs():
    """
    Returns simulated historical log entries.
    """
    return DummyService.get_dummy_logs()
