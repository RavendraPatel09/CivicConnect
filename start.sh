#!/usr/bin/env bash

# CivicConnect AI — Unified Local Development Runner
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$DIR/backend"
FRONTEND_DIR="$DIR/frontend"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${BLUE}${BOLD}"
echo "=========================================================="
echo "          CivicConnect AI — Smart City Platform           "
echo "        Your City. Your Voice. Real Action.               "
echo "=========================================================="
echo -e "${NC}"

# Detect Python virtualenv
if [ -d "$BACKEND_DIR/venv" ]; then
    VENV_PATH="$BACKEND_DIR/venv"
elif [ -d "$BACKEND_DIR/.venv" ]; then
    VENV_PATH="$BACKEND_DIR/.venv"
else
    echo -e "${YELLOW}Creating Python virtual environment in backend/venv...${NC}"
    python3 -m venv "$BACKEND_DIR/venv"
    VENV_PATH="$BACKEND_DIR/venv"
    "$VENV_PATH/bin/pip" install --upgrade pip
    "$VENV_PATH/bin/pip" install -r "$BACKEND_DIR/requirements.txt"
fi

# Ensure database tables and initial seeding
echo -e "${CYAN}→ Starting FastAPI backend server on http://127.0.0.1:8000...${NC}"
cd "$BACKEND_DIR"
"$VENV_PATH/bin/uvicorn" app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!
cd "$DIR"

# Wait briefly for backend to initialize
sleep 2

# Start Frontend
echo -e "${CYAN}→ Starting Vite frontend server on http://127.0.0.1:3000...${NC}"
cd "$FRONTEND_DIR"
npm run dev -- --host 127.0.0.1 --port 3000 &
FRONTEND_PID=$!
cd "$DIR"

# Cleanup on exit (Ctrl+C)
cleanup() {
    echo -e "\n${YELLOW}Shutting down CivicConnect AI processes...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}All services stopped cleanly.${NC}"
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

echo -e "\n${GREEN}${BOLD}✓ Both services are running!${NC}"
echo -e "  ${BOLD}Frontend App:${NC}      ${CYAN}http://127.0.0.1:3000${NC}"
echo -e "  ${BOLD}Backend API:${NC}       ${CYAN}http://127.0.0.1:8000${NC}"
echo -e "  ${BOLD}Interactive Docs:${NC}  ${CYAN}http://127.0.0.1:8000/docs${NC}"
echo ""
echo -e "${BOLD}Demo Accounts:${NC}"
echo -e "  • Citizen:    ${YELLOW}elena.rostova@example.com${NC} / Password123!"
echo -e "  • Staff:      ${YELLOW}marcus.vance@citygov.org${NC}  / Password123!"
echo -e "  • Admin:      ${YELLOW}sarah.chen@civicconnect.gov${NC} / Password123!"
echo -e "\nPress ${BOLD}Ctrl+C${NC} to stop both servers."

wait
