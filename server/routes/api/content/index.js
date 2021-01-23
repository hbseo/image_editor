const router = require('express').Router();
const controller = require('./controller');

router.post('/save', controller.save)
router.post('/get', controller.get)
router.post('/update', controller.update)

module.exports = router;