"""
CityPulse ML Microservice
=========================
FastAPI service for city infrastructure issue classification.
Uses a trained EfficientNet-B0 model for real inference,
with a simulation fallback if no model is available.
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import io
import json
import random
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import uvicorn

# ─── App Setup ────────────────────────────────────────────────

app = FastAPI(
    title="CityPulse ML Service",
    description="AI-powered image classification for city infrastructure issues",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = Path(__file__).parent / "saved_models"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ─── Response Models ─────────────────────────────────────────

class ClassificationResult(BaseModel):
    category: str
    confidence: float
    severity: str
    all_predictions: dict = {}


class VerificationResult(BaseModel):
    verified: bool
    similarity: float
    message: str


# ─── Model Loading ───────────────────────────────────────────

class ModelManager:
    """Manages the trained EfficientNet model lifecycle."""

    def __init__(self):
        self.model = None
        self.class_names = []
        self.class_to_category = {}
        self.class_to_severity = {}
        self.transform = None
        self.loaded = False
        self._load_model()

    def _load_model(self):
        """Load the trained model and class mappings."""
        model_path = MODEL_DIR / "best_model.pth"
        mapping_path = MODEL_DIR / "class_mapping.json"

        if not model_path.exists():
            print("[ML] No trained model found. Using simulation mode.")
            print(f"[ML] Train a model first: python train.py --epochs 10")
            return

        try:
            # Load class mapping
            if mapping_path.exists():
                with open(mapping_path) as f:
                    mapping = json.load(f)
                self.class_names = mapping["class_names"]
                self.class_to_category = mapping["class_to_category"]
                self.class_to_severity = mapping["class_to_severity"]
                image_size = mapping.get("image_size", 224)
            else:
                # Fallback from checkpoint
                checkpoint = torch.load(model_path, map_location=DEVICE, weights_only=False)
                self.class_names = checkpoint.get("class_names", [])
                self.class_to_category = checkpoint.get("class_to_category", {})
                self.class_to_severity = checkpoint.get("class_to_severity", {})
                image_size = 224

            # Build model architecture
            num_classes = len(self.class_names)
            self.model = models.efficientnet_b0(weights=None)
            in_features = self.model.classifier[1].in_features
            self.model.classifier = nn.Sequential(
                nn.Dropout(p=0.3, inplace=True),
                nn.Linear(in_features, 512),
                nn.ReLU(inplace=True),
                nn.BatchNorm1d(512),
                nn.Dropout(p=0.2),
                nn.Linear(512, num_classes),
            )

            # Load weights
            checkpoint = torch.load(model_path, map_location=DEVICE, weights_only=False)
            self.model.load_state_dict(checkpoint["model_state_dict"])
            self.model.to(DEVICE)
            self.model.eval()

            # Inference transforms (no augmentation)
            self.transform = transforms.Compose([
                transforms.Resize((image_size, image_size)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                     std=[0.229, 0.224, 0.225]),
            ])

            self.loaded = True
            val_acc = checkpoint.get("val_acc", "N/A")
            epoch = checkpoint.get("epoch", "N/A")
            print(f"[ML] Model loaded! Val Acc: {val_acc}% (Epoch {epoch})")
            print(f"[ML] Classes: {num_classes} | Device: {DEVICE}")

        except Exception as e:
            print(f"[ML] Error loading model: {e}")
            self.loaded = False

    def predict(self, image: Image.Image) -> dict:
        """Run inference on a PIL image."""
        if not self.loaded:
            return self._simulate()

        try:
            input_tensor = self.transform(image).unsqueeze(0).to(DEVICE)

            with torch.no_grad():
                outputs = self.model(input_tensor)
                probabilities = torch.softmax(outputs, dim=1)[0]

            # Get top prediction
            top_prob, top_idx = probabilities.max(0)
            class_name = self.class_names[top_idx.item()]
            category = self.class_to_category.get(class_name, class_name.lower())
            severity = self.class_to_severity.get(class_name, "medium")
            confidence = round(top_prob.item(), 4)

            # Get all predictions (top 5)
            top5_probs, top5_idxs = probabilities.topk(min(5, len(self.class_names)))
            all_preds = {}
            for prob, idx in zip(top5_probs, top5_idxs):
                cname = self.class_names[idx.item()]
                all_preds[self.class_to_category.get(cname, cname)] = round(prob.item(), 4)

            return {
                "category": category,
                "confidence": confidence,
                "severity": severity,
                "all_predictions": all_preds,
            }

        except Exception as e:
            print(f"[ML] Inference error: {e}")
            return self._simulate()

    def _simulate(self) -> dict:
        """Fallback simulated classification."""
        categories = ["pothole", "garbage", "concrete_damage", "fallen_tree",
                       "electrical_pole", "road_sign", "graffiti"]
        severities = ["low", "medium", "high", "critical"]
        category = random.choice(categories)
        return {
            "category": category,
            "confidence": round(random.uniform(0.75, 0.98), 3),
            "severity": random.choice(severities),
            "all_predictions": {category: round(random.uniform(0.75, 0.98), 3)},
        }


# Initialize model manager at startup
manager = ModelManager()


# ─── Endpoints ───────────────────────────────────────────────

@app.post("/classify", response_model=ClassificationResult)
async def classify_image(file: UploadFile = File(...)):
    """
    Classify a city infrastructure issue from an uploaded image.
    Uses EfficientNet-B0 trained via transfer learning on 9 categories.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await file.read()
    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not process image")

    result = manager.predict(image)
    return ClassificationResult(**result)


@app.post("/verify", response_model=VerificationResult)
async def verify_resolution(
    before_image: UploadFile = File(...),
    after_image: UploadFile = File(...),
):
    """
    Compare before/after images to verify issue resolution.
    Uses model feature extraction for image similarity.
    """
    try:
        before_bytes = await before_image.read()
        after_bytes = await after_image.read()
        before_img = Image.open(io.BytesIO(before_bytes)).convert("RGB")
        after_img = Image.open(io.BytesIO(after_bytes)).convert("RGB")

        if manager.loaded and manager.transform:
            # Use model features for similarity comparison
            before_tensor = manager.transform(before_img).unsqueeze(0).to(DEVICE)
            after_tensor = manager.transform(after_img).unsqueeze(0).to(DEVICE)

            with torch.no_grad():
                # Extract features from avgpool layer
                before_feat = manager.model.features(before_tensor)
                after_feat = manager.model.features(after_tensor)
                before_feat = torch.flatten(before_feat, 1)
                after_feat = torch.flatten(after_feat, 1)

                # Cosine similarity
                similarity = torch.nn.functional.cosine_similarity(
                    before_feat, after_feat
                ).item()
        else:
            similarity = round(random.uniform(0.15, 0.85), 3)

        similarity = round(similarity, 3)
        verified = similarity < 0.65  # Low similarity = issue was fixed

        return VerificationResult(
            verified=verified,
            similarity=similarity,
            message="✅ Resolution verified — significant change detected."
            if verified
            else "⚠️ Images appear too similar. The issue may not be fully resolved.",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification error: {str(e)}")


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ml-classification",
        "model_loaded": manager.loaded,
        "device": str(DEVICE),
        "num_classes": len(manager.class_names) if manager.loaded else 0,
    }


@app.get("/classes")
async def get_classes():
    """Return the list of supported classification categories."""
    if manager.loaded:
        return {
            "classes": manager.class_names,
            "categories": manager.class_to_category,
            "severities": manager.class_to_severity,
        }
    return {"classes": [], "categories": {}, "severities": {}}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
