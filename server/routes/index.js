const router = require('express').Router();

router.use('/auth', require('./api/auth/index'));

module.exports = router