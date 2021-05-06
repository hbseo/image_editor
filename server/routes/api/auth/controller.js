const jwt = require("jsonwebtoken");
const {Database, pool} = require('../../../database/index');
const secretObj = require('../../../config/jwt');
const crypto = require('crypto');
const moment = require('moment');

exports.dupCheck = (req, res) => {
  // const database = new Database();
  const {id} = req.body;
  let query = `SELECT EXISTS (SELECT * FROM USERS WHERE userid = "${id}") as success`;

  // const respond = (result) => {
  //   if(result[0].success) {
  //     res.status(200).json({
  //       msg: 'exist'
  //     })
  //   }
  //   else {
  //     res.status(200).json({
  //       msg: 'not exist'
  //     })
  //   }
  // }

  const onError = (error) => {
    res.status(400).json({
      msg: error.message
    })
  }

  // database.query(query)
  // .then(respond)
  // .then(database.end())
  // .catch(onError)


  const respond = ({connection, result}) => {
    if(result[0].success) {
      res.status(200).json({
        msg: 'exist'
      })
    }
    else {
      res.status(200).json({
        msg: 'not exist'
      })
    }

    new Promise((resolve) => {
      connection.release();
      resolve();
    })
    .then(() => {
      console.log("MySQL pool released: threadId " + connection.threadId);
    })
  }

  const check = (conn) => {
    pool.query(conn, query)
    .then(respond)
    .catch(onError)
  }

  pool.connect()
  .then(check)
  .catch(onError)

}

exports.login = (req, res) => {
  const database = new Database();
  const { id, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ip);
  let date = moment().format('YYYY-MM-DD HH:mm:ss');
  let query = `SELECT password, salt FROM USERS WHERE userid = "${id}";`;
  let query2 = `UPDATE USERS SET login_date = "${date}" WHERE userid = "${id}";`;
  // , ip = INET_ATON"${ip}"

  const getData = (result) => {
    if(result.length === 1) {
      let dbPassword = result[0].password;
      let salt = result[0].salt;
      return {dbPassword, salt};
    }
    else {
      throw new Error('wrong id');
    }
  }

  const check = (data) => {
    let hashPassword = crypto.pbkdf2Sync(password, data.salt, 100000, 64, 'sha512').toString('base64');
    if(data.dbPassword === hashPassword) {
      return new Promise((resolve, reject) => {
        jwt.sign(
          {
            user_id: id
          },
          secretObj.secret,
          {
            expiresIn: '3h'
          },
          (error, token) => {
            if (error) reject(error);
            else {
              database.query(query2)
              .catch(onError)
              resolve(token);
            }
          }
        )
      })
    }
    else {
      throw new Error('wrong password');
    }
  }

  const respond = (token) => {
    res.cookie('token', token, {maxAge: 1000*60*60*3});
    res.status(200).json({
      msg: 'login success'
    });
  }

  const onError = (error) => {
    res.status(400).json({
      msg: error.message
    })
  }

  database.query(query)
  .then(getData)
  .then(check)
  .then(respond)
  .catch(onError)

}

exports.register = (req, res) => {
  const database = new Database();
  const { id, password, answer, question} = req.body
  let salt = crypto.randomBytes(64).toString('base64');
  let hashPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('base64');
  let date = moment().format('YYYY-MM-DD HH:mm:ss');
  let query = `INSERT INTO USERS (userid, password, salt, question, answer, create_date) VALUES
               ("${id}", "${hashPassword}", "${salt}", "${question}", "${answer}", "${date}")`;
               
  const respond = (result) => {
    res.status(200).json({
      msg: 'success'
    })
  }

  const onError = (error) => {
    res.status(400).json({
      msg: error.message
    })
  }

  database.query(query)
  .then(respond)
  .then(database.end())
  .catch(onError)
}

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
  })
}

exports.check = (req, res) => {
  res.status(200).json({
    success: true,
    info: req.decoded
  })
}

