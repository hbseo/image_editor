const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next) => {
    // console.log(req.cookies)
    const token = req.cookies.user || req.headers['x-access-token']  || ''
    if(!token) {
        return res.status(403).json({
            success : false,
            message : 'not login'
        })
    }

    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('jwt-secret'), (err,decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    const onError = (error) => {
        res.status(403).json({
            success : false,
            message : error.message,
        })
    }

    p.then((decoded) => {
        req.decoded = decoded
        next()
    }).catch(onError)
}

module.exports = authMiddleware