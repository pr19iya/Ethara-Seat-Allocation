# AI_PROMPTS.md

# AI Usage Documentation

## Project

**Ethara Seat Allocation & Project Mapping System**

This document describes how AI tools were used during the development of the project. AI was used as a development assistant for planning, code generation, debugging, documentation, and deployment. All generated code was reviewed, modified, tested, and validated before being included in the final project.

---

# Prompt 1 – Project Planning

### Prompt

> Design a scalable full-stack architecture for an Employee Seat Allocation and Project Mapping System using FastAPI, Next.js, PostgreSQL, and SQLAlchemy. The application should support employee management, project mapping, seat allocation, dashboard analytics, and an AI assistant.

### Purpose

Used to plan the project structure and divide the application into frontend, backend, database, and API layers.

---

# Prompt 2 – Database Design

### Prompt

> Design a PostgreSQL database schema for Employee, Department, Project, Seat, and Seat Allocation with appropriate primary keys, foreign keys, relationships, and business constraints.

### Purpose

Used while creating SQLAlchemy models and the database schema.

---

# Prompt 3 – Backend Development

### Prompt

> Create REST APIs in FastAPI for Employee Management including CRUD operations, request validation using Pydantic, SQLAlchemy ORM integration, and proper error handling.

### Purpose

Used while implementing backend APIs.

---

# Prompt 4 – Seat Allocation Logic

### Prompt

> Design seat allocation logic that ensures one employee can only have one active seat, one seat can only be assigned to one employee, and released seats become available again.

### Purpose

Used while implementing allocation validation and business rules.

---

# Prompt 5 – Dashboard & Analytics

### Prompt

> Generate SQLAlchemy queries for dashboard statistics including total employees, available seats, occupied seats, project utilization, and floor-wise occupancy.

### Purpose

Used while building dashboard and analytics endpoints.

---

# Prompt 6 – Frontend Development

### Prompt

> Create reusable React/Next.js components for employee management including search, pagination, filtering, forms, tables, and API integration using Axios.

### Purpose

Used while developing the frontend interface.

---

# Prompt 7 – AI Assistant

### Prompt

> Build a simple AI assistant capable of answering employee seat allocation and project-related questions using natural language. If an LLM is unavailable, implement a keyword-based fallback.

### Purpose

Used while implementing the assistant module.

---

# Prompt 8 – Debugging

### Prompt

> Help identify and resolve FastAPI startup errors, SQLAlchemy relationship issues, CORS problems, Next.js routing conflicts, deployment failures, and frontend API integration issues.

### Purpose

Used while debugging the application during development.

---

# Prompt 9 – Deployment

### Prompt

> Explain how to deploy a FastAPI backend on Render, a Next.js frontend on Vercel, connect them to a Supabase PostgreSQL database, and configure environment variables securely.

### Purpose

Used during production deployment.

---

# Prompt 10 – Documentation

### Prompt

> Generate professional project documentation including README, API documentation, deployment guide, debugging notes, AI prompt documentation, and database schema.

### Purpose

Used while preparing the final submission.

---

# What AI Generated Correctly

AI was helpful in:

- Designing the initial project architecture.
- Generating SQLAlchemy model templates.
- Creating FastAPI CRUD API structures.
- Explaining SQLAlchemy relationships.
- Suggesting reusable React components.
- Providing deployment guidance for Render and Vercel.
- Assisting with debugging common FastAPI and Next.js issues.
- Preparing project documentation.

---

# What AI Generated Incorrectly

Some generated code required modification before it could be used.

Examples include:

- Incorrect import paths.
- API routes that did not match the project structure.
- SQLAlchemy relationship definitions that required adjustments.
- Frontend components that required integration with the existing codebase.
- Deployment commands that needed modification based on the project folder structure.

---

# Manual Changes Made

The following work was completed manually:

- Modified generated code to match the project architecture.
- Updated SQLAlchemy relationships.
- Fixed frontend routing conflicts.
- Corrected backend API integration.
- Updated environment variables.
- Adjusted Render deployment configuration.
- Tested API responses using Swagger.
- Validated frontend functionality.
- Created database schema and seed data.
- Prepared project documentation.

---

# Validation Process

All AI-generated content was reviewed and validated before being committed.

Validation included:

- Running the backend locally using FastAPI.
- Testing all REST APIs through Swagger UI.
- Verifying database operations in PostgreSQL.
- Testing frontend functionality in the browser.
- Verifying seat allocation rules.
- Checking API responses against expected results.
- Testing deployment on Render and Vercel.
- Reviewing generated documentation for accuracy.

---

# AI Tools Used

- ChatGPT
- GitHub Copilot (where applicable)

AI was used as a development assistant. Final implementation, debugging, testing, integration, and validation were completed manually before submission.
