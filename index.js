const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Mazfergs.2',
    database: 'employee_db'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');

    // Run schema.sql
    const schemaSql = fs.readFileSync('./schema.sql', 'utf8');
    connection.query(schemaSql, (err) => {
        if (err) throw err;
        console.log('Schema created successfully');

        // Run seeds.sql
        const seedsSql = fs.readFileSync('./seeds.sql', 'utf8');
        connection.query(seedsSql, (err) => {
            if (err) throw err;
            console.log('Seeds inserted successfully');

            // Start the application
            startApp();
        });
    });
});

function startApp() {
    mainMenu();
}

function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Exit',
                ],
            },
        ])
        .then(({ choice }) => {
            switch (choice) {
                case 'View all departments':
                    viewAllDepartments();
                    break;

                case 'View all roles':
                    viewAllRoles();
                    break;

                case 'View all employees':
                    viewAllEmployees();
                    break;

                case 'Add a department':
                    addDepartment();
                    break;

                case 'Add a role':
                    addRole();
                    break;

                case 'Add an employee':
                    addEmployee();
                    break;

                case 'Update an employee role':
                    updateEmployeeRole();
                    break;

                case 'Exit':
                    console.log('Exiting application.');
                    process.exit(0);

                default:
                    console.log('Invalid choice. Please try again.');
                    mainMenu();
            }
        });
}

function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

function viewAllRoles() {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

function viewAllEmployees() {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of the department:',
            },
        ])
        .then(({ name }) => {
            connection.query('INSERT INTO department SET ?', { name }, (err) => {
                if (err) throw err;
                console.log('Department added successfully');
                mainMenu();
            });
        });
}

function addRole() {
    // Implement the query to add a role
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role:',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for the role:',
            },
            {
                type: 'input',
                name: 'department_id',
                message: 'Enter the department ID for the role:',
            },
        ])
        .then(({ title, salary, department_id }) => {
            connection.query(
                'INSERT INTO role SET ?',
                { title, salary, department_id },
                (err) => {
                    if (err) throw err;
                    console.log('Role added successfully');
                    mainMenu();
                }
            );
        });
}

function addEmployee() {
    // Implement the query to add an employee
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter the first name of the employee:',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter the last name of the employee:',
            },
            {
                type: 'input',
                name: 'role_id',
                message: 'Enter the role ID for the employee:',
            },
            {
                type: 'input',
                name: 'manager_id',
                message: 'Enter the manager ID for the employee (leave blank if none):',
            },
        ])
        .then(({ first_name, last_name, role_id, manager_id }) => {
            connection.query(
                'INSERT INTO employee SET ?',
                { first_name, last_name, role_id, manager_id },
                (err) => {
                    if (err) throw err;
                    console.log('Employee added successfully');
                    mainMenu();
                }
            );
        });
}

function updateEmployeeRole() {
    // Implement the query to update an employee's role
    connection.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw err;

        const employeeChoices = employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: 'Select the employee to update:',
                    choices: employeeChoices,
                },
                {
                    type: 'input',
                    name: 'role_id',
                    message: 'Enter the new role ID for the employee:',
                },
            ])
            .then(({ employee_id, role_id }) => {
                connection.query(
                    'UPDATE employee SET role_id = ? WHERE id = ?',
                    [role_id, employee_id],
                    (err) => {
                        if (err) throw err;
                        console.log('Employee role updated successfully');
                        mainMenu();
                    }
                );
            });
    });
}
