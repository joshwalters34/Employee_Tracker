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

  const employeesAll = () => {
    // const query = 'SELECT * FROM employeetable INNER JOIN roletable on employeetable.role_id = roletable.id';
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
// need to finish this still
const roleAdd = () => {
  const addRole = 'SELECT id, name FROM department'
    connection.query(addRole, (err, res) => {
      if (err) throw err;
      const deptartmentChoices = res.map(({name}) => {
          return name
        })

  inquirer
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
  .then((answer) => {
    const deptPick = 'Select id FROM department where name = ?'
    const deptResult = connection.query(deptPick, (answer.dept))

    // const query = 'INSERT INTO roletable (title, salary, department_id) VALUES(?, ?, ?)'
    const query = 'INSERT INTO roletable SET title = ?, salary = ?, department_id = ?'
    connection.query(query, (answer.role, answer.salary, deptResult), (err, res) => {
      if (err) throw err;
      // res.forEach(({first_name, last_name, title, manager_id, salary, name}) => {
        const roleResults= res.json(({title, salary, department_id}) => {
          return roleResults
      });
            
        console.log('Added new role!!')
      startPrompt();
    });
    });
  })
  }

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
  
    