exports.changeUserPassword = (req, res) => {
  const database = new Database();
  const {id, current_password, new_password} = req.body;
  let query1 = `SELECT password, salt FROM USERS WHERE userid = "${id}";`;

  const getData = (result) => {
    if(result.length === 1) {
      let dbPassword = result[0].password;
      let salt = result[0].salt;
      return {dbPassword, salt};
    }
    else {
      throw new Error();
    }
  }

  const check = (data) => {
    let oldPassword = crypto.pbkdf2Sync(new_password, data.salt, 100000, 64, 'sha512').toString('base64');
    if(data.dbPassword === oldPassword) {
      res.status(200).json({
        msg: 'fail'
      });
      return;
    }
    let hashPassword = crypto.pbkdf2Sync(current_password, data.salt, 100000, 64, 'sha512').toString('base64');
    if(data.dbPassword === hashPassword) {
      let salt = crypto.randomBytes(64).toString('base64');
      let hashPassword2 = crypto.pbkdf2Sync(new_password, salt, 100000, 64, 'sha512').toString('base64');
      let query2 = `UPDATE USERS SET password = "${hashPassword2}", salt = "${salt}" WHERE userid = "${id}";`;
      database.query(query2)
      .then(respond)
      .catch(onError)
    }
    else {
      res.status(200).json({
        msg: 'fail'
      })
    }
    database.end();
  }

  const respond = () => {
    res.status(200).json({
      msg: 'success'
    })
  }

  const onError = (error) => {
    res.status(400).json({
      msg: error.message
    })
  }

  database.query(query1)
  .then(getData)
  .then(check)
  .catch(onError)
}

exports.findPassword = (req, res) => {
  const database = new Database();
  const {id, question, answer} = req.body;
  let query = `SELECT EXISTS (SELECT * FROM USERS WHERE userid="${id}" and question="${question}" and answer="${answer}") as success;`;
  let new_password = Math.random().toString(36).substr(2,11);
  const change = (result) => {
    if(result[0].success) {
      let salt = crypto.randomBytes(64).toString('base64');
      let hashPassword = crypto.pbkdf2Sync(new_password, salt, 100000, 64, 'sha512').toString('base64');
      let update_query = `UPDATE USERS SET password = "${hashPassword}", salt="${salt}" WHERE userid="${id}";`;
      database.query(update_query)
      .then(respond)
      .catch(onError)
    }
    else {
      res.status(200).json({
        msg: 'not match'
      })
    }
  }

  const respond = () => {
    res.status(200).json({
      msg: 'success',
      password: new_password
    })
  }
  
  const onError = (error) => {
    res.status(400).json({
      msg: error.message
    })
  }

  database.query(query)
  .then(change)
  .catch(onError)
}

exports.delete = (req, res) => {
  const database = new Database();
  const {id, password, } = req.body;
  let query1 = `SELECT password, salt FROM USERS WHERE userid = "${id}";`;

  const getData = (result) => {
    if(result.length === 1) {
      let dbPassword = result[0].password;
      let salt = result[0].salt;
      return {dbPassword, salt};
    }
    else {
      throw new Error();
    }
  }

  const check = (data) => {
    let hashPassword = crypto.pbkdf2Sync(password, data.salt, 100000, 64, 'sha512').toString('base64');
    if(data.dbPassword === hashPassword) {
      let query2 = `DELETE FROM USERS WHERE userid="${id}";`;
      database.query(query2)
      .then(respond)
      .catch(onError)
    }
    else {
      res.status(200).json({
        msg: 'fail'
      })
    }
    database.end();
  }

  const respond = () => {
    res.clearCookie('token');
    res.status(200).json({
      msg: 'success'
    })
  }

  const onError = (error) => {
    res.status(400).json({
      msg: error.message
    })
  }

  database.query(query1)
  .then(getData)
  .then(check)
  .catch(onError)
}