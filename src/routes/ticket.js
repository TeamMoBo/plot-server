var express = require("express");
var router = express.Router();

var ticketController = require("../controller/ticketController.js");

router.get("/", ticketController.getMypage);
router.put("/", ticketController.putMypage);

module.exports = router;
