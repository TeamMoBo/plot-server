var express = require('express');
var router = express.Router();

var userController = require('../controller/UserController.js')

router.post('/', userController.postUser);

module.exports = router;
