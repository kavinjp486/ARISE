"""
Prediction & Live Camera Stream Route Endpoints

Provides REST API endpoints for live camera video streaming (/video_feed),
on-demand plant inspection triggers (/inspect), and vision detection inference (/predict).
"""

from fastapi import APIRouter, File, UploadFile, Body
from fastapi.responses import StreamingResponse
from typing import Optional, Dict, Any
from backend.models.schemas import VisionDetectionResponse, PredictRequest
from backend.services.prediction_service import PredictionService

router = APIRouter()


@router.get(
    "/video_feed",
    summary="Live Robot Camera Video Stream (MJPEG)",
)
async def video_feed():
    """
    Streams live 1080p camera video feed from the onboard cable robot camera.
    """
    return StreamingResponse(
        PredictionService.generate_mjpeg_stream(),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


@router.post(
    "/inspect",
    response_model=VisionDetectionResponse,
    summary="Trigger Manual Plant Inspection on Current Camera Frame",
)
async def inspect_plant():
    """
    Called when the robot is manually stopped over a plant.
    Captures current camera frame, freezes view, and runs 7-disease vision detection.
    """
    return PredictionService.process_sample_frame()


@router.get(
    "/predict",
    response_model=VisionDetectionResponse,
    summary="Get vision inference prediction on current camera frame",
)
async def get_prediction():
    """
    Executes tea leaf disease detection on current live camera frame.
    """
    return PredictionService.process_sample_frame()


@router.post(
    "/predict",
    response_model=VisionDetectionResponse,
    summary="Perform vision inference on uploaded image file or base64 frame",
)
async def post_prediction(
    file: Optional[UploadFile] = File(None),
    request: Optional[PredictRequest] = Body(None),
):
    """
    Accepts either:
    1. Uploaded image file (multipart/form-data)
    2. Base64 frame input payload (JSON)
    """
    if file is not None:
        image_bytes = await file.read()
        return PredictionService.process_image_bytes(image_bytes)

    if request is not None and request.image_base64:
        return PredictionService.process_base64_frame(request.image_base64)

    return PredictionService.process_sample_frame()
