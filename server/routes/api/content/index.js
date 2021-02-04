const router = require('express').Router();
const authMiddleware = require('../../../middlewares/auth');
const controller = require('./controller');


router.use('/save', authMiddleware);
router.use('/get', authMiddleware);
router.use('/update', authMiddleware);

router.post('/save', controller.save)
router.post('/get', controller.get)
router.post('/update', controller.update)


module.exports = router;