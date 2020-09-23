const router = require('express').Router()
const controller = require('./auth.controller')
const authMiddleware = require('../../middlewares/auth')

router.post('/auth/login', controller.login);
router.post('/auth/register', controller.register)
router.use('/auth/check', authMiddleware);
router.get('/auth/check', controller.check)

module.exports = router