const mysql = require("../library/mysql");
const column = require("../library/userColumn");

async function selectMypage(userIdx) {
  const selectSql = "SELECT * from user WHERE userIdx = ?";
  console.log(userIdx);
  return await mysql.query(selectSql, [userIdx]);
}

async function updateMypage(userIdx, userData) {
  const {
    userName,
    userNickname,
    userImg,
    userAge,
    userComment,
    userLocation,
    userSelectGender,
    userSelectMinAge,
    userSelectMaxAge,
    userSchool,
    userMajor,
    userKakao
  } = userData;

  const editSql =
    "UPDATE user SET userName=?, userNickname=?, userImg=?, userAge=?, userComment=?, userLocation=?, userSelectGender=?, userSelectMinAge=?, userSelectMaxAge=?, userSchool=?, userMajor=?, userKakao=? WHERE userIdx= ?";
  return await mysql.query(editSql, [
    userName,
    userNickname,
    userImg,
    userAge,
    userComment,
    userLocation,
    userSelectGender,
    userSelectMinAge,
    userSelectMaxAge,
    userSchool,
    userMajor,
    userKakao,
    userIdx
  ]);
}

module.exports = {
  selectMypage,
  updateMypage
};
