const mysql = require("../library/mysql");
const column = require("../library/userColumn");
/**
 * 디비 마이페이지 정보 보여주는 함수
 *
 * @param {*} userIdx 유저 번호
 * @return 마이페이지 텍스트+이미지 정보
 */
async function selectMypage(userIdx) {
  const selectSql =
    "SELECT userName, userNickname, userAge, userComment, userImg, userId, userLocation, userSelectGender, userSelectMinAge, userSelectMaxAge, userSchool, userMajor, userKakao from user WHERE userIdx = ?";
  //console.log("userIdx는 " + userIdx);
  return await mysql.query(selectSql, [userIdx]);
}

/**
 * 디비 마이페이지 정보 수정하는 함수
 *
 * @param {*} userIdx 유저 번호
 * @param {*} userData 유저 body에 들어있는 정보
 * @return 수정된 마이페이지 텍스트 정보
 */
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

/**
 * 디비 마이페이지 사진 정보 수정하는 함수
 *
 * @param {*} userIdx 유저 번호
 * @param {*} userPhotoData 유저 body에 들어있는 정보
 * @return 수정된 마이페이지 사진 정보
 */
async function updatePhotoMypage(userIdx, userPhotoData) {
  const editSql = "UPDATE user SET userImg=? WHERE userIdx=?";
  return await mysql.query(editSql, [userPhotoData, userIdx]);
}

/**
 * 디비 마이페이지 티켓 정보 보여주는 함수
 *
 * @param {*} userIdx 유저 번호
 * @return 티켓 수 정보
 */
async function selectTicket(userIdx) {
  const selectSql =
    //"SELECT userTicket, userPopcorn from user WHERE userIdx = ?";
    "SELECT * from user WHERE userIdx = ?";
  return await mysql.query(selectSql, [userIdx]);
}

/**
 * 디비 마이페이지 티켓 수정하는 함수 (티켓 구매 +1)
 *
 * @param {*} userIdx 유저 번호
 * @param {*} userTicketData 유저 body에 들어있는 정보
 * @return 티켓, 팝콘 수 정보
 */
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

/**
 * 디비 마이페이지 티켓 수정하는 함수 (티켓 감소 -1)
 *
 * @param {*} userIdx 유저 번호
 * @param {*} paymentData 유저 body에 들어있는 정보
 * @return 티켓, 팝콘 수 정보
 */
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
