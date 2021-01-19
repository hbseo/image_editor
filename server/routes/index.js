const router = require('express').Router();

router.use('/auth', require('./api/auth/index'));
router.use('/content', require('./api/content/index'));
module.exports = router