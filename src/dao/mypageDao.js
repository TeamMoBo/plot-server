const mysql = require("../library/mysql");

async function selectMypage() {
  const selectSql = "SELECT * from user WHERE userIdx= ?";
  const values = [1]; //[mypageData.idx];
  return await mysql.query(selectSql, values);
}

async function changeMypage() {
  const changeSql =
    "UPDATE user SET HashTag=?,  NickName=?, ProfileImg=?, TicketNum=?, PopcornNum=?, Age=?, School=?, Major=?, Region=?, Name=?, Id=?, Password=?, Sex=?, AgeStart=?, ageEnd=? WHERE userIdx= ?";
  const values = [
    post.HashTag,
    post.NickName,
    post.ProfileImg,
    post.TicketNum,
    post.PopcornNum,
    post.Age,
    post.School,
    post.Major,
    post.Region,
    post.Name,
    post.Id,
    post.Password,
    post.Sex,
    post.AgeStart,
    post.ageEnd
  ]; //[1]; //[mypageData.idx];
  return await mysql.query(changeSql, values);
}

module.exports = {
  selectMypage,
  changeMypage
};
