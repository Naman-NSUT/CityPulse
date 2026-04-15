#!/bin/bash
# ============================================================
#  CityPulse ML Training Pipeline — Run Script
#  Usage: bash run_training.sh
# ============================================================

set -e

echo "============================================"
echo "  CityPulse ML — Training Pipeline"
echo "============================================"

# ─── Configuration ───────────────────────────────────────────
EPOCHS=10
BATCH_SIZE=32
LEARNING_RATE=0.001
WORKERS=4
MODEL_DIR="saved_models"

# ─── Step 0: Activate Virtual Environment ────────────────────
if [ ! -d "venv" ]; then
    echo "[0/4] Creating virtual environment..."
    python3 -m venv venv
fi
echo "[0/4] Activating virtual environment..."
source venv/bin/activate

# ─── Step 1: Install Dependencies ────────────────────────────
echo ""
echo "[1/4] Installing dependencies..."
pip install -r requirements.txt --quiet

# ─── Step 2: Create output directories ───────────────────────
echo "[2/4] Setting up directories..."
mkdir -p "$MODEL_DIR"

# ─── Step 3: Train the model ─────────────────────────────────
echo "[3/4] Starting training..."
echo "       Epochs: $EPOCHS | Batch: $BATCH_SIZE | LR: $LEARNING_RATE"
echo ""

python3 train.py \
    --epochs "$EPOCHS" \
    --batch_size "$BATCH_SIZE" \
    --lr "$LEARNING_RATE" \
    --workers "$WORKERS"

# ─── Step 4: Verify saved outputs ────────────────────────────
echo ""
echo "[4/4] Verifying saved artifacts..."
echo ""

if [ -f "$MODEL_DIR/best_model.pth" ]; then
    SIZE=$(du -h "$MODEL_DIR/best_model.pth" | cut -f1)
    echo "  ✓ best_model.pth         ($SIZE)"
else
    echo "  ✗ best_model.pth         MISSING"
fi

if [ -f "$MODEL_DIR/class_mapping.json" ]; then
    echo "  ✓ class_mapping.json"
else
    echo "  ✗ class_mapping.json     MISSING"
fi

if [ -f "$MODEL_DIR/training_history.json" ]; then
    echo "  ✓ training_history.json"
else
    echo "  ✗ training_history.json  MISSING"
fi

echo ""
echo "============================================"
echo "  Training Complete!"
echo "  Model saved to: $MODEL_DIR/"
echo ""
echo "  To run inference:"
echo "    python3 inference.py --image path/to/image.jpg"
echo ""
echo "  To start the API server:"
echo "    uvicorn main:app --port 8000"
echo "============================================"
