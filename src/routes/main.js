var express = require('express');
var router = express.Router();

var mainController = require('../controller/mainController.js')

router.get('/', mainController.getMain);    // 메인
// router.get('/:section', mainController.getMain);    // 메인
// 0: 랜덤 1:예약영화 2:예약시간

module.exports = router;
