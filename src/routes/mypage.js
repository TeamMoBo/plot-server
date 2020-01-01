var express = require("express");
var router = express.Router();

var mypageController = require("../controller/mypageController.js");
var ticketController = require("../controller/ticketController.js");
var myhashController = require("../controller/myhashController.js");

const upload = require("../../config/multer.js");

router.get("/info", mypageController.getMypage);
router.put("/info", mypageController.putMypage);
router.put(
  "/info/photo",
  upload.single("userImg"),
  mypageController.putPhotoMypage
);
router.get("/ticket", ticketController.getTicket);
router.put("/ticket", ticketController.putTicket);
router.get("/info/hashtag", myhashController.getHash);
router.put("/info/hashtag", myhashController.putHash);

module.exports = router;
