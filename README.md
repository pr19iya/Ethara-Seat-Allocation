# Ethara Seat Allocation & Project Mapping System

A full-stack web application developed to simplify employee seat allocation and project mapping within an organization. The system helps HR and Admin teams manage employees, projects, and workspace allocation while providing an AI-powered assistant to answer workspace-related queries.

## Overview

Managing seating for thousands of employees across multiple floors and projects can become difficult as organizations grow. This application provides a centralized platform where administrators can manage employees, assign projects, allocate seats, and monitor workspace utilization through an interactive dashboard.

The application also includes an AI assistant capable of answering natural language queries related to employees, projects, and seat allocation.

---
## Live Deployment

Frontend: https://ethara-seat-allocation-livid.vercel.app

Backend: https://ethara-seat-allocation-1e2x.onrender.com

Swagger: https://ethara-seat-allocation-1e2x.onrender.com/docs



## Features

### Employee Management
- Add, edit, view and delete employees
- Search employees by name, ID or email
- Assign employees to projects
- Track joining date and employment status

### Project Management
- Create and manage projects
- View employees assigned to each project
- Project-wise employee statistics

### Seat Allocation
- Visual floor-wise seat map
- Allocate available seats to employees
- Prevent duplicate seat allocation
- View occupied, reserved and maintenance seats
- Filter seats by status

### Dashboard & Analytics
- Total employees
- Total seats
- Available seats
- Occupied seats
- Reserved seats
- Department-wise employee distribution
- Floor-wise occupancy
- Project-wise allocation
- Recent joiners

### AI Assistant
- Natural language query interface
- Rule-based fallback assistant
- Answers questions related to:
  - Employee seating
  - Project assignment
  - Available seats
  - Seat utilization
  - Employee count
  - Project statistics

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- Lucide React

### Backend
- FastAPI
- SQLAlchemy
- Pydantic

### Database
- PostgreSQL (Supabase)

### Deployment
- Frontend: Vercel
- Backend: Render

---

## Project Structure

```
Ethara-Seat-Allocation
│
├── backend
│   ├── app
│   ├── models
│   ├── routes
│   ├── services
│   ├── database
│   └── main.py
│
├── frontend
│   ├── app
│   ├── components
│   ├── services
│   ├── lib
│   └── types
│
├── docs
├── README.md
└── AI_PROMPTS.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/pr19iya/Ethara-Seat-Allocation.git

cd Ethara-Seat-Allocation
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate      # macOS/Linux

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs on:

```
http://localhost:8000
```
Swagger Documentation:

```
http://localhost:8000/docs
```
---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```
Frontend runs on:

```
http://localhost:3000
```
---

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=YOUR_SUPABASE_DATABASE_URL
OPENAI_API_KEY=YOUR_OPENAI_KEY
OPENAI_MODEL=gpt-5-mini
FRONTEND_URL=http://localhost:3000
```
### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---
## API Endpoints

### Employee

```
GET /employees
POST /employees
PUT /employees/{id}
DELETE /employees/{id}
```

### Projects

```
GET /projects
POST /projects
```

### Seats

```
GET /seats
POST /seats
GET /seats/available
```

### Seat Allocation

```
GET /allocation/floors
GET /allocation/floor/{floor}
POST /allocation/allocate
```

### Dashboard

```
GET /dashboard/summary
```

### Analytics

```
GET /analytics/summary
GET /analytics/projects
GET /analytics/departments
```

### AI Assistant

```
POST /assistant/ask
```

---



---

## Screenshots

Project screenshots are available in the `docs/` folder:

- Dashboard
- Employee Management
- Project Management
- Seat Allocation
- Analytics
- AI Assistant
- API Documentation (Swagger)

---

## Business Rules Implemented

- One employee can have only one active seat.
- One seat can be allocated to only one employee.
- Duplicate seat allocation is prevented.
- Reserved seats cannot be allocated.
- Dashboard updates after seat allocation.
- Search and filtering supported across employees, projects and seats.

---

## AI Usage

AI tools were used during development for:

- Architecture planning
- Backend API design
- Database modelling
- Frontend implementation
- AI assistant development
- Debugging deployment issues
- Code refactoring

All prompts used during development are documented in **AI_PROMPTS.md**.

---

## Future Improvements

- Authentication and role-based access
- CSV bulk upload
- Automatic seat recommendation
- OpenAI-powered assistant
- Email notifications
- Real-time dashboard updates
- Floor layout editor

---

## Author

**Priya Rajput**

GitHub: https://github.com/pr19iya

```

### Before submitting, replace these placeholders:

- `<YOUR_VERCEL_URL>` → your deployed frontend URL.
- `<YOUR_RENDER_URL>` → your deployed backend URL.

This README aligns well with the assessment requirements and documents the project in a clear, professional way.
