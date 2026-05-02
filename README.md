# Team Task Manager (MVP)

A full-stack minimal Team Task Manager application with:

- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express.js + MongoDB (Mongoose)
- Authentication: JWT + bcrypt
- Roles: `admin` and `member`

This README explains the repository layout, setup, run and deployment steps, key files, API endpoints, and common troubleshooting items.

---

## Repo Layout

- `backend/` — Express API server
  - `src/app.js` — express app, middleware, CORS handling
  - `src/server.js` — app bootstrap
  - `src/controllers/` — request handlers (auth, projects, tasks, dashboard, users)
  - `src/models/` — Mongoose models (`User`, `Project`, `Task`)
  - `src/routes/` — route definitions
  - `src/middleware/` — auth, role checks, error handling
  - `.env.example` — backend environment variables template

- `frontend/` — React client (Vite)
  - `src/main.jsx` — app entry
  - `src/App.jsx` — routes
  - `src/pages/` — `DashboardPage`, `TasksPage`, `ProjectsPage`, `LoginPage`, `SignupPage`, `ProfilePage`
  - `src/components/` — `Layout`, `Sidebar`, `TaskCard`, `ProjectCard`, `ProtectedRoute`
  - `src/context/AuthContext.jsx` — auth provider + token management
  - `src/services/api.js` — axios wrapper + endpoints
  - `vercel.json` — rewrite rules for SPA routing (when deploying `frontend` folder to Vercel)

- Root
  - `vercel.json` — rewrite rules if deploying repo root to Vercel
  - `.gitignore`
  - `README.md` (this file)

---

## Features

- User signup / login with JWT
- Role-based permissions: only project admins can create tasks and manage members
- Projects with members and tasks
- Tasks assigned to users with status (`To Do`, `In Progress`, `Done`)
- Dashboard summary: counts, tasks per user, overdue
- Protected client routes and profile page

---

## Environment Variables

Backend (`backend/.env`)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret used to sign JWTs
- `PORT` — optional, default 5000
- `CLIENT_URL` — frontend origin(s) allowed for CORS (comma-separated if multiple)

Frontend (`frontend/.env`)
- `VITE_API_BASE_URL` — base API URL, e.g. `https://your-backend.com/api` or `http://localhost:5000/api`

NOTE: Copy `.env.example` to `.env` and fill values.

---

## Local Development

Backend
```bash
cd backend
npm install
cp .env.example .env
# set MONGO_URI and JWT_SECRET in .env
npm run dev
```

Frontend
```bash
cd frontend
npm install
cp .env.example .env
# set VITE_API_BASE_URL in .env
npm run dev
```

By default the API base for frontend is `http://localhost:5000/api`.

---

## Deployment Notes

- Backend: any Node host (Render, Heroku, Railway). Ensure `CLIENT_URL` env var matches your deployed frontend origin (include protocol, no trailing slash). Multiple origins supported comma-separated.
- Frontend: Vercel is configured with `vercel.json` rewrite rules so client-side routing works on reloads. If you deploy only the `frontend` folder, keep `frontend/vercel.json` in place and set the Vercel project root to `frontend`.

Quick checklist:
- Set `VITE_API_BASE_URL` on Vercel to `https://your-backend.com/api`.
- Set `CLIENT_URL` on the backend host to `https://your-frontend.vercel.app`.
- Redeploy both services after changing envs.

---

## API Endpoints (summary)

All endpoints are prefixed with `/api`.

- `POST /api/auth/signup` — create account (returns token + user)
- `POST /api/auth/login` — login (returns token + user)
- `GET /api/auth/me` — get current user (protected)

- `GET /api/users` — list users (protected)

- `GET /api/projects` — list projects where user is a member
- `POST /api/projects` — create project (admin)
- `POST /api/projects/:projectId/members` — add member (project admin)
- `DELETE /api/projects/:projectId/members/:memberId` — remove member (project admin)

- `POST /api/tasks/project/:projectId` — create task (project admin)
- `GET /api/tasks/project/:projectId` — get tasks for project (admin sees all; members see only assigned tasks)
- `PATCH /api/tasks/:taskId/status` — update task status (only assigned user)

- `GET /api/dashboard` — dashboard stats for user's projects

---

## Troubleshooting (common issues)

- 404 on reload (SPA routing): Ensure `vercel.json` is present and Vercel rewrite rules are configured. If you deploy the `frontend` folder, keep `frontend/vercel.json` and set project root to `frontend`.
- CORS errors: Backend `CLIENT_URL` must exactly match the browser origin (including protocol). The backend supports comma-separated origins and normalizes values (trims trailing slashes and adds `https://` when omitted).
- Repeated 304 logs: Express ETag generation can trigger 304 responses. This project disables ETag for API endpoints and adds short `Cache-Control` headers to reduce revalidation. If you still see duplicate requests, check for duplicate fetches in the client (React StrictMode in development double-invokes effects).

---

## Code pointers (where to look)

- Authentication: [backend/src/controllers/authController.js]
- Protected routes and token parsing: [backend/src/middleware/authMiddleware.js]
- Project management: [backend/src/controllers/projectController.js]
- Task logic: [backend/src/controllers/taskController.js]
- Dashboard aggregation: [backend/src/controllers/dashboardController.js]
- Frontend API wrapper: [frontend/src/services/api.js]
- Sidebar & layout: [frontend/src/components/Sidebar.jsx], [frontend/src/components/Layout.jsx]

---

## Contributing

- Create a feature branch, open a PR, and include tests or manual verification steps. Keep changes focused and run `npm run dev` in both `backend` and `frontend` to validate.

---

If you want, I can also:
- Commit and push this README update for you, or
- Generate a short `DEPLOY.md` with step-by-step instructions for Render and Vercel.

