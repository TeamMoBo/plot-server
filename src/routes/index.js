var express = require("express");
var router = express.Router();

router.use("/user", require("./user"));
router.use("/mypage", require("./mypage"));
router.use("/matching", require("./matching"));
router.use("/movie", require("./movie"));
router.use("/main", require("./main"));
router.use("/payment", require("./payment"));
router.use("/reservation", require("./reservation"));

module.exports = router;
