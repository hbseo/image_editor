const jwt = require("jsonwebtoken");
const database = require('../../../database/index');
const secretObj = require('../../../config/jwt');
const crypto = require('crypto');
const moment = require('moment');

exports.dupCheck = (req, res) => {
  const {id} = req.body;
  let query = `SELECT EXISTS (SELECT * FROM USERS WHERE userid = "${id}") as success`;

  const respond = (result) => {
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
  }

  const onError = (error) => {
    res.status(400).json({
      msg: error.message
    })
  }

  database.query(query)
  .then(respond)
  .catch(onError)
}

exports.login = (req, res) => {
  const { id, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let date = moment().format('YYYY-MM-DD HH:mm:ss');
  let query = `SELECT password, salt FROM USERS WHERE userid = "${id}";`;
  let query2 = `UPDATE USERS SET login_date = "${date}" WHERE userid = "${id}";`;

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
            expiresIn: '1h'
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
    res.cookie('token', token, {maxAge: 1000*60*60});
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
  const { id, password } = req.body
  let salt = crypto.randomBytes(64).toString('base64');
  let hashPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('base64');
  let date = moment().format('YYYY-MM-DD HH:mm:ss');
  let query = `INSERT INTO USERS (userid, password, salt, create_date) VALUES ("${id}", "${hashPassword}", "${salt}", "${date}")`;

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