.PHONY: all run start dev test backend frontend clean

all: run

run: start

start:
	@bash ./start.sh

dev:
	@bash ./start.sh

test:
	@echo "Running backend test suite..."
	cd backend && venv/bin/pytest -v
	@echo "Running frontend test suite..."
	cd frontend && npm test -- --run

build:
	cd frontend && npm run build

clean:
	rm -rf dist frontend/dist backend/*.db backend/test*.db
