var express = require('express');
var router = express.Router();

var movieController = require('../controller/movieController.js')

router.get('/:movieReleaseStatus', movieController.getOrderMovie);    // 예매율 TOP10 영화조회(현재상영작,개봉예정작)
router.get('/', movieController.getReserveMovie);    // 영화 조회
router.post('/', movieController.postMovie);    // 영화 선택
router.put('/', movieController.putMovie); // 영화 수정

module.exports = router;
