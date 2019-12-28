var express = require("express");
var router = express.Router();

var mypageController = require("../controller/mypageController.js");

router.get("/info", mypageController.getMypage);
router.put("/info", mypageController.putMypage);

module.exports = router;
