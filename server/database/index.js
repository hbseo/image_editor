const mysql = require("mysql");
require('dotenv').config();
const config = {
  "host"     : "localhost",
  "user"     : process.env.SESSION_DB_USER,
  "password" : process.env.SESSION_DB_PW,
  "database" : process.env.SESSION_DB_NAME,
  "connectionLimit": 30
}
class Database {
  constructor() {
    this.connection = mysql.createConnection(config);
  }

  query = (sql,args) => {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (error, result, fields) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  end = () => {
    return new Promise((resolve, reject) => {
      this.connection.end(error => {
        if (error) return reject(error);
        resolve();
      });
    })
  }
}

class Pool {
  constructor(){
    this.pool = mysql.createPool(config);
  }

  connect = () => {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) reject(err);
        // console.log("MySQL pool connected: threadId " + connection.threadId);
        resolve(connection);
      });
    });
  }

  query = (connection, sql) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, (err, result) => {
        if (err) reject(err);
        resolve({connection, result});
      });
    });
  }

  release = (connection) => {
    return new Promise((resolve, reject) => {
      // if (err) reject(err);
      // console.log("MySQL pool released: threadId " + connection.threadId);
      resolve(connection.release());
    });
  }
}

class Connection {
  constructor() {
    this.connetion = mysql.createPool(config).getConnection();
  }
}












const pool = new Pool();

module.exports = {
  Database,
  pool
}