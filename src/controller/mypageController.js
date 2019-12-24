/*
받은 거 처리
원래) 라우터 를 통해서 응답하는 내용
*/

const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");

const mypageService = require("../service/mypageService");

async function getMypage(req, res) {
  try {
    const mypage = await mypageService.getMypage(req.headers);
    console.log(mypage);
    response(res, returnCode.OK, "마이페이지 테스트 성공", mypage);
  } catch (error) {
    console.log(error.message);
    errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
}

module.exports = {
  getMypage
};
