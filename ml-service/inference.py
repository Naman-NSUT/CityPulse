"""
CityPulse ML — Standalone Inference Script
===========================================
Classify city infrastructure issues from images using the trained
EfficientNet-B0 model.

Usage:
    python inference.py --image path/to/image.jpg
    python inference.py --image path/to/image.jpg --top_k 5
    python inference.py --dir path/to/image_folder/
"""

import argparse
import json
import sys
from pathlib import Path

import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image

# ─── Paths ───────────────────────────────────────────────────

MODEL_DIR = Path(__file__).parent / "saved_models"
MODEL_PATH = MODEL_DIR / "best_model.pth"
MAPPING_PATH = MODEL_DIR / "class_mapping.json"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# ─── Model Setup ─────────────────────────────────────────────

def load_model():
    """Load the trained EfficientNet-B0 model and class mappings."""
    if not MODEL_PATH.exists():
        print(f"[ERROR] No trained model found at {MODEL_PATH}")
        print(f"        Run training first: bash run_training.sh")
        sys.exit(1)

    # Load class mapping
    if MAPPING_PATH.exists():
        with open(MAPPING_PATH) as f:
            mapping = json.load(f)
        class_names = mapping["class_names"]
        class_to_category = mapping["class_to_category"]
        class_to_severity = mapping["class_to_severity"]
        image_size = mapping.get("image_size", 224)
    else:
        checkpoint = torch.load(MODEL_PATH, map_location=DEVICE, weights_only=False)
        class_names = checkpoint.get("class_names", [])
        class_to_category = checkpoint.get("class_to_category", {})
        class_to_severity = checkpoint.get("class_to_severity", {})
        image_size = 224

    num_classes = len(class_names)

    # Build model architecture (must match train.py)
    model = models.efficientnet_b0(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3, inplace=True),
        nn.Linear(in_features, 512),
        nn.ReLU(inplace=True),
        nn.BatchNorm1d(512),
        nn.Dropout(p=0.2),
        nn.Linear(512, num_classes),
    )

    # Load trained weights
    checkpoint = torch.load(MODEL_PATH, map_location=DEVICE, weights_only=False)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(DEVICE)
    model.eval()

    val_acc = checkpoint.get("val_acc", "N/A")
    epoch = checkpoint.get("epoch", "N/A")
    print(f"[Model] Loaded — Val Acc: {val_acc}% | Epoch: {epoch} | Device: {DEVICE}")

    # Inference transforms
    transform = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225]),
    ])

    return model, transform, class_names, class_to_category, class_to_severity


# ─── Inference ───────────────────────────────────────────────

def classify_image(image_path, model, transform, class_names,
                   class_to_category, class_to_severity, top_k=5):
    """Classify a single image and return predictions."""
    try:
        image = Image.open(image_path).convert("RGB")
    except Exception as e:
        return {"error": f"Could not open image: {e}"}

    input_tensor = transform(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]

    # Top prediction
    top_prob, top_idx = probabilities.max(0)
    class_name = class_names[top_idx.item()]
    category = class_to_category.get(class_name, class_name)
    severity = class_to_severity.get(class_name, "medium")
    confidence = round(top_prob.item(), 4)

    # Top-K predictions
    k = min(top_k, len(class_names))
    topk_probs, topk_idxs = probabilities.topk(k)
    top_predictions = []
    for prob, idx in zip(topk_probs, topk_idxs):
        cname = class_names[idx.item()]
        top_predictions.append({
            "class": cname,
            "category": class_to_category.get(cname, cname),
            "severity": class_to_severity.get(cname, "medium"),
            "confidence": round(prob.item(), 4),
        })

    return {
        "image": str(image_path),
        "prediction": {
            "category": category,
            "class_name": class_name,
            "confidence": confidence,
            "severity": severity,
        },
        "top_k": top_predictions,
    }


def print_result(result):
    """Pretty-print a classification result."""
    if "error" in result:
        print(f"  ✗ {result['error']}")
        return

    pred = result["prediction"]
    print(f"  Image:      {result['image']}")
    print(f"  Category:   {pred['category']}")
    print(f"  Class:      {pred['class_name']}")
    print(f"  Severity:   {pred['severity']}")
    print(f"  Confidence: {pred['confidence']*100:.1f}%")
    print(f"  ─────────────────────────────────")
    print(f"  Top Predictions:")
    for i, p in enumerate(result["top_k"], 1):
        bar = "█" * int(p["confidence"] * 30)
        print(f"    {i}. {p['category']:20s} {p['confidence']*100:5.1f}% {bar}")
    print()


# ─── Main ────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="CityPulse ML Inference")
    parser.add_argument("--image", type=str, help="Path to a single image")
    parser.add_argument("--dir", type=str, help="Path to a directory of images")
    parser.add_argument("--top_k", type=int, default=5, help="Number of top predictions")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    args = parser.parse_args()

    if not args.image and not args.dir:
        parser.print_help()
        sys.exit(1)

    # Load model
    model, transform, class_names, class_to_category, class_to_severity = load_model()

    results = []

    if args.image:
        # Single image
        print(f"\n{'='*50}")
        print(f"  Classifying: {args.image}")
        print(f"{'='*50}\n")
        result = classify_image(
            args.image, model, transform,
            class_names, class_to_category, class_to_severity, args.top_k
        )
        results.append(result)
        if not args.json:
            print_result(result)

    if args.dir:
        # Directory of images
        img_dir = Path(args.dir)
        image_files = sorted([
            f for f in img_dir.rglob("*")
            if f.suffix.lower() in (".jpg", ".jpeg", ".png", ".bmp", ".webp")
        ])
        print(f"\n{'='*50}")
        print(f"  Classifying {len(image_files)} images from: {args.dir}")
        print(f"{'='*50}\n")

        for img_path in image_files:
            result = classify_image(
                img_path, model, transform,
                class_names, class_to_category, class_to_severity, args.top_k
            )
            results.append(result)
            if not args.json:
                print_result(result)

    # JSON output mode
    if args.json:
        print(json.dumps(results, indent=2))

    # Summary
    if not args.json and len(results) > 1:
        print(f"{'='*50}")
        print(f"  Summary: {len(results)} images classified")
        from collections import Counter
        cats = Counter(r["prediction"]["category"] for r in results if "prediction" in r)
        for cat, count in cats.most_common():
            print(f"    {cat}: {count}")
        print(f"{'='*50}")


if __name__ == "__main__":
    main()
