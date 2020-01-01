const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");
const mypageService = require("../service/mypageService");
const { verify } = require("../library/jwt");

//마이페이지 텍스트 정보 받기
async function getMypage(req, res) {
  try {
    const mypage = await mypageService.getMypage(req.headers.authorization);
    console.log(mypage);
    response(res, returnCode.OK, "마이페이지 성공", mypage);
  } catch (error) {
    console.log(error.message);
    errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
}

//마이페이지 텍스트 정보 수정
async function putMypage(req, res) {
  try {
    const token = req.headers.authorization;
    const decoded = verify(token);
    const userIdx = decoded.idx;
    const userData = req.body;

    //console.log(userData);
    const mypage = await mypageService.putMypage(userIdx, userData);
    if (decoded < -1) {
      console.log("토큰 오류");
      errResponse(res, returnCode.UNAUTHORIZED, "토큰 오류");
    }
    if (!userData) {
      console.log("존재하지 않는 파라미터");
      errResponse(res, returnCode.BAD_REQUEST, "존재하지 않는 파라미터");
    }

    console.log("마이페이지 수정 상태 호출");
    response(res, returnCode.OK, "마이페이지 수정 성공");
  } catch (error) {
    console.log(error.message);
    errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
}

//마이페이지 사진 정보 수정
async function putPhotoMypage(req, res) {
  try {
    const token = req.headers.authorization;
    const decoded = verify(token);
    const userIdx = decoded.idx;
    const userPhotoData = req.file.location;

    const photoMypage = await mypageService.putPhotoMypage(
      userIdx,
      userPhotoData
    );
    if (decoded < -1) {
      console.log("토큰 오류");
      errResponse(res, returnCode.UNAUTHORIZED, "토큰 오류");
    } else if (!userPhotoData) {
      console.log("존재하지 않는 파라미터");
      errResponse(res, returnCode.BAD_REQUEST, "존재하지 않는 파라미터");
    } else {
      console.log("마이페이지 사진 수정 상태 호출");
      response(res, returnCode.OK, "마이페이지 사진 수정 성공");
    }
  } catch (error) {
    console.log(error.message);
    errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
}

module.exports = {
  getMypage,
  putMypage,
  putPhotoMypage
};
