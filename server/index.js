

const express = require('express');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser');
const port =process.env.PORT || 8000;
const config = require('../config/auth')
const cookieParser = require('cookie-parser')

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.set('jwt-secret', config.secret);

app.use('/api', require('../routes/api'))


const server = app.listen(port, ()=>{
    console.log(`express is running on ${port}`);
})


// connection.end();