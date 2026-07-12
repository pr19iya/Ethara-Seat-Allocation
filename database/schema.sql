-- =====================================================
-- Ethara Seat Allocation & Project Mapping System
-- Database Schema
-- =====================================================

-- ==========================================
-- Table: departments
-- ==========================================

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE INDEX idx_departments_id
ON departments(id);


-- ==========================================
-- Table: projects
-- ==========================================

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    description VARCHAR(255),

    manager_name VARCHAR(100),

    status VARCHAR(30) DEFAULT 'Active'
);

CREATE INDEX idx_projects_id
ON projects(id);


-- ==========================================
-- Table: employees
-- ==========================================

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,

    employee_code VARCHAR(20) NOT NULL UNIQUE,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(100) NOT NULL UNIQUE,

    role VARCHAR(50),

    joining_date DATE,

    status VARCHAR(30) DEFAULT 'Active',

    department_id INTEGER,

    project_id INTEGER,

    CONSTRAINT fk_employees_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id),

    CONSTRAINT fk_employees_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
);

CREATE INDEX idx_employees_department_id
ON employees(department_id);

CREATE INDEX idx_employees_project_id
ON employees(project_id);


-- ==========================================
-- Table: seats
-- ==========================================

CREATE TABLE seats (
    id SERIAL PRIMARY KEY,

    floor INTEGER NOT NULL,

    zone VARCHAR(20) NOT NULL,

    bay VARCHAR(20) NOT NULL,

    seat_number VARCHAR(30) NOT NULL,

    status VARCHAR(30) DEFAULT 'Available',

    CONSTRAINT unique_seat
        UNIQUE (floor, zone, seat_number)
);

CREATE INDEX idx_seats_floor
ON seats(floor);

CREATE INDEX idx_seats_zone
ON seats(zone);

CREATE INDEX idx_seats_status
ON seats(status);


-- ==========================================
-- Table: seat_allocations
-- ==========================================

CREATE TABLE seat_allocations (
    id SERIAL PRIMARY KEY,

    employee_id INTEGER,

    seat_id INTEGER,

    project_id INTEGER,

    allocation_status VARCHAR(30) DEFAULT 'Allocated',

    allocation_date TIMESTAMP WITH TIME ZONE
        DEFAULT CURRENT_TIMESTAMP,

    released_date TIMESTAMP NULL,

    CONSTRAINT fk_seat_allocations_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id),

    CONSTRAINT fk_seat_allocations_seat
        FOREIGN KEY (seat_id)
        REFERENCES seats(id),

    CONSTRAINT fk_seat_allocations_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
);

CREATE INDEX idx_seat_allocations_employee_id
ON seat_allocations(employee_id);

CREATE INDEX idx_seat_allocations_seat_id
ON seat_allocations(seat_id);

CREATE INDEX idx_seat_allocations_project_id
ON seat_allocations(project_id);


-- ==========================================
-- Recommended Constraints (PostgreSQL)
-- ==========================================

CREATE UNIQUE INDEX unique_active_employee_allocation
ON seat_allocations(employee_id)
WHERE allocation_status = 'Allocated';

CREATE UNIQUE INDEX unique_active_seat_allocation
ON seat_allocations(seat_id)
WHERE allocation_status = 'Allocated';
