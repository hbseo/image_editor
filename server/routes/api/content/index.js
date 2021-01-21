const router = require('express').Router();
const controller = require('./controller');

router.post('/save', controller.save)
router.post('/get', controller.get)

module.exports = router;