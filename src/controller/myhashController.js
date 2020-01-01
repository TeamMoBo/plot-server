const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");
const myhashService = require("../service/myhashService");
const { verify } = require("../library/jwt");

// 마이페이지 - 해시태그 정보 받기
async function getHash(req, res) {
  try {
    const hash = await myhashService.getHash(req.headers.authorization);
    console.log(hash);
    response(res, returnCode.OK, "해시태그 받기 성공", hash);
  } catch (error) {
    console.log(error.message);
    errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
}

// 마이페이지 - 해시태그 정보 수정 ( 미완 )
async function putHash(req, res) {
  try {
    const token = req.headers.authorization;
    const decoded = verify(token);
    const userIdx = decoded.idx;
    const userData = req.body;

    const userHash = await myhashService.putHash(userIdx, userData);
    if (decoded < -1) {
      console.log("토큰 오류");
      errResponse(res, returnCode.UNAUTHORIZED, "토큰 오류");
    }
    if (!userData) {
      console.log("존재하지 않는 파라미터");
      errResponse(res, returnCode.BAD_REQUEST, "존재하지 않는 파라미터");
    }
    console.log("해시태그 수정 성공");
    response(res, returnCode.OK, "해시태그 수정 성공");
  } catch (error) {
    console.log(err.message);
    errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
}

module.exports = {
  getHash,
  putHash
};
