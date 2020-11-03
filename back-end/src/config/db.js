const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "matcha",
  multipleStatements: true,
});

connection.connect(function (error) {
  if (!!error) {
    console.log("connexion failed");
  } else {
    console.log("connexion success");
  }
});

module.exports = connection;
