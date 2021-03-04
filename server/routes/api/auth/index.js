const router = require('express').Router();
const authMiddleware = require('../../../middlewares/auth');
const controller = require('./controller');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/dupCheck', controller.dupCheck);
router.post('/findPassword', controller.findPassword);

router.use('/check', authMiddleware);
router.use('/logout', authMiddleware);
router.use('/changeUserPassword', authMiddleware);
router.use('/withdraw', authMiddleware);
router.post('/logout', controller.logout);
router.get('/check', controller.check);
router.post('/changeUserPassword', controller.changeUserPassword);
router.post('/withdraw', controller.delete);

module.exports = router;