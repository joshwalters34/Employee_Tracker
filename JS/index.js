const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const util = require('util');
const path = require('path');
require('dotenv').config({path:'../.env' });
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
console.log(process.env.DB_NAME);

const connection = mysql.createConnection(
  
  {
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,

  }
);

const query = util.promisify(connection.query).bind(connection);

connection.connect((err) => {
  if (err) throw err;
  startPrompt();
});
// --------Initial prompt to start inquirer --------------
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
          'Update Employee Manager'
        ],
      })
      .then((answer) => {
        switch (answer.start) {
          case 'View All Employees':
            employeesAll();
            break;
  
          case 'View All Employees by Department':
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
            
          case 'Update Employee Manager':
            employeeMangerUpdate();
            break;
  
          default:
            console.log(`Invalid action: ${answer.action}`);
            break;
        }
      });
  };
// ------View all employees------------
  const employeesAll = () => {
    const query = 'select e.first_name, e.last_name, r.title, r.salary, d.name,(select emp.last_name from employeetable emp where emp.id = e.manager_id)  as managerfirstname from employeetable e join roletable r on e.role_id = r.id join department d on r.department_id = d.id ORDER BY last_name'
    connection.query(query, (err, res) =>  {
      if (err) throw err;
      const cTableItems = res.map(({first_name, last_name, title, managerfirstname, salary, name}) => {
        return {first_name: first_name, last_name: last_name, title: title, Manager: managerfirstname, Salary: salary, Department: name};
        
      });
      const table = cTable.getTable(cTableItems)
      console.log(table)
      startPrompt();
    });
  }

  // ----View employees by department-------
  const employeesByDept = () => {
    const departmentsEmpAll = 'SELECT id, name FROM department'
    connection.query(departmentsEmpAll, (err, res) => {
      if (err) throw err;
      const deptartmentChoices = res.map(({name}) => {
          return name
        })
        inquirer
    .prompt({
      name: 'dept',
      type: 'list',
      message: 'Please choose your department?',
      choices: 
        deptartmentChoices,
    })
    .then((answer) => {
      const query = 'select e.first_name, e.last_name, r.title, r.salary, d.name,(select emp.last_name from employeetable emp where emp.id = e.manager_id)  as managerfirstname from employeetable e join roletable r on e.role_id = r.id join department d on r.department_id = d.id WhERE ? ORDER BY last_name'
      connection.query(query, {name: answer.dept}, (err, res) =>  {
        if (err) throw err;
        // res.forEach(({first_name, last_name, title, manager_id, salary, name}) => {
          const cTableItems = res.map(({first_name, last_name, title, manager, salary, name}) => {
            return {first_name, last_name, title, manager, salary, name}
            
        });
        const table = cTable.getTable(cTableItems);

          // const table = cTable.getTable([{first_name: first_name, last_name: last_name, title: title, Manager: manager_id, Salary: salary, Department: name} ]);
          console.log(table)
        startPrompt();
      });
    })
    })
  }
    
  // -----View all departments -------
  const departmentsAll = () => {
      const departmentsAll = 'SELECT * FROM department'
      connection.query(departmentsAll, (err, res) => {
        if (err) throw err;
        const cTableItems = res.map(({name}) => {
            return {department: name}
          });
          const table = cTable.getTable(cTableItems)
          console.log(table)
          startPrompt();
    })
  }
