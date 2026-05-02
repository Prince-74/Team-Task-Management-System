# Team Task Manager (Full-Stack Application)

## Live Application

https://team-task-management-dashboard.vercel.app/

---

## Overview

This is a full-stack Team Task Management web application where users can create projects, assign tasks, and track progress. It supports role-based access with Admin and Member roles.

---

## Tech Stack

* Frontend: React (Vite) + Tailwind CSS
* Backend: Node.js + Express.js
* Database: MongoDB (Mongoose)
* Authentication: JWT + bcrypt

---

## Features

### Authentication

* User signup and login
* Secure JWT-based authentication

### Project Management

* Create projects (creator becomes Admin)
* Add/remove members
* View assigned projects

### Task Management

* Create tasks (Title, Description, Due Date, Priority)
* Assign tasks to users
* Update task status (To Do, In Progress, Done)

### Dashboard

* Total tasks
* Tasks by status
* Tasks per user
* Overdue tasks

### Role-Based Access

* Admin: manage projects, users, and tasks
* Member: view and update assigned tasks

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

The application is deployed using Railway and is publicly accessible.

---

## Submission Includes

* Live application link
* GitHub repository
* README file
* Demo video (2–5 minutes)
