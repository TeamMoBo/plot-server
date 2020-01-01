var express = require("express");
var router = express.Router();

var paymentController = require("../controller/paymentController.js");

router.post("/", paymentController.postPay);

module.exports = router;
