var express = require('express');
var router = express.Router();

var matchingController = require("../controller/matchingController");

router.get("/", matchingController.getMatching);

module.exports = router;
