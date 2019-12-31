var express = require("express");
var router = express.Router();

router.use("/user", require("./user"));
router.use("/mypage", require("./mypage"));
router.use("/matching", require("./matching"));
// router.use("/ticket", require("./ticket"));
router.use("/movie", require("./movie"));
router.use("/main", require("./main"));

module.exports = router;
