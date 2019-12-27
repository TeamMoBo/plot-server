const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");
const { verify } = require("../library/jwt");
const mypageDao = require("../dao/mypageDao");

async function getMypage(token) {
  const userIdx = verify(token).idx;
  const mypageData = await mypageDao.selectMypage(userIdx);
  return mypageData[0];
}

async function putMypage(token, body) {
  const userIdx = verify(token).idx;
  const mypageEdit = await mypageDao.updateMypage(userIdx, body);
  return mypageEdit;
}

module.exports = {
  getMypage,
  putMypage
};
