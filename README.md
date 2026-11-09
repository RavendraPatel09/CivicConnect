# CivicConnect AI

CivicConnect AI is a civic issue reporting and management platform that connects residents with municipal teams. Residents can submit and follow public-service complaints, while staff and administrators have tools for reviewing issues, coordinating responses, and monitoring progress.

## Features

- Public landing page explaining the service and how to report an issue.
- Resident registration, sign-in, password recovery, and profile settings.
- Complaint submission and tracking, including status timelines and map views.
- Staff and administrator dashboards for complaint operations and analytics.
- Shared UI components, form validation, and responsive light and dark themes.
- A FastAPI backend foundation with SQLAlchemy models, database configuration, authentication utilities, and a health endpoint.

The backend is under active development. Its API design and frontend integration plan are documented in [docs/API_INTEGRATION_PLAN.md](docs/API_INTEGRATION_PLAN.md); not all planned endpoints are implemented yet.

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| Routing and data | React Router, TanStack Query, Axios |
| Forms and validation | React Hook Form, Zod |
| Maps and charts | Leaflet, React Leaflet, Recharts |
| Backend | FastAPI, SQLAlchemy 2, Alembic |
| Database support | PostgreSQL with pgvector; SQLite for local development and tests |

## Getting started

### Frontend

Requirements: Node.js 18 or newer and npm.

```bash
cd frontend
npm ci
npm run dev
```

Vite prints the local development URL after it starts.

### Backend

Requirements: Python 3.10 or newer. From the repository root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
DATABASE_URL=sqlite+aiosqlite:///./civicconnect.db uvicorn app.main:app --reload
```

The backend health check is available at `http://127.0.0.1:8000/health` and `http://127.0.0.1:8000/api/v1/health`. Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

The SQLite URL above is for local development. For PostgreSQL, set `DATABASE_URL` to a `postgresql+asyncpg://...` connection string and ensure the database and required extensions are configured for your environment. Keep credentials and other secrets in local environment files; do not commit them.

## Useful commands

Run these commands from `frontend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the frontend development server |
| `npm run build` | Type-check and build the frontend for production |
| `npm run lint` | Run ESLint |
| `npm test` | Run the frontend test suite |
| `npm run preview` | Preview a production frontend build |

Run backend tests from `backend/` with the virtual environment activated:

```bash
pytest
```

## Configuration

The frontend API client uses `/api/v1` by default. To point it at a different backend, set `VITE_API_BASE_URL` in `frontend/.env.local`, for example:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

The backend reads settings such as `DATABASE_URL`, `SECRET_KEY`, and `GEMINI_API_KEY` from its environment or a local `backend/.env` file. Use a unique secret key outside local development, and never commit real credentials.

## Project layout

```text
frontend/
  public/        Static assets
  src/
    components/  Shared interface components
    contexts/    Authentication, notifications, and theme state
    pages/       Public, resident, and administrative screens
    services/    API clients and demo data services
    styles/      Global styles
  package.json
  vite.config.ts
backend/
  alembic/       Database migration environment and revisions
  app/
    core/        Application settings, database, and security utilities
    models/      SQLAlchemy data models
    main.py      FastAPI application and health endpoints
  tests/         Backend tests
  Dockerfile     Backend container image
  .dockerignore  Excludes local files from the build context
  requirements.txt
docs/
  API_INTEGRATION_PLAN.md
.github/
  workflows/     CI checks for frontend and backend
.vscode/
  tasks.json     Local auto-push task
scripts/
  auto-push.mjs  Saved-change commit and push watcher
```

## Saved-change publishing

When opened in VS Code, the configured **Auto-push CivicConnect changes** task watches frontend source and assets, backend application code and migrations, tests, and project documentation. After a short pause in file changes, it creates a descriptive commit and pushes it to `origin`. Keep `.env` files, credentials, virtual environments, and generated files out of commits.
