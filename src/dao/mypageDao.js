const mysql = require("../library/mysql");
const column = require("../library/userColumn");

async function selectMypage(userIdx) {
  const selectSql =
    "SELECT userName, userNickname, userAge, userComment, userImg, userId, userLocation, userSelectGender, userSelectMinAge, userSelectMaxAge, userSchool, userMajor, userKakao from user WHERE userIdx = ?";
  //console.log("userIdx는 " + userIdx);
  return await mysql.query(selectSql, [userIdx]);
}

async function updateMypage(userIdx, userData) {
  const editSql =
    "UPDATE user SET userName=?, userNickname=?, userAge=?, userComment=?, userLocation=?, userSelectGender=?, userSelectMinAge=?, userSelectMaxAge=?, userSchool=?, userMajor=?, userKakao=? WHERE userIdx= ?";
  return await mysql.query(editSql, [
    userData.userName,
    userData.userNickname,
    userData.userAge,
    userData.userComment,
    userData.userLocation,
    userData.userSelectGender,
    userData.userSelectMinAge,
    userData.userSelectMaxAge,
    userData.userSchool,
    userData.userMajor,
    userData.userKakao,
    userIdx
  ]);
}

async function updatePhotoMypage(userIdx, userPhotoData) {
  const editSql = "UPDATE user SET userImg=? WHERE userIdx=?";
  return await mysql.query(editSql, [userPhotoData, userIdx]);
}

async function selectTicket(userIdx) {
  const selectSql =
    //"SELECT userTicket, userPopcorn from user WHERE userIdx = ?";
    "SELECT * from user WHERE userIdx = ?";
  return await mysql.query(selectSql, [userIdx]);
}

async function updateTicket(userIdx, userTicketData) {
  //console.log(userTicketData.userTicket);
  const editSql =
    "UPDATE user SET userTicket = userTicket + ?, userPopcorn= userPopcorn + ? WHERE userIdx = ?";

  return await mysql.query(editSql, [
    userTicketData.userTicket,
    userTicketData.userPopcorn,
    userIdx
  ]);
}

async function postPay(userIdx, paymentData) {
  //console.log(paymentData.userTicket);
  const updateSql =
    "UPDATE user SET userTicket = userTicket - ?, userPopcorn = userPopcorn - ? WHERE userIdx = ?";
  return await mysql.query(updateSql, [
    paymentData.userTicket,
    paymentData.userPopcorn,
    userIdx
  ]);
}

module.exports = {
  selectMypage,
  updateMypage,
  updatePhotoMypage,
  selectTicket,
  updateTicket,
  postPay
};
