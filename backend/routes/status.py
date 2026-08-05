from fastapi import APIRouter
from backend.models.schemas import StatusResponse
from backend.services.dummy_service import DummyService

router = APIRouter()

@router.get("/status", response_model=StatusResponse, summary="Retrieve current system status")
async def get_status():
    """
    Returns dummy metrics and connection status of the backend device/system.
    """
    return DummyService.get_dummy_status()
