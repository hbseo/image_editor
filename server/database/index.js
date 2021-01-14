const config = require('../config/db-config.json');
const mysql = require("mysql");

class Database {
  constructor() {
    this.connection = mysql.createConnection(config);
  }

  query(sql,args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (error, result, fields) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}

module.exports = Database;

