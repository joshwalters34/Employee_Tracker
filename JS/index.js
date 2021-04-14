const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'GoNiners02@',
  database: 'employeetracker_db',
});

connection.connect((err) => {
  if (err) throw err;
  startPrompt();
});

const startPrompt = () => {
    inquirer
      .prompt({
        name: 'start',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View All Employees',
          'View All Employees by Department',
          'View All Departments',
          'View All Roles',
          'Add Employee',
          'Add Department',
          'Add Role',
          'Update Employee Role',
        ],
      })
      .then((answer) => {
        switch (answer.start) {
          case 'View All Employees':
            employeesAll();
            break;
  
          case 'View All Employees by Deparment':
            employeesByDept();
            break;
  
          case 'View All Departments':
            departmentsAll();
            break;
  
          case 'View All Roles':
            rolesAll();
            break;
  
          case 'Add Employee':
            employeeAdd();
            break;

          case 'Add Department':
            departmentAdd();
            break;
            
          case 'Add Role':
            roleAdd();
            break;

          case 'Update Employee Role':
            employeeRoleUpdate();
            break;
  
          default:
            console.log(`Invalid action: ${answer.action}`);
            break;
        }
      });
  };

  const employeesAll = () => {
    const query = 'SELECT * FROM employeetable INNER JOIN roletable on employeetable.role_id = roletable.id';
    connection.query(query, (err, res) =>  {
      if (err) throw err;
      res.forEach(({first_name, last_name, title, manager_id, salary}) => {
        // console.table(`First Name: ${first_name} || Last Name ${last_name} || Title: ${role_id} || Manager: ${manager_id} `);
        const table = cTable.getTable([{first_name: first_name, last_name: last_name, title: title, Manager: manager_id, Salary: salary} ]);
        console.log(table)
      });
      startPrompt();
    });
  }