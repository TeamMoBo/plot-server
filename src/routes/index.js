var express = require("express");
var router = express.Router();

router.use("/user", require("./user"));
router.use("/mypage", require("./mypage"));
router.use("/matching", require("./matching"))
router.use('/main', require('./main'));
router.use('/movie', require('./movie'));

module.exports = router;
