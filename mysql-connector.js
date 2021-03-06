const mysql = require('mysql');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'red',
  timezone: 'KST',
});

db.query('select ? as ?', [12345, 'abcdef'], function (error, rows) {
  console.log(error);
  console.log(rows);
});

db.error = function (request, response, error) {
  console.error('Start: SQL error');
  console.error(error.sql);
  console.error('End: SQL error');
  // error.sql = undefined;
  response.status(500).send(error);
  return false;
};

module.exports = db;