// -----View all roles--------
  const rolesAll = () => {
    const rolesAll = 'SELECT * FROM roletable'
    connection.query(rolesAll, (err, res) => {
      if (err) throw err;
      const cTableItems = res.map(({title, salary}) => {
          return {title: title, salary: salary}
        });
        const table = cTable.getTable(cTableItems)
        console.log(table)
        startPrompt();
  })
}
// ------ add a new role --------
const roleAdd = async () => {
  const addRole = 'SELECT id, name FROM department';
  const departmentData = await query(addRole);
  const deptartmentChoices = departmentData.map(({name}) => name);
  
  const inquirerPrompt = await inquirer
  .prompt([{
    name: 'role',
    type: 'input',
    message: 'What role would you like to add?',
  },
  {name: 'salary',
  type: 'number',
  message: 'What is the salary for this role?',
  },
  {
    name: 'dept',
    type: 'list',
    message: 'Please choose your department?',
    choices: 
    deptartmentChoices,
  },
  ])

  const departResult = departmentData.filter(val => inquirerPrompt.dept === val.name)
  const query2 = 'INSERT INTO roletable (title, salary, department_id) VALUES (?, ?, ?)'
  const addRoleData = await query(query2, [inquirerPrompt.role, inquirerPrompt.salary, departResult[0].id])
  
        
  console.log('Added new role!!')
  startPrompt();
}
// ----add new department------
  const departmentAdd = () => {
    inquirer
    .prompt({
      name: 'departmentName',
      type: 'input',
      message: 'What department would you like to add?',
    },
    )
    .then((answer) => {
      const deptAdd = 'INSERT INTO department (name) VALUES (?)'
      
      connection.query(deptAdd, (answer.departmentName), (err, res) => {
        if (err) throw err;
          return res.send(answer.department)
          });
            

      console.log('New department was added!')
        startPrompt();
      });
  };
  // ----Add new employee-------
  const employeeAdd = async () => {
    const addTitle = 'SELECT id, title FROM roletable';
    const titleData = await query(addTitle);
    const titleChoices = titleData.map(({title}) => title);

    const addManager = 'SELECT id, last_name FROM employeetable';
    const managerData = await query(addManager);
    const managerChoices = managerData.map(({last_name}) => last_name);
    
    const inquirerPrompt = await inquirer
    .prompt([{
      name: 'first_name',
      type: 'input',
      message: 'Enter first name:',
    },
    {name: 'last_name',
    type: 'input',
    message: 'Enter last name:',
    },
    {
      name: 'title',
      type: 'list',
      message: 'Choose a title:',
      choices: 
      titleChoices,
    },
    {
      name: 'manager',
      type: 'list',
      message: 'Choose a manager:',
      choices: 
      managerChoices,
    },
    ])
  
    const titleResult = titleData.filter(val => inquirerPrompt.title === val.title)
    const managerResult = managerData.filter(val => inquirerPrompt.manager == val.last_name)
    const queryEmp = 'INSERT INTO employeetable (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)'
    const addTitleData = await query(queryEmp, [inquirerPrompt.first_name, inquirerPrompt.last_name, titleResult[0].id, managerResult[0].id])
          
    console.log('Added new employee!!')
    startPrompt();
  }

  // ----update an employee role-----
  const employeeRoleUpdate = async () => {
    const addTitle = 'SELECT id, title FROM roletable';
    const titleData = await query(addTitle);
    const titleChoices = titleData.map(({title}) => title);

    const addEmp = 'SELECT id, last_name FROM employeetable';
    const empData = await query(addEmp);
    const empChoices = empData.map(({last_name}) => last_name);
    
    const inquirerPrompt = await inquirer
    .prompt([
      {
        name: 'employee',
        type: 'list',
        message: 'Choose an employee to update',
        choices: 
        empChoices,
      },
      {
      name: 'title',
      type: 'list',
      message: 'Choose a title:',
      choices: 
      titleChoices,
    },
        ])
  
    const empResult = empData.filter(val => inquirerPrompt.employee === val.last_name)
    const titleResult = titleData.filter(val => inquirerPrompt.title === val.title)
    const queryEmpUpdate = 'UPDATE employeetable SET role_id = ? WHERE id = ?'
    const addEmpData = await query(queryEmpUpdate, [titleResult[0].id, empResult[0].id])
          
    console.log('Updated employee role!!')
    startPrompt();
  }
  // ----update an employee manager-----  
  const employeeMangerUpdate= async () => {
    const addManager = 'SELECT id, last_name FROM employeetable';
    const managerData = await query(addManager);
    const managerChoices = managerData.map(({last_name}) => last_name);

    const addEmp = 'SELECT id, last_name FROM employeetable';
    const empData = await query(addEmp);
    const empChoices = empData.map(({last_name}) => last_name);
    
    const inquirerPrompt = await inquirer
    .prompt([
      {
        name: 'employee',
        type: 'list',
        message: 'Choose an employee to update',
        choices: 
        empChoices,
      },
      {
      name: 'manager',
      type: 'list',
      message: 'Who is the new manager:',
      choices: 
      managerChoices,
    },
        ])
  
    const empSelection = empData.filter(val => inquirerPrompt.employee === val.last_name)
    const managerResult = managerData.filter(val => inquirerPrompt.manager === val.last_name)
    const queryEmpManagerUpdate = 'UPDATE employeetable SET manager_id = ? WHERE id = ?'
    const addEmpManagerData = await query(queryEmpManagerUpdate, [managerResult[0].id, empSelection[0].id])
          
    console.log('Updated employee manager!!')
    startPrompt();
  }
    