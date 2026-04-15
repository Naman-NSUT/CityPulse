"""
CityPulse ML Training Pipeline
================================
Transfer learning with EfficientNet-B0 for city infrastructure 
issue classification (9 classes).

Usage:
    python train.py --epochs 10 --batch_size 32 --lr 0.001
"""

import os
import argparse
import json
import time
from pathlib import Path

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, WeightedRandomSampler, Dataset
from torchvision import transforms, models
from PIL import Image
import numpy as np
from collections import Counter

# ─── Configuration ───────────────────────────────────────────────

DATA_ROOT = Path(__file__).parent.parent / "Data"
MODEL_DIR = Path(__file__).parent / "saved_models"
MODEL_DIR.mkdir(exist_ok=True)

CLASS_NAMES = [
    "Damaged concrete structures",
    "DamagedElectricalPoles",
    "DamagedRoadSigns",
    "DeadAnimalsPollution",
    "FallenTrees",
    "Garbage",
    "Graffitti",
    "IllegalParking",
    "Potholes and RoadCracks",
]

# Mapping class names to API-friendly category labels
CLASS_TO_CATEGORY = {
    "Damaged concrete structures": "concrete_damage",
    "DamagedElectricalPoles": "electrical_pole",
    "DamagedRoadSigns": "road_sign",
    "DeadAnimalsPollution": "dead_animal",
    "FallenTrees": "fallen_tree",
    "Garbage": "garbage",
    "Graffitti": "graffiti",
    "IllegalParking": "illegal_parking",
    "Potholes and RoadCracks": "pothole",
}

# Severity mapping (domain knowledge based)
CLASS_TO_SEVERITY = {
    "Damaged concrete structures": "high",
    "DamagedElectricalPoles": "critical",
    "DamagedRoadSigns": "high",
    "DeadAnimalsPollution": "medium",
    "FallenTrees": "critical",
    "Garbage": "medium",
    "Graffitti": "low",
    "IllegalParking": "low",
    "Potholes and RoadCracks": "high",
}

IMAGE_SIZE = 224
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# ─── Dataset ─────────────────────────────────────────────────────

class CityPulseDataset(Dataset):
    """
    Custom dataset that reads images from the nested folder structure:
        Data/<Category>/<Category>/train|valid|test/images/*.jpg
    
    Each category folder becomes a class label.
    """

    def __init__(self, split="train", transform=None):
        """
        Args:
            split: One of 'train', 'valid', 'test'
            transform: torchvision transforms to apply
        """
        self.transform = transform
        self.samples = []  # List of (image_path, class_index)
        self.class_names = CLASS_NAMES
        self.targets = []  # For WeightedRandomSampler

        for idx, class_name in enumerate(CLASS_NAMES):
            img_dir = DATA_ROOT / class_name / class_name / split / "images"
            if not img_dir.exists():
                print(f"[WARN] Missing: {img_dir}")
                continue

            for img_file in img_dir.iterdir():
                if img_file.suffix.lower() in (".jpg", ".jpeg", ".png", ".bmp", ".webp"):
                    self.samples.append((str(img_file), idx))
                    self.targets.append(idx)

        print(f"[Dataset] {split}: {len(self.samples)} images across {len(CLASS_NAMES)} classes")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, label = self.samples[idx]
        try:
            image = Image.open(img_path).convert("RGB")
        except Exception:
            # Return a blank image on read error
            image = Image.new("RGB", (IMAGE_SIZE, IMAGE_SIZE), (0, 0, 0))

        if self.transform:
            image = self.transform(image)

        return image, label


# ─── Transforms ──────────────────────────────────────────────────

def get_transforms(split="train"):
    """Get data augmentation transforms for each split."""
    if split == "train":
        return transforms.Compose([
            transforms.Resize((IMAGE_SIZE + 32, IMAGE_SIZE + 32)),
            transforms.RandomCrop(IMAGE_SIZE),
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomRotation(15),
            transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),
            transforms.RandomAffine(degrees=0, translate=(0.1, 0.1)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225]),
        ])
    else:
        return transforms.Compose([
            transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225]),
        ])


# ─── Model ───────────────────────────────────────────────────────

def build_model(num_classes=9, pretrained=True):
    """
    Build EfficientNet-B0 with transfer learning.
    
    Strategy:
      - Load ImageNet pretrained EfficientNet-B0
      - Freeze early convolutional layers
      - Replace classifier head with custom head for 9 classes
      - Unfreeze last few blocks for fine-tuning
    """
    model = models.efficientnet_b0(
        weights=models.EfficientNet_B0_Weights.IMAGENET1K_V1 if pretrained else None
    )

    # Freeze all feature layers initially
    for param in model.features.parameters():
        param.requires_grad = False

    # Unfreeze the last 2 blocks (blocks 6 & 7) for fine-tuning
    for param in model.features[6].parameters():
        param.requires_grad = True
    for param in model.features[7].parameters():
        param.requires_grad = True
    for param in model.features[8].parameters():
        param.requires_grad = True

    # Replace classifier head
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3, inplace=True),
        nn.Linear(in_features, 512),
        nn.ReLU(inplace=True),
        nn.BatchNorm1d(512),
        nn.Dropout(p=0.2),
        nn.Linear(512, num_classes),
    )

    return model


# ─── Training Loop ───────────────────────────────────────────────

def train_one_epoch(model, loader, criterion, optimizer, device):
    """Train for one epoch, return average loss & accuracy."""
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for batch_idx, (images, labels) in enumerate(loader):
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()

        if (batch_idx + 1) % 50 == 0:
            print(f"    Batch {batch_idx+1}/{len(loader)} | "
                  f"Loss: {loss.item():.4f} | "
                  f"Acc: {100.*correct/total:.1f}%")

    epoch_loss = running_loss / total
    epoch_acc = 100.0 * correct / total
    return epoch_loss, epoch_acc


def validate(model, loader, criterion, device):
    """Validate model, return average loss & accuracy."""
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0

    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)

            running_loss += loss.item() * images.size(0)
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()

    epoch_loss = running_loss / total
    epoch_acc = 100.0 * correct / total
    return epoch_loss, epoch_acc


# ─── Main Training ───────────────────────────────────────────────

