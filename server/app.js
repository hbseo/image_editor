require('dotenv').config();// dependencies
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
// load configuration
const port = process.env.PORT || 8000;
const config = require('./config/jwt')

// express configuration
const app = express();

// cross domain
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

// parse
app.use(bodyParser.json({ limit : "50mb" }));
app.use(bodyParser.urlencoded({ limit:"50mb", extended: true}));
app.use(cookieParser());

// print the request log on console
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '../build')))
// app.get('*', (req,res) => {
//     res.sendFile(path.join(__dirname, '../build/index.html'))
// })
// app.post('*', (req,res) => {
//     res.sendFile(path.join(__dirname, '../build/index.html'))
// })
// set the secret key variable for jwt
app.set('jwt-secret', config.secret);

// const options = { etag: false };
// app.use(express.static("public", options));

// router
// app.use((req, res, next) => {
//     res.status(404).send('NOT FOUND');
// })
// app.use((err, req, res, next) => {
//     console.log(err.stack)
//     res.status(500).send('Server ERR');
// })

app.use('/', require('./routes/index'));


// var host = process.env.HOST || '127.0.0.1';
// var cors_proxy = require('cors-anywhere');
// cors_proxy.createServer({
//     originWhitelist: [], // Allow all origins
//     requireHeader: ['origin', 'x-requested-with'],
//     removeHeaders: ['cookie', 'cookie2']
// }).listen(port, host, function() {
//     console.log('Running CORS Anywhere on ' + host + ':' + port);
// });

// open server
app.listen(port, () => {
    console.log(`express is running on ${port}`);
})


// connection.end();