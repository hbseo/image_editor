// import config from '../config/database.config'
const config = require('../config/database.config')
const mysql = require("mysql");
class Database {
    constructor(config) {
        console.log(config)
        this.connection = mysql.createConnection(config);
    }

    query(sql, args){
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
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

