const mysql = require('mysql');
const inquirer = require('inquirer');

const runSearch = () => {
    inquirer
      .prompt({
        name: 'start',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View All Employees',
          'View All Employees by Department',
          'View All Employees by Manager',
          'Add Employee',
          'Add Department',
          'Add Role',
          'Update Employee Role',
        ],
      })
      .then((answer) => {
        switch (answer.action) {
          case 'Find songs by artist':
            artistSearch();
            break;
  
          case 'Find all artists who appear more than once':
            multiSearch();
            break;
  
          case 'Find data within a specific range':
            rangeSearch();
            break;
  
          case 'Search for a specific song':
            songSearch();
            break;
  
          case 'Find artists with a top song and top album in the same year':
            songAndAlbumSearch();
            break;
  
          default:
            console.log(`Invalid action: ${answer.action}`);
            break;
        }
      });
  };