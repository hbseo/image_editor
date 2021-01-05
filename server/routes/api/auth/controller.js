const jwt = require("jsonwebtoken");
const database = require('../../../database/index');
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
  const secret = req.app.get('jwt-secret');
  let query = `SELECT EXISTS (SELECT * FROM USERS WHERE userid = "${id}") as success`;

  // const check = (result) => {
  //   if(result[0].success) {
      
  //   }
  //   else {
  //     res.status(200).json({
  //       msg: 'not exist'
  //     })
  //   }
  // }
  // let query = `SELECT * FROM USERS WHERE userid = "${id}" AND  password = "${password}";`;
  // if (id) {
  //   database.connection.query(query, (error, result, fields) => {
  //     if (error) {
  //       console.log(error);
  //     }
  //     console.log(result);
  //   });
  // }

  // const check = (user) => {
  //     if(user.length === 1){
  //         return new Promise((resolve, reject) => {
  //             jwt.sign(
  //                 {
  //                     _id : user.userid,
  //                     email : user.email
  //                 },
  //                 secret,
  //                 {
  //                     expiresIn: '10000'
  //                 }, (err, token) => {
  //                     if (err) reject(err)
  //                     resolve(token)
  //                 }
  //             )
  //         })
  //     } else{
  //         throw new Error('not valid user')
  //     }
  // }

  // const respond = (token) => {
  //     res.cookie('user', token, {maxAge : 10000});
  //     res.json({
  //         message : 'login success',
  //         state : true,
  //         token
  //     })
  // }

  // const onError = (error) => {
  //     res.status(403).json({
  //         message : error.message,
  //         state : false
  //     })
  // }

  // database.query(query)
  //     .then(check)
  //     .then(respond)
  //     .catch(onError)

}

exports.register = (req, res) => {
  const { id, password } = req.body
  let salt = crypto.randomBytes(64).toString('base64');
  let hashPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('base64');
  let query = `INSERT INTO USERS (userid, password, salt) VALUES ("${id}", "${hashPassword}", "${salt}")`;

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