var express = require('express');
var router = express.Router();

var upload = require('../../config/multer')
var userController = require('../controller/UserController.js')

router.post('/', userController.postUser);
router.post('/signin', userController.signIn);
router.post('/signup', upload.array('image', 1), userController.signUp);

module.exports = router;
