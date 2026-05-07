# Alz_Dis

Comprehensive full-stack application for cognitive assessments and mini-games (Django backend + React frontend).

## Project Overview

- **Purpose:** Provide cognitive assessments, analytics, and interactive games for evaluation and research.
- **Backend:** Django app with apps: `analytics`, `assessments`, `games`, `users`.
- **Frontend:** Vite + React SPA in the `frontend/` folder.

## Features

- **Assessments:** Create and serve assessment items and results.
- **Games:** Interactive cognitive games (Memory Match, Pattern Sequence, Spatial Reasoning).
- **Analytics:** Aggregated analytics and reporting endpoints.
- **Auth:** User management and authentication flows.

## Tech Stack

- **Backend:** Python, Django, Django REST Framework
- **Database:** SQLite (development) — `backend/db.sqlite3`
- **Frontend:** React, Vite, JavaScript

## Repository Structure

- **backend/**: Django project and apps.
  - [backend/manage.py](backend/manage.py) — Django CLI entry
  - [backend/db.sqlite3](backend/db.sqlite3) — local SQLite DB (dev)
  - [backend/seed.py](backend/seed.py) — seed script to populate sample data
- **frontend/**: React application powered by Vite
  - [frontend/package.json](frontend/package.json)
  - [frontend/src/](frontend/src/) — React source files

## Prerequisites

- Python 3.10+ (or the project's target Python version)
- Node.js 16+ and npm or yarn
- Optional: virtualenv or venv for Python environment

## Backend Setup (Django)

1. Create and activate a Python virtual environment:

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate
```

2. Install dependencies (from project root):

```bash
pip install -r backend/requirements.txt
```

3. Apply migrations and seed example data:

```bash
cd backend
python manage.py migrate
python seed.py
```

4. Run the development server:

```bash
python manage.py runserver
```

The backend API will be available at `http://127.0.0.1:8000/` by default.

## Frontend Setup (React + Vite)

1. Install Node dependencies:

```bash
cd frontend
npm install
# or
yarn
```

2. Start the frontend dev server:

```bash
npm run dev
# open the URL printed by Vite (usually http://localhost:5173)
```

3. To build a production bundle:

```bash
npm run build
```

Notes: The frontend uses `frontend/src/services/api.js` to communicate with the backend API — update the base URL in that file if needed.

## Database & Seeding

- Development uses SQLite stored at [backend/db.sqlite3](backend/db.sqlite3).
- Use [backend/seed.py](backend/seed.py) to populate initial/test data.

## Running Tests

- Backend tests (Django):

```bash
cd backend
python manage.py test
```

- Frontend tests: if present, run via npm scripts in `frontend/package.json` (e.g., `npm test`).

## API Overview

- The Django project exposes REST endpoints for assessments, analytics, games, and user management. See each app's `views.py` and `serializers.py` for schema and behavior:
  - [backend/assessments/views.py](backend/assessments/views.py)
  - [backend/analytics/views.py](backend/analytics/views.py)
  - [backend/games/views.py](backend/games/views.py)
  - [backend/users/views.py](backend/users/views.py)

Authentication, permissions, and route registration live in `backend/config/`:

- [backend/config/urls.py](backend/config/urls.py)
- [backend/config/settings.py](backend/config/settings.py)

## Development Notes

- Keep sensitive settings (e.g., `SECRET_KEY`, production DB credentials) out of repo and use environment variables or a `.env` file.
- If adding new API routes, update frontend API calls in `frontend/src/services/api.js`.

## Contributing

- Fork the repository and create feature branches.
- Keep changes focused and add tests for new behavior.

## Useful Commands

- Run Django shell: `python manage.py shell`
- Create a migration: `python manage.py makemigrations <app>`
- Run frontend lint or format via configured npm scripts.

## License & Contact

- Add your preferred license file at the repository root (e.g., `LICENSE`).
- For questions or contributions, open an issue or PR in this repository.

---

If you want, I can also:

- Add a `requirements.txt` for the backend if it's missing.
- Add a sample `.env.example` and update `config/settings.py` to read from env.
- Run the backend and frontend locally to verify the setup.
