# Team Task Manager (Full-Stack Application)

## Live Application

https://team-task-management-dashboard.vercel.app/

---

## Overview

The Team Task Manager is a full-stack web application designed to help teams manage projects, assign tasks, and track progress efficiently. It supports multiple users with role-based access control and provides a centralized dashboard for task monitoring.

---

## Tech Stack

* **Frontend:** React (Vite) + Tailwind CSS
* **Backend:** Node.js + Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT + bcrypt

---

## Core Features

### 1. User Authentication

* Signup with name, email, and password
* Secure login using JWT authentication
* Protected routes using middleware

---

### 2. Project Management

* Create projects (creator becomes Admin)
* Add and remove project members
* Members can view assigned projects

---

### 3. Task Management

* Create tasks with:

  * Title
  * Description
  * Due Date
  * Priority (Low, Medium, High)
* Assign tasks to users
* Update task status:

  * To Do
  * In Progress
  * Done

---

### 4. Dashboard

* Total number of tasks
* Tasks categorized by status
* Tasks assigned per user
* Overdue tasks tracking

---

### 5. Role-Based Access Control

* **Admin:**

  * Manage projects and members
  * Create and assign tasks

* **Member:**

  * View assigned tasks
  * Update task status

---

## System Architecture

The backend follows the **MVC (Model-View-Controller)** architecture:

* Models: User, Project, Task
* Controllers: Business logic handling
* Routes: API endpoints
* Middleware: Authentication and authorization

The frontend uses a component-based architecture for modular and maintainable UI.

---

## Folder Structure

### Backend

/backend

* models
* controllers
* routes
* middleware
* config

### Frontend

/frontend

* components
* pages
* services
* context

---

## Setup Instructions

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend (.env)

* MONGO_URI
* JWT_SECRET
* PORT
* CLIENT_URL

### Frontend (.env)

* VITE_API_BASE_URL

---

## Deployment

The application is deployed and publicly accessible:

* **Frontend:** Vercel
* **Backend:** Render

Environment variables are properly configured to ensure seamless communication between frontend and backend.

---

## Submission Includes

* Live Application URL
* GitHub Repository
* README Documentation

