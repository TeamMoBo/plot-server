var express = require("express");
var router = express.Router();

var ticketController = require("../controller/ticketController.js");

router.get("/", ticketController.getMypage);
router.post("/buy", ticketController.putMypage);

module.exports = router;
