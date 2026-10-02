"""HTTP inference API for the REHAB24-6 baseline exercise classifier."""

from pathlib import Path

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from train import EXERCISES, load_pose, pose_features

MODEL_PATH = Path(__file__).resolve().parent / "models" / "exercise_classifier.joblib"
app = FastAPI(title="RehabAI Research Exercise Model", version="0.1.0")
_artifact = None


def load_artifact():
    global _artifact
    if _artifact is None:
        if not MODEL_PATH.exists():
            raise HTTPException(status_code=503, detail="Train the model before requesting predictions.")
        _artifact = joblib.load(MODEL_PATH)
    return _artifact


class PredictionRequest(BaseModel):
    # One already-segmented repetition of the dataset's 26-joint 2D skeleton.
    jointSequence: list[list[list[float]]] = Field(min_length=2, max_length=1200)


@app.get("/health")
def health():
    return {"ready": MODEL_PATH.exists(), "model": "REHAB24-6 six-class research baseline"}


@app.post("/predict")
def predict(request: PredictionRequest):
    try:
        pose = load_pose(np.asarray(request.jointSequence, dtype=np.float32))
        features = pose_features(pose).reshape(1, -1)
        artifact = load_artifact()
        model = artifact["model"]
        probabilities = model.predict_proba(features)[0]
        index = int(np.argmax(probabilities))
        class_name = str(model.classes_[index])
        class_id = next((str(key) for key, name in EXERCISES.items() if name == class_name), None)
        return {
            "classLabel": f"Ex{class_id}" if class_id else class_name,
            "className": class_name,
            "confidence": float(probabilities[index]),
            "modelVersion": "rehab24-6-svc-v1",
            "dataset": "REHAB24-6",
        }
    except (ValueError, TypeError) as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
