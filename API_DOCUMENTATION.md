# API Documentation

## Overview

The Ethara Seat Allocation & Project Mapping System exposes REST APIs for managing employees, departments, projects, seats, seat allocations, dashboard statistics, analytics, and assistant queries.

## Base URLs

### Local Development

```text
http://localhost:8000
```

### Production

```text

```

## Interactive API Documentation

FastAPI automatically provides Swagger documentation at:

```text
http://localhost:8000/docs
```

Production Swagger URL:

```text
https://ethara-seat-allocation-1e2x.onrender.com
```

---

## Root and Health APIs

### GET `/`

Checks whether the API is running.

#### Example response

```json
{
  "message": "Ethara Seat Allocation API is running"
}
```


---

## Employee APIs

### GET `/employees/`

Returns a list of employees.

#### Optional query parameters

```text
search
page
limit
department
status
```

### POST `/employees/`

Creates a new employee.

#### Example request body

```json
{
  "employee_code": "ETH1001",
  "name": "Amit Sharma",
  "email": "amit.sharma@ethara.ai",
  "department": "Engineering",
  "role": "Software Engineer",
  "joining_date": "2026-07-01",
  "status": "Active",
  "project_id": 1
}
```

### GET `/employees/{employee_id}`

Returns details of one employee.

### PUT `/employees/{employee_id}`

Updates an employee.

### DELETE `/employees/{employee_id}`

Deletes or deactivates an employee, depending on the backend implementation.

---

## Department APIs

### GET `/departments/`

Returns all departments.

### POST `/departments/`

Creates a department.

### PUT `/departments/{department_id}`

Updates a department.

### DELETE `/departments/{department_id}`

Deletes a department.

---

## Project APIs

### GET `/projects/`

Returns all projects.

### POST `/projects/`

Creates a project.

### GET `/projects/{project_id}`

Returns one project.

### GET `/projects/{project_id}/employees`

Returns employees assigned to a project.

### PUT `/projects/{project_id}`

Updates a project.

### DELETE `/projects/{project_id}`

Deletes or deactivates a project.

---

## Seat APIs

### GET `/seats/`

Returns all seats.

### POST `/seats/`

Creates a seat.

### GET `/seats/available`

Returns seats that are currently available.

### GET `/seats/{seat_id}`

Returns details of one seat.

### PUT `/seats/{seat_id}`

Updates a seat.

### DELETE `/seats/{seat_id}`

Deletes a seat when permitted.

---

## Seat Allocation APIs

### POST `/allocations/`

Allocates a seat to an employee.

#### Example request body

```json
{
  "employee_id": 101,
  "seat_id": 205,
  "project_id": 3
}
```

### POST `/allocations/release`

Releases an employee's active seat.

#### Example request body

```json
{
  "employee_id": 101
}
```

### GET `/allocations/`

Returns seat allocation records.

---

## Dashboard APIs

### GET `/dashboard/summary`

Returns high-level application statistics.

#### Example response

```json
{
  "total_employees": 5000,
  "total_seats": 5500,
  "occupied_seats": 4850,
  "available_seats": 500,
  "reserved_seats": 100,
  "pending_allocations": 50
}
```

---

## Analytics APIs

### GET `/analytics/summary`

Returns overall analytics data.

### GET `/analytics/department`

Returns department-wise employee or seat statistics.

### GET `/analytics/projects`

Returns project-wise allocation statistics.

### GET `/analytics/recent-joiners`

Returns recent employees and their allocation status.

### GET `/dashboard/project-utilization`

Returns project-wise seat utilization.

### GET `/dashboard/floor-utilization`

Returns floor-wise occupancy.

---

## Assistant API

### POST `/assistant/query`

Accepts a natural-language query about employees, projects, and seats.

#### Example request

```json
{
  "query": "Where is employee Amit seated?"
}
```

#### Example response

```json
{
  "answer": "Amit is seated on Floor 2, Zone B, Bay 4, Seat B4-23 and is assigned to Project Indigo."
}
```

The exact assistant route may be `/ai/query` or `/assistant/query`. The final documentation must use the route implemented in the backend.

---

## Error Responses

### Validation error

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "Field required",
      "type": "missing"
    }
  ]
}
```

### Resource not found

```json
{
  "detail": "Employee not found"
}
```

### Conflict

```json
{
  "detail": "Seat is already allocated"
}
```

---

## Business Rules

- One employee can have only one active seat.
- One seat can be assigned to only one active employee.
- Released seats become available again.
- Reserved and maintenance seats cannot be allocated.
- Duplicate employee emails are not allowed.
- Duplicate seat numbers within the same floor and zone are not allowed.
- Dashboard statistics must reflect allocation and release operations.
