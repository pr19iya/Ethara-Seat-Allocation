# Debugging Notes

# Ethara Seat Allocation & Project Mapping System

This document summarizes the major issues encountered during development and deployment of the project, along with their root causes, solutions, and validation steps.

---

# 1. FastAPI ASGI Import Error

## Error

```
ERROR: Error loading ASGI app.
Could not import module "main".
```

## Cause

The FastAPI application entry point was located inside `app/main.py`, but Uvicorn was started with an incorrect module path.

## Solution

Updated the startup command to:

```bash
uvicorn app.main:app --reload
```

For Render deployment:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Verification

- Backend started successfully.
- Root endpoint (`/`) returned a successful response.
- Swagger documentation (`/docs`) loaded correctly.

---

# 2. Next.js Duplicate Route Error

## Error

```
You cannot have two parallel pages that resolve to the same path.
```

## Cause

Two different `page.tsx` files generated the `/employees` route:

```
app/employees/page.tsx

app/(dashboard)/employees/page.tsx
```

## Solution

Removed the duplicate page and retained a single employee page.

## Verification

- Next.js compiled successfully.
- `/employees` loaded without errors.

---

# 3. Frontend Could Not Connect to Backend

## Problem

The frontend failed to retrieve data from the FastAPI backend after deployment.

## Cause

The frontend was still using the localhost backend URL.

## Solution

Configured the frontend environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com
```

Redeployed the frontend.

## Verification

Employee data loaded correctly after deployment.

---

# 4. Database Connection Failure

## Problem

The backend could not connect to the PostgreSQL database.

## Cause

The Supabase database password had been updated, but the Render environment variable still contained the old connection string.

## Solution

Updated the `DATABASE_URL` environment variable in Render.

## Verification

Backend connected successfully and CRUD operations worked normally.

---

# 5. CORS Error

## Error

```
Access to fetch has been blocked by CORS policy.
```

## Cause

The deployed frontend URL was not included in the allowed origins.

## Solution

Configured FastAPI CORS middleware:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-vercel-app.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Verification

Frontend API requests completed successfully.

---

# 6. Employee Table Not Displaying Data

## Problem

The employee page loaded successfully but displayed an empty table.

## Cause

The frontend response structure did not match the backend response.

## Solution

Updated the API service and table component to match the backend response model.

## Verification

Employee records displayed correctly.

---

# 7. Seat Allocation Validation

## Problem

Duplicate seat allocations were possible during testing.

## Solution

Added validation to ensure:

- One employee has only one active seat.
- One seat is assigned to only one active employee.
- Reserved seats cannot be allocated.
- Released seats become available again.

## Verification

Multiple allocation attempts correctly returned validation errors.

---

# 8. Swagger Documentation

## Problem

Some APIs were missing from Swagger UI.

## Cause

Routes were not included correctly in the FastAPI application.

## Solution

Registered all routers inside `main.py`.

## Verification

Swagger displayed all API endpoints.

---

# 9. AI Assistant Integration

## Problem

The assistant initially failed to respond correctly to seat-related queries.

## Cause

Keyword matching did not cover all supported query formats.

## Solution

Improved query parsing and expanded supported keywords.

## Verification

The assistant correctly answered employee seat and project-related queries.

---

# Validation Process

The application was verified using the following approach:

- Backend endpoints tested using Swagger UI.
- CRUD operations validated against the PostgreSQL database.
- Frontend tested in Chrome.
- Dashboard statistics checked against database records.
- Seat allocation rules verified using positive and negative test cases.
- Deployment tested on Render and Vercel.
- Database schema reviewed against SQLAlchemy models.
- API responses validated against expected JSON formats.

---

# Conclusion

All identified issues were resolved through debugging, testing, and validation. The final application was tested locally and after deployment to ensure stable functionality across all major modules.
