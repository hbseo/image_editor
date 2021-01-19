const router = require('express').Router();
const controller = require('./controller');

router.post('/save', controller.save)

module.exports = router;