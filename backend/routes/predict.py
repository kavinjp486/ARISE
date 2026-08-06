"""
Prediction Route Endpoints

Provides REST API endpoints for vision detection & ML inference.
Supports uploaded image files (multipart/form-data), base64 encoded frame streams, or camera sample frames.
"""

from fastapi import APIRouter, File, UploadFile, Body
from typing import Optional, Dict, Any
from backend.models.schemas import VisionDetectionResponse, PredictRequest
from backend.services.prediction_service import PredictionService

router = APIRouter()


@router.get(
    "/predict",
    response_model=VisionDetectionResponse,
    summary="Get vision inference prediction on current camera frame",
)
async def get_prediction():
    """
    Executes tea leaf disease detection on current camera frame or synthetic pipeline sample.
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
    
    Returns structured vision diagnosis, chlorosis yellow percentage, confidence, and bounding box coordinates.
    """
    # Option 1: File Upload
    if file is not None:
        image_bytes = await file.read()
        return PredictionService.process_image_bytes(image_bytes)

    # Option 2: JSON Payload with base64 image frame
    if request is not None and request.image_base64:
        return PredictionService.process_base64_frame(request.image_base64)

    # Option 3: Fallback sample execution if no input frame provided
    return PredictionService.process_sample_frame()
