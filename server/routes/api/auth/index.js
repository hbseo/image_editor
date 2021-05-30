const router = require('express').Router();
const authMiddleware = require('../../../middlewares/auth');
const controller = require('./controller');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/dupCheck', controller.dupCheck);
router.post('/findPassword', controller.findPassword);


//require sign
router.use('/check', authMiddleware);
router.get('/check', controller.check);

router.use('/logout', authMiddleware);
router.post('/logout', controller.logout);

router.use('/changeUserPassword', authMiddleware);
router.post('/changeUserPassword', controller.changeUserPassword);

router.use('/withdraw', authMiddleware);
router.post('/withdraw', controller.delete);

module.exports = router;