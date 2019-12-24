/*
케이스 나눠 줌. 컨트롤러로 보냄
*/

const mypageDao = require("../dao/mypageDao");

async function getMypage() {
  const mypageData = await mypageDao.selectMypage();
  //const mypageData = "데이터";

  return mypageData;
}

module.exports = {
  getMypage
};
