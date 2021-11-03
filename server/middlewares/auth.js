const jwt = require('jsonwebtoken');
const secretObj = require('../config/jwt');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers['x-access-token'] || ''
  if (!token) {
    return res.status(401).json({
      success: false,
      msg: 'not login'
    })
  }

  const decodeToken = () => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretObj.secret, (error, decoded) => {
        if (error) reject(error);
        resolve(decoded);
      });
    });
  }

  const onError = (error) => {
    res.status(401).json({
      success: false,
      msg: error.message,
    })
  }

  decodeToken()
  .then((decoded) => {
    req.decoded = decoded;
    next()
  }).catch(onError)
}

module.exports = authMiddleware
