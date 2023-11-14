USE employee_db;

-- departments
INSERT INTO department (name) VALUES
('Sales'),
('Engineering'),
('Finance'),
('Marketing');

-- roles
INSERT INTO role (title, salary, department_id) VALUES
('Sales Manager', 70000.00, 1),
('Sales Representative', 50000.00, 1),
('Software Engineer', 80000.00, 2),
('Accountant', 60000.00, 3),
('Marketing Specialist', 55000.00, 4);

-- employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Bob', 'Johnson', 3, 1),
('Alice', 'Williams', 4, NULL),
('Charlie', 'Brown', 5, 4);
