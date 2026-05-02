# Team Task Manager (MVP)

Production-ready MVP with:

- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express.js + MongoDB (Mongoose)
- Auth: JWT + bcrypt password hashing
- Role model: Admin / Member

## Project Structure

- `backend/` - API server
- `frontend/` - React client

## Backend Setup

1. Go to backend:
   - `cd backend`
2. Create environment file:
   - Copy `.env.example` to `.env`
3. Set values in `.env`:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` (optional)
   - `CLIENT_URL`
4. Install dependencies:
   - `npm install`
5. Run server:
   - `npm run dev`

Server base URL: `http://localhost:5000/api`

## Frontend Setup

1. Go to frontend:
   - `cd frontend`
2. Create environment file:
   - Copy `.env.example` to `.env`
3. Set API URL:
   - `VITE_API_BASE_URL=http://localhost:5000/api`
4. Install dependencies:
   - `npm install`
5. Run app:
   - `npm run dev`

Frontend URL: `http://localhost:5173`

## Railway Deployment Notes

- Backend is Railway-ready via:
  - `npm start` script
  - Environment-based config (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`)
- Frontend can be deployed separately with `npm run build`.
- Ensure CORS `CLIENT_URL` matches your deployed frontend URL.
