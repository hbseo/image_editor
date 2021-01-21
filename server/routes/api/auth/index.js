const router = require('express').Router();
const authMiddleware = require('../../../middlewares/auth');
const controller = require('./controller');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/changeUserPassword', controller.changeUserPassword);
router.post('/dupCheck', controller.dupCheck);

router.use('/check', authMiddleware);
router.use('/logout', authMiddleware);
router.post('/logout', controller.logout);
router.get('/check', controller.check);

module.exports = router;