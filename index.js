console.log('Script is running...');

const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'password1',
    database: 'employee_db'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
  startApp();
});

// Function to start the application
function startApp() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
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
    })
    .then((answer) => {
      switch (answer.action) {
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
          connection.end();
          break;
      }
    });
}

// Function to handle application exit
function exitApp() {
  console.log('Exiting application. Goodbye!');
  connection.end();
  process.exit(); // Exit the Node.js process
}

// Function to view all departments
function viewAllDepartments() {
  const query = 'SELECT * FROM department';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.table(res);
    startApp();
  });
}

// Function to view all roles
function viewAllRoles() {
  const query =
    'SELECT role.id, title, salary, department.name AS department FROM role ' +
    'JOIN department ON role.department_id = department.id';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.table(res);
    startApp();
  });
}

// Function to view all employees
function viewAllEmployees() {
  const query =
    'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, ' +
    'CONCAT(manager.first_name, " ", manager.last_name) AS manager ' +
    'FROM employee ' +
    'JOIN role ON employee.role_id = role.id ' +
    'JOIN department ON role.department_id = department.id ' +
    'LEFT JOIN employee manager ON employee.manager_id = manager.id';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.table(res);
    startApp();
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      name: 'departmentName',
      type: 'input',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      const query = 'INSERT INTO department (name) VALUES (?)';
      connection.query(query, [answer.departmentName], (err, res) => {
        if (err) throw err;
        console.log(`Department '${answer.departmentName}' added successfully!\n`);
        startApp();
      });
    });
}

// Function to add a role
function addRole() {
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter the title of the role:',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary for the role:',
        validate: (value) => {
          const valid = !isNaN(parseFloat(value));
          return valid || 'Please enter a valid number';
        },
      },
      {
        name: 'department',
        type: 'input',
        message: 'Enter the department for the role:',
      },
    ])
    .then((answers) => {
      // Retrieve the department id for the entered department name
      const departmentQuery = 'SELECT id FROM department WHERE name = ?';
      connection.query(departmentQuery, [answers.department], (err, depRes) => {
        if (err) throw err;

        if (depRes.length === 0) {
          console.log(`Department '${answers.department}' does not exist. Please add the department first.\n`);
          startApp();
        } else {
          const departmentId = depRes[0].id;

          // Insert the new role into the database
          const roleQuery = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
          connection.query(roleQuery, [answers.title, answers.salary, departmentId], (err, res) => {
            if (err) throw err;
            console.log(`Role '${answers.title}' added successfully!\n`);
            startApp();
          });
        }
      });
    });
}

// Function to add an employee
function addEmployee() {
  // Fetch existing roles for the role prompt
  const rolesQuery = 'SELECT id, title FROM role';
  connection.query(rolesQuery, (err, rolesRes) => {
    if (err) throw err;

    // Fetch existing employees for the manager prompt
    const employeesQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS manager FROM employee';
    connection.query(employeesQuery, (err, employeesRes) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: 'firstName',
            type: 'input',
            message: 'Enter the employee’s first name:',
          },
          {
            name: 'lastName',
            type: 'input',
            message: 'Enter the employee’s last name:',
          },
          {
            name: 'role',
            type: 'list',
            message: 'Choose the employee’s role:',
            choices: rolesRes.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            name: 'manager',
            type: 'list',
            message: 'Choose the employee’s manager:',
            choices: [
              { name: 'None', value: null },
              ...employeesRes.map((employee) => ({
                name: employee.manager,
                value: employee.id,
              })),
            ],
          },
        ])
        .then((answers) => {
          const query =
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
          connection.query(
            query,
            [answers.firstName, answers.lastName, answers.role, answers.manager],
            (err, res) => {
              if (err) throw err;
              console.log(`Employee '${answers.firstName} ${answers.lastName}' added successfully!\n`);
              startApp();
            }
          );
        });
    });
  });
}

// Function to update employee role
function updateEmployeeRole() {
  // Fetch existing employees for the employee prompt
  const employeesQuery =
    'SELECT employee.id, CONCAT(first_name, " ", last_name) AS employee FROM employee';
  connection.query(employeesQuery, (err, employeesRes) => {
    if (err) throw err;

    // Fetch existing roles for the role prompt
    const rolesQuery = 'SELECT id, title FROM role';
    connection.query(rolesQuery, (err, rolesRes) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: 'employee',
            type: 'list',
            message: 'Choose the employee to update:',
            choices: employeesRes.map((employee) => ({
              name: employee.employee,
              value: employee.id,
            })),
          },
          {
            name: 'role',
            type: 'list',
            message: 'Choose the employee’s new role:',
            choices: rolesRes.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answers) => {
          const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
          connection.query(query, [answers.role, answers.employee], (err, res) => {
            if (err) throw err;
            console.log('Employee role updated successfully!\n');
            startApp();
          });
        });
    });
  });
}






