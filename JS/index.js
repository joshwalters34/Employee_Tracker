const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const util = require('util');

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
          const cTableItems = res.map(({first_name, last_name, title, managerfirstname, salary, name}) => {
            return {first_name, last_name, title, managerfirstname, salary, name}
            
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
  // console.log(departmentData)
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
  
  console.log(addRoleData);
        
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
      // const deptAdd = 'INSERT INTO department SET name=?'
      
      connection.query(deptAdd, (answer.departmentName), (err, res) => {
        if (err) throw err;
        // const deptAnswer = res.JSON(({name}) => {
          // const roleResults = res.val(({name}) => {
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
    // console.log(departmentData)
    const titleChoices = titleData.map(({title}) => title);

    const addManager = 'SELECT id, last_name FROM employeetable';
    const managerData = await query(addManager);
    console.log(managerData)
    const managerChoices = managerData.map(({last_name}) => last_name);
    
    const inquirerPrompt = await inquirer
    .prompt([{
      name: 'first_name',
      type: 'input',
      message: 'Enter first name:',
    },
    {name: 'last_name.',
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
    
    console.log(addTitleData);
          
    console.log('Added new employee!!')
    startPrompt();
  }
    
