const config = require('../config/db-config.json');
const mysql = require("mysql");

class Database {
  constructor() {
    this.connection = mysql.createConnection(config);
  }

  query(sql) {
    this.connection.connect();
    this.connection.query(sql, (error, result, fields) => {
      if (error) {
        return error;
      }
      else {
        return result;
      }
    })
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

const database = new Database(config);
module.exports = database;

