const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
  }
  // host: 'localhost',

  // // Your port, if not 3306
  // port: 3306,

  // // Your username
  // user: 'root',

  // // Be sure to update with your own MySQL password!
  // password: '',
  // database: 'ice_creamDB',
);

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  connection.end();
});