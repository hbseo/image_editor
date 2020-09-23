const jwt = require("jsonwebtoken");
const database = require('../../database/index')

exports.login = (req,res) => {

    let user
    const {id, password} = req.body
    console.log(id, password);
    const secret = req.app.get('jwt-secret')
    let query = "SELECT * FROM USERS WHERE userid = '" + id + "'" + " AND password = '" + password +"';"; 
    // const check = (user) => {
    //     console.log('hello');
    //     if(!user){
    //         throw new Error('login failed')
    //     }
    //     else{
    //         throw new Error('login failed2')
    //     }
    // }
    
    
    const check = (user) => {
        if(user.length == 1){
            return new Promise((resolve, reject) => {
                jwt.sign(
                    {
                        _id : user.userid,
                        email : user.email
                    },
                    secret,
                    {
                        expiresIn: '10000'
                    }, (err, token) => {
                        if (err) reject(err)
                        resolve(token)
                    }
                )
            })
        } else{
            throw new Error('not valid user')
        }
    }

    const respond = (token) => {
        res.cookie('user', token, {maxAge : 10000});
        res.json({
            message : 'login success',
            state : true,
            token
        })
    }

    const onError = (error) => {
        res.status(403).json({
            message : error.message,
            state : false
        })
    }
    
    database.query(query)
        .then(check)
        .then(respond)
        .catch(onError)

}

exports.check = (req, res) => {
    res.json({
        success: true,
        info : req.decoded
    });
}

exports.register = (req,res) => {
    const {id, password, email} = req.body
    
	let newquery = 'insert into users (userid, email, password, create_date, modify_date) values ("' + req.body.id +'", "'+ req.body.email +'", "'+ req.body.password + '", now(), now())';
    let query = "SELECT * FROM USERS WHERE userid = '" + id + "';"; 
    
    const create = (user) => {
        if(user.length >= 1 ){
            throw new Error('userid exists')
        } else {
            let newuser = database.query(newquery)
            return newuser
        }
    }

    // const count = (user) => {
    //     newUser = user
    //     return User.count({}).exec()
    // }

    // // assign admin if count is 1
    // const assign = (count) => {
    //     if(count === 1) {
    //         return newUser.assignAdmin()
    //     } else {
    //         // if not, return a promise that returns false
    //         return Promise.resolve(false)
    //     }
    // }

    const respond = (newuser) => {
        if(newuser){
            console.log('suc')
            res.json({
                message: 'registered successfully',
                newuser
                // admin: isAdmin ? true : false
            })
        } else {
            throw new Error('insert fail')
        }
        
    }

    const onError = (error) => {
        res.status(409).json({
            message: error.message
        })
    }

    database.query(query)
        .then(create)
        .then(respond)
        .catch(onError)
}