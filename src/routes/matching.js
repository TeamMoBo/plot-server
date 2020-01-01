var express = require('express');
var router = express.Router();
var moment = require('moment');

var matchingController = require("../controller/matchingController");

router.get("/", matchingController.getMatching);

router.post("/confirm", matchingController.postMatchingConfirm);
router.post("/decision", matchingController.postMatchingDecision);
router.get("/address", matchingController.getMatchingAddress);

router.get("/algorithm", matchingController.matchingAlgorithm);
router.get("/deleteall", matchingController.deleteMatchingAlgorithm);

module.exports = router;

