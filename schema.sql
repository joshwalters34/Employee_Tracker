DROP DATABASE IF EXISTS employeeTracker_DB;
CREATE database employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE employeeTable (
  id INT NOT NULL AUTO_INCREMENT ,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE employeeTable
  ADD FOREIGN KEY (manager_id) REFERENCES employeeTable(id),
  ADD FOREIGN KEY  (role_id) REFERENCES roleTable(id);
 


CREATE TABLE roleTable (
  id INT NOT NULL AUTO_INCREMENT ,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(6,2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (ID)
);

ALTER TABLE roleTable
  ADD FOREIGN KEY (department_id) REFERENCES department(id)



CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT ,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

 select * from employeetable e
 inner join roletable r on e.role_id = r.id;
 
 select e.first_name, e.last_name, r.title, r.salary, d.name, e.manager_id from employeetable e join roletable r on e.role_id = r.id
 join department d on r.department_id = d.id;
 
 INSERT INTO employeetable (first_name, last_name, role_id, manager_id)
 Values ("Bob", "Johnson", 3, 1)