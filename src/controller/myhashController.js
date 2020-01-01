const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");
const myhashService = require("../service/myhashService");
const { verify } = require("../library/jwt");

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

async function putHash(req, res) {
  try {
    // const token = req.headers.authorization;
    // const decoded = verify(token);
    // const userIdx = decoded.idx;
    // const userData = req.body;

    const hashResult = await myhashService.putHash(req.headers.authorization, req.body);
    if (hashResult != -1) {
      errResponse(res, returnCode.UNAUTHORIZED, '토큰 오류');
    } else {
      response(res, returnCode.OK, "해시태그 수정 성공");
    }
  } catch (error) {
    console.log(err.message);
    errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
}

module.exports = {
  getHash,
  putHash
};
