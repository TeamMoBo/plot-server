const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");
const { verify } = require("../library/jwt");
const mypageDao = require("../dao/mypageDao");

async function getMypage(token) {
  const userIdx = verify(token).idx;
  const mypageData = await mypageDao.selectMypage(userIdx);
  console.log("리턴 mypageData[0] 부분");
  return mypageData[0];
}

async function putMypage(userIdx, body) {
  // const userIdx = verify(token).idx;
  const mypageEdit = await mypageDao.updateMypage(userIdx, body);
  console.log("-----------------------------------------------");
  console.log("수정 mypageEdit 부분");
  return mypageEdit;
}

async function putPhotoMypage(userIdx, body) {
  const photoMypageEdit = await mypageDao.updatePhotoMypage(userIdx, body);
  console.log("-----------------------------------------------");
  console.log("수정 photoMypageEdit 부분");
  return photoMypageEdit;
}

module.exports = {
  getMypage,
  putMypage,
  putPhotoMypage
};
