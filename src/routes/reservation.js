var express = require("express");
var router = express.Router();

var reservationController = require("../controller/reservationController.js");

router.get("/delete/:userIdx", reservationController.deleteReservation);

module.exports = router;