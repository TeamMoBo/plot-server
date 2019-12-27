const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");
const mypageService = require("../service/mypageService");

async function getMypage(req, res) {
  try {
    const mypage = await mypageService.getMypage(req.headers.authorization);
    console.log(mypage);
    response(res, returnCode.OK, "마이페이지 테스트 성공", mypage);
  } catch (error) {
    console.log(error.message);
    errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
}

async function putMypage(req, res) {
  try {
    const mypage = await mypageService.putMypage(
      req.headers.authorization,
      req.body
    );
    if (mypage == -1) {
      console.log("토큰 오류");
      errResponse(res, returnCode.UNAUTHORIZED, "토큰 오류");
    } else if (mypage == -2) {
      console.log("존재하지 않는 파라미터");
      errResponse(res, returnCode.BAD_REQUEST, "존재하지 않는 파라미터");
    } else {
      console.log(mypage);
      console.log("마이페이지 수정 상태 호출");
      response(res, returnCode.OK, "마이페이지 수정 성공", mypage);
    }
  } catch (error) {
    console.log(error.message);
    errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
}

module.exports = {
  getMypage,
  putMypage
};
