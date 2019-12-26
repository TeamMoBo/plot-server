const mysql = require("../library/mysql");

async function selectMypage(userIdx) {
  const selectSql = "SELECT * from user WHERE userIdx = ?";
  //const values = //[userIdx]; //[15];
  console.log(userIdx);
  return await mysql.query(selectSql, [userIdx]);
}

async function updateMypage(userIdx, userData) {
  const editSql = "UPDATE user SET userName=? WHERE userIdx= ?";
  //, userNickname=?, userImg=?, userAge=?, userComment=?, userLocation=? WHERE userIdx= ?";
  //HashTag=?,  NickName=?, ProfileImg=?, TicketNum=?, PopcornNum=?, Age=?, School=?, Major=?, Region=?, Name=?, Id=?, Password=?, Sex=?, AgeStart=?, ageEnd=? WHERE userIdx= ?";
  console.log(userIdx);
  return await mysql.query(editSql, [userData.userName, userIdx]);
}

module.exports = {
  selectMypage,
  updateMypage
};
