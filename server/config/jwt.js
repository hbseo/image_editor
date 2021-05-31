require('dotenv').config();
let jwtObj = {};
jwtObj.secret = process.env.REACT_APP_JWT_SECRET_KEY
module.exports = jwtObj;