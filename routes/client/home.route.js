const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/home.controller")

router.get('/', controller.index);
router.get('/create', controller.create);
router.delete('/delete', controller.delete);

module.exports = router;