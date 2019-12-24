var express = require("express");
var router = express.Router();

var mypageController = require("../controller/mypageController.js");

router.get("/", mypageController.getMypage);

module.exports = router;
