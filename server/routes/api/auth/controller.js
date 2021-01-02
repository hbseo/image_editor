const jwt = require("jsonwebtoken");
const database = require('../../../database/index')

const moment = require('moment');

exports.dupCheck = (req, res) => {
  const {id} = req.body;
  let query = `SELECT EXISTS (SELECT * FROM USERS WHERE userid = "${id}") as success`;
  if(id) {
    database.connection.query(query, (error, result, fields) => {
      if(error) {
        console.log(error);
      }
      else {
        // already exist
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
    })
  }
}

exports.login = (req, res) => {
  const { id, password } = req.body
  console.log(id, password);
  const secret = req.app.get('jwt-secret')
  let query = `SELECT * FROM USERS WHERE userid = "${id}" AND  password = "${password}";`;

  if (id) {
    database.connection.query(query, (error, result, fields) => {
      if (error) {
        console.log(error);
      }
      console.log(result);
    });
  }

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

exports.check = (req, res) => {
  res.json({
    success: true,
    info: req.decoded
  });
}

exports.register = (req, res) => {
  const { id, password } = req.body

  let query = `INSERT INTO USERS (userid, password) VALUES ("${id}", "${password}")`;

  if(id) {
    database.connection.query(query, (error, result, fields) => {
      if (error) {
        console.log(error);
        res.status(400).json({
          msg: 'error ocurred'
        })
      }
      else {
        res.status(200).json({
          msg: 'success'
        })
      }
    });
  }
}