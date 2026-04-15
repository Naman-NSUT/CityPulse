#!/bin/bash
# ============================================================
#  CityPulse — Start All Services Locally
#  Usage: bash start.sh
# ============================================================

set -e
trap 'kill 0' EXIT  # Kill all background processes on exit

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "============================================"
echo "  CityPulse — Starting All Services"
echo "============================================"
echo ""

# ─── 1. Check MongoDB ───────────────────────────────────────
echo "[1/5] Checking MongoDB..."
if docker ps | grep -q citypulse-mongo; then
    echo "  ✓ MongoDB is running in Docker"
elif command -v mongod &>/dev/null; then
    echo "  ✓ MongoDB found locally"
else
    echo "  ⚠ Starting MongoDB in Docker..."
    docker run -d -p 27017:27017 --name citypulse-mongo mongo:7.0
    echo "  ✓ MongoDB started"
fi
echo ""

# ─── 2. Start ML Service (FastAPI) ──────────────────────────
echo "[2/5] Starting ML Service on port 8000..."
cd "$ROOT_DIR/ml-service"
source venv/bin/activate 2>/dev/null || true
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &
ML_PID=$!
echo "  ✓ ML Service started (PID: $ML_PID)"
echo ""

# ─── 3. Start Agent Service (FastAPI) ───────────────────────
echo "[3/5] Starting Agent on port 8001..."
cd "$ROOT_DIR/agent"
source venv/bin/activate 2>/dev/null || true
python3 -m uvicorn main:app --host 0.0.0.0 --port 8001 &
AGENT_PID=$!
echo "  ✓ Agent started (PID: $AGENT_PID)"
echo ""

# ─── 4. Start Express Backend ───────────────────────────────
echo "[4/5] Starting Express API on port 5000..."
cd "$ROOT_DIR/server"
MONGO_URI=mongodb://localhost:27017/citypulse \
ML_SERVICE_URL=http://localhost:8000 \
AGENT_URL=http://localhost:8001 \
PORT=5000 \
node server.js &
SERVER_PID=$!
echo "  ✓ Express API started (PID: $SERVER_PID)"
echo ""

# ─── 5. Start React Frontend ────────────────────────────────
echo "[5/5] Starting React frontend on port 5173..."
cd "$ROOT_DIR/client"
npx vite --port 5173 &
CLIENT_PID=$!
echo "  ✓ Frontend started (PID: $CLIENT_PID)"
echo ""

echo "============================================"
echo "  ✓ All services running!"
echo ""
echo "  Frontend:    http://localhost:5173"
echo "  Express API: http://localhost:5000"
echo "  ML Service:  http://localhost:8000"
echo "  Agent:       http://localhost:8001"
echo "  MongoDB:     localhost:27017"
echo ""
echo "  Press Ctrl+C to stop all services"
echo "============================================"

# Wait for all background processes
wait
