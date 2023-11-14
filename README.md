# SQL-Employee-Tracker

## Description
The motivation behind building this project was to create a command-line application for managing a company's employee database. It serves as a practical example of using Node.js, Inquirer for user prompts, MySQL (specifically, mysql2) for database interactions, and structuring the application to handle various tasks related to employees, roles, and departments.

The project was built to provide a hands-on experience in creating a real-world application that interacts with a database. It's not just about fulfilling a homework assignment but rather about applying the skills learned in a meaningful context, where the development of a command-line employee management system can be translated into practical scenarios in professional settings.

It automates the process of adding departments, roles, and employees, viewing their details, and updating employee roles. It can be a useful tool for businesses to streamline their employee data management process.

## Table of Contents (Optional)

If your README is long, add a table of contents to make it easy for users to find what they need.

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [License](#license)
- [Contribute](#contribute)

## Installation

To install this project, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the cloned directory
3. Run npm install to install dependencies including Inquirer and MySql2
4. Set up a MySQL database and run the provided schema and seed files to populate your database.
5. Update the mysql.createConnection in the index.js with your MySQL credentials.

## Usage

You can view a video run through of the app usage here: https://drive.google.com/file/d/1MyskA9_BZhlIxTGh05zFN1VOg2ufc85q/view?usp=drive_link

To use the SQL Employee Tracker application, follow the steps below. I'll provide instructions for each available action along with examples:

1. View all Departments, Roles, or Employees
Choose the option to "View all departments," "View all roles," or "View all employees" from the main menu.
The application will display a formatted table showing the relevant information.

![my screenshot](<images/Screenshot 2023-11-14 at 1.29.14 pm.png>)


2. Add a Department, Role, or Employee
Choose the option to "Add a department," "Add a role," or "Add an employee" from the main menu.
Follow the prompts to enter the required information.

![my screenshot](<images/Screenshot 2023-11-14 at 1.29.44 pm.png>)

3. Update an Employee Role
Choose the option to "Update an employee role" from the main menu.
Follow the prompts to select an employee and their new role.

![my screenshot](<images/Screenshot 2023-11-14 at 1.40.16 pm.png>)

4. Exit the Application
Choose the option to "Exit" from the main menu.

## Features

JavaScript
jQuery
Node.js
Inquirer
MySQL2

## License

This project is licensed under the MIT License.

## Contribute

Github: https://github.com/MFMcNolt/SQL-Employee-Tracker

