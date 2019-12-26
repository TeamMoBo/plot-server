var express = require('express');
var router = express.Router();

var userController = require('../controller/UserController.js')

router.post('/', userController.postUser);
router.post('/signin', userController.signIn);
router.post('/signup', userController.signUp);

module.exports = router;
