var express = require('express');
var router = express.Router();

var mainController = require('../controller/mainController.js')

router.get('/', mainController.getMain);    // 메인

module.exports = router;