def main(args):
    print("=" * 60)
    print("  CityPulse ML Training Pipeline")
    print("  Transfer Learning with EfficientNet-B0")
    print("=" * 60)
    print(f"  Device: {DEVICE}")
    print(f"  Epochs: {args.epochs}")
    print(f"  Batch size: {args.batch_size}")
    print(f"  Learning rate: {args.lr}")
    print(f"  Data root: {DATA_ROOT}")
    print("=" * 60)

    # Create datasets
    train_dataset = CityPulseDataset(split="train", transform=get_transforms("train"))
    valid_dataset = CityPulseDataset(split="valid", transform=get_transforms("valid"))
    test_dataset = CityPulseDataset(split="test", transform=get_transforms("test"))

    # Weighted sampler for class imbalance
    class_counts = Counter(train_dataset.targets)
    total_samples = len(train_dataset.targets)
    class_weights = {c: total_samples / count for c, count in class_counts.items()}
    sample_weights = [class_weights[t] for t in train_dataset.targets]
    sampler = WeightedRandomSampler(sample_weights, num_samples=len(sample_weights), replacement=True)

    print(f"\n[Class Distribution]")
    for idx, name in enumerate(CLASS_NAMES):
        count = class_counts.get(idx, 0)
        weight = class_weights.get(idx, 0)
        print(f"  {idx}: {name:35s} | {count:6d} samples | weight={weight:.2f}")

    # Data loaders
    train_loader = DataLoader(
        train_dataset, batch_size=args.batch_size, sampler=sampler,
        num_workers=args.workers, pin_memory=True, drop_last=True,
    )
    valid_loader = DataLoader(
        valid_dataset, batch_size=args.batch_size, shuffle=False,
        num_workers=args.workers, pin_memory=True,
    )
    test_loader = DataLoader(
        test_dataset, batch_size=args.batch_size, shuffle=False,
        num_workers=args.workers, pin_memory=True,
    )

    # Build model
    model = build_model(num_classes=len(CLASS_NAMES), pretrained=True)
    model = model.to(DEVICE)

    # Loss with class weights for additional balancing
    weight_tensor = torch.tensor(
        [class_weights.get(i, 1.0) for i in range(len(CLASS_NAMES))],
        dtype=torch.float32,
    ).to(DEVICE)
    weight_tensor = weight_tensor / weight_tensor.sum() * len(CLASS_NAMES)
    criterion = nn.CrossEntropyLoss(weight=weight_tensor)

    # Optimizer with differential learning rates
    optimizer = optim.AdamW([
        {"params": model.features[6].parameters(), "lr": args.lr * 0.1},
        {"params": model.features[7].parameters(), "lr": args.lr * 0.1},
        {"params": model.features[8].parameters(), "lr": args.lr * 0.1},
        {"params": model.classifier.parameters(), "lr": args.lr},
    ], weight_decay=1e-4)

    # Learning rate scheduler
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs, eta_min=1e-6)

    # Training loop
    best_val_acc = 0.0
    history = {"train_loss": [], "train_acc": [], "val_loss": [], "val_acc": []}

    for epoch in range(1, args.epochs + 1):
        start = time.time()
        print(f"\n{'─'*50}")
        print(f"Epoch {epoch}/{args.epochs}")
        print(f"{'─'*50}")

        train_loss, train_acc = train_one_epoch(model, train_loader, criterion, optimizer, DEVICE)
        val_loss, val_acc = validate(model, valid_loader, criterion, DEVICE)
        scheduler.step()

        elapsed = time.time() - start
        lr = optimizer.param_groups[-1]["lr"]

        print(f"  Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}%")
        print(f"  Val   Loss: {val_loss:.4f} | Val   Acc: {val_acc:.2f}%")
        print(f"  LR: {lr:.6f} | Time: {elapsed:.1f}s")

        history["train_loss"].append(train_loss)
        history["train_acc"].append(train_acc)
        history["val_loss"].append(val_loss)
        history["val_acc"].append(val_acc)

        # Save best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            save_path = MODEL_DIR / "best_model.pth"
            torch.save({
                "epoch": epoch,
                "model_state_dict": model.state_dict(),
                "optimizer_state_dict": optimizer.state_dict(),
                "val_acc": val_acc,
                "val_loss": val_loss,
                "class_names": CLASS_NAMES,
                "class_to_category": CLASS_TO_CATEGORY,
                "class_to_severity": CLASS_TO_SEVERITY,
            }, save_path)
            print(f"  ★ New best model saved! Val Acc: {val_acc:.2f}%")

    # Final test evaluation
    print(f"\n{'='*50}")
    print("FINAL EVALUATION ON TEST SET")
    print(f"{'='*50}")
    
    # Load best model for testing
    checkpoint = torch.load(MODEL_DIR / "best_model.pth", map_location=DEVICE, weights_only=False)
    model.load_state_dict(checkpoint["model_state_dict"])
    test_loss, test_acc = validate(model, test_loader, criterion, DEVICE)
    print(f"  Test Loss: {test_loss:.4f} | Test Acc: {test_acc:.2f}%")
    print(f"  Best Val Acc achieved: {best_val_acc:.2f}% (Epoch {checkpoint['epoch']})")

    # Per-class accuracy
    model.eval()
    class_correct = Counter()
    class_total = Counter()
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            outputs = model(images)
            _, predicted = outputs.max(1)
            for label, pred in zip(labels, predicted):
                class_total[label.item()] += 1
                if label == pred:
                    class_correct[label.item()] += 1

    print(f"\n[Per-Class Test Accuracy]")
    for idx, name in enumerate(CLASS_NAMES):
        total = class_total.get(idx, 0)
        correct = class_correct.get(idx, 0)
        acc = 100.0 * correct / total if total > 0 else 0
        print(f"  {name:35s} | {acc:6.2f}% ({correct}/{total})")

    # Save training history
    with open(MODEL_DIR / "training_history.json", "w") as f:
        json.dump(history, f, indent=2)

    # Save class mapping for inference
    with open(MODEL_DIR / "class_mapping.json", "w") as f:
        json.dump({
            "class_names": CLASS_NAMES,
            "class_to_category": CLASS_TO_CATEGORY,
            "class_to_severity": CLASS_TO_SEVERITY,
            "num_classes": len(CLASS_NAMES),
            "image_size": IMAGE_SIZE,
        }, f, indent=2)

    print(f"\n✓ Training complete! Model saved to {MODEL_DIR}")
    print(f"✓ Best validation accuracy: {best_val_acc:.2f}%")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CityPulse ML Training")
    parser.add_argument("--epochs", type=int, default=10, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=32, help="Batch size")
    parser.add_argument("--lr", type=float, default=0.001, help="Learning rate")
    parser.add_argument("--workers", type=int, default=4, help="DataLoader workers")
    args = parser.parse_args()
    main(args)
