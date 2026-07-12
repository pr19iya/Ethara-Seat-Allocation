```sql
-- =====================================================
-- Ethara Seat Allocation & Project Mapping System
-- Sample Seed Data
-- PostgreSQL / Supabase
-- =====================================================
--
-- Dataset created:
-- 10 departments
-- 10 projects
-- 5,000 employees
-- 5 floors
-- 10 zones
-- 5,500 seats
-- 4,900 occupied seats
-- 500 available seats
-- 100 reserved seats
-- 100 employees pending seat allocation
--
-- Run schema.sql before running this file.
-- WARNING: This script removes existing records from these tables.
-- =====================================================


-- =====================================================
-- 1. Clear Existing Data
-- =====================================================

TRUNCATE TABLE
    seat_allocations,
    employees,
    seats,
    departments,
    projects
RESTART IDENTITY CASCADE;


-- =====================================================
-- 2. Insert Departments
-- =====================================================

INSERT INTO departments (name)
VALUES
    ('Engineering'),
    ('Human Resources'),
    ('Finance'),
    ('Operations'),
    ('Growth'),
    ('Product'),
    ('Design'),
    ('Quality Assurance'),
    ('Customer Support'),
    ('Administration');


-- =====================================================
-- 3. Insert Projects
-- =====================================================

INSERT INTO projects (
    name,
    description,
    manager_name,
    status
)
VALUES
    (
        'Indigo',
        'Core platform development and engineering project',
        'Aarav Sharma',
        'Active'
    ),
    (
        'Indreed',
        'Enterprise application integration project',
        'Meera Singh',
        'Active'
    ),
    (
        'Mydreed',
        'Customer experience and engagement project',
        'Rohan Verma',
        'Active'
    ),
    (
        'Preed',
        'Business process automation project',
        'Neha Gupta',
        'Active'
    ),
    (
        'Serfy',
        'Data analytics and reporting project',
        'Vikram Rao',
        'Active'
    ),
    (
        'Oreed',
        'Operations management platform',
        'Isha Jain',
        'Active'
    ),
    (
        'Bedegreed',
        'Employee learning and development platform',
        'Karan Mehta',
        'Active'
    ),
    (
        'Opreed',
        'Internal workflow management project',
        'Ananya Das',
        'Active'
    ),
    (
        'Serry',
        'Customer support and service platform',
        'Arjun Kapoor',
        'Active'
    ),
    (
        'Kaary',
        'Employee productivity and collaboration project',
        'Kavya Nair',
        'Active'
    );


-- =====================================================
-- 4. Insert 5,500 Seats
-- =====================================================
--
-- Seat distribution:
-- IDs 1–4900    = Occupied
-- IDs 4901–5400 = Available
-- IDs 5401–5500 = Reserved
--
-- Floors: 1–5
-- Zones: A–J
-- Bays: Bay 1–Bay 5
-- =====================================================

INSERT INTO seats (
    floor,
    zone,
    bay,
    seat_number,
    status
)
SELECT
    ((seat_no - 1) / 1100) + 1 AS floor,

    CHR(
        65 + (((seat_no - 1) % 1100) / 110)
    ) AS zone,

    'Bay ' ||
    (
        (((seat_no - 1) % 110) / 22) + 1
    )::TEXT AS bay,

    'F' ||
    (((seat_no - 1) / 1100) + 1)::TEXT ||
    '-' ||
    CHR(
        65 + (((seat_no - 1) % 1100) / 110)
    ) ||
    '-' ||
    LPAD(
        (((seat_no - 1) % 110) + 1)::TEXT,
        3,
        '0'
    ) AS seat_number,

    CASE
        WHEN seat_no <= 4900 THEN 'Occupied'
        WHEN seat_no <= 5400 THEN 'Available'
        ELSE 'Reserved'
    END AS status

FROM generate_series(1, 5500) AS seat_no;


-- =====================================================
-- 5. Insert 5,000 Employees
-- =====================================================
--
-- Employees 1–4900:
-- Have active seat allocations
--
-- Employees 4901–5000:
-- Pending seat allocation
--
-- Employees are distributed across:
-- 10 departments
-- 10 projects
-- =====================================================

INSERT INTO employees (
    employee_code,
    name,
    email,
    role,
    joining_date,
    status,
    department_id,
    project_id
)
SELECT
    'ETH' || LPAD(employee_no::TEXT, 5, '0')
        AS employee_code,

    'Employee ' || employee_no::TEXT
        AS name,

    'employee' || employee_no::TEXT || '@ethara.ai'
        AS email,

    CASE ((employee_no - 1) % 10)
        WHEN 0 THEN 'Software Engineer'
        WHEN 1 THEN 'HR Executive'
        WHEN 2 THEN 'Financial Analyst'
        WHEN 3 THEN 'Operations Executive'
        WHEN 4 THEN 'Growth Associate'
        WHEN 5 THEN 'Product Analyst'
        WHEN 6 THEN 'UI/UX Designer'
        WHEN 7 THEN 'QA Engineer'
        WHEN 8 THEN 'Support Executive'
        ELSE 'Administration Executive'
    END AS role,

    DATE '2024-01-01'
        + ((employee_no - 1) % 900)
        AS joining_date,

    'Active' AS status,

    ((employee_no - 1) % 10) + 1
        AS department_id,

    ((employee_no - 1) % 10) + 1
        AS project_id

FROM generate_series(1, 5000) AS employee_no;


-- =====================================================
-- 6. Insert 4,900 Active Seat Allocations
-- =====================================================
--
-- First 4,900 employees are assigned to
-- the first 4,900 occupied seats.
--
-- Remaining 100 employees have no allocation.
-- =====================================================

INSERT INTO seat_allocations (
    employee_id,
    seat_id,
    project_id,
    allocation_status,
    allocation_date,
    released_date
)
SELECT
    employee_no AS employee_id,

    employee_no AS seat_id,

    ((employee_no - 1) % 10) + 1 AS project_id,

    'Allocated' AS allocation_status,

    CURRENT_TIMESTAMP
        - ((employee_no - 1) % 365) * INTERVAL '1 day'
        AS allocation_date,

    NULL AS released_date

FROM generate_series(1, 4900) AS employee_no;


-- =====================================================
-- 7. Verification Queries
-- =====================================================

-- Total departments
SELECT COUNT(*) AS total_departments
FROM departments;

-- Total projects
SELECT COUNT(*) AS total_projects
FROM projects;

-- Total employees
SELECT COUNT(*) AS total_employees
FROM employees;

-- Total seats
SELECT COUNT(*) AS total_seats
FROM seats;

-- Seat status distribution
SELECT
    status,
    COUNT(*) AS seat_count
FROM seats
GROUP BY status
ORDER BY status;

-- Total active allocations
SELECT COUNT(*) AS active_allocations
FROM seat_allocations
WHERE allocation_status = 'Allocated';

-- Employees pending allocation
SELECT COUNT(*) AS employees_pending_allocation
FROM employees e
LEFT JOIN seat_allocations sa
    ON e.id = sa.employee_id
    AND sa.allocation_status = 'Allocated'
WHERE sa.id IS NULL;

-- Project-wise employee distribution
SELECT
    p.name AS project_name,
    COUNT(e.id) AS employee_count
FROM projects p
LEFT JOIN employees e
    ON e.project_id = p.id
GROUP BY p.id, p.name
ORDER BY p.id;

-- Floor-wise seat distribution
SELECT
    floor,
    COUNT(*) AS total_seats,
    COUNT(*) FILTER (
        WHERE status = 'Occupied'
    ) AS occupied_seats,
    COUNT(*) FILTER (
        WHERE status = 'Available'
    ) AS available_seats,
    COUNT(*) FILTER (
        WHERE status = 'Reserved'
    ) AS reserved_seats
FROM seats
GROUP BY floor
ORDER BY floor;
```
