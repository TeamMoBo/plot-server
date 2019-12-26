/*
케이스 나눠 줌. 컨트롤러로 보냄
*/
const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");
const { verify } = require("../library/jwt");
const mypageDao = require("../dao/mypageDao");

async function getMypage(token) {
  //const mypageData = "데이터";
  const userIdx = verify(token).idx;
  const mypageData = await mypageDao.selectMypage(userIdx);
  return mypageData[0];
}

async function putMypage(token, body) {
  const userIdx = verify(token).idx;
  // const mypageData = await mypageDao.selectMypage(userIdx);
  // if (mypageData.length == 0) {
  //   console.log(error.message);
  //   errResponse(res, returnCode.UNAUTHORIZED, "마이페이지 토큰 오류");
  // } else {
  const mypageEdit = await mypageDao.updateMypage(userIdx, body);
  return mypageEdit;
  // }
}

module.exports = {
  getMypage,
  putMypage
};
