const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");
const paymentService = require("../service/paymentService");
const { verify } = require("../library/jwt");

// 보유티켓 감소 ( -1 )
async function postPay(req, res) {
  try {
    const token = req.headers.authorization;
    const decoded = verify(token);

    if (decoded < -1) {
      console.log("토큰 오류");
      errResponse(res, returnCode.UNAUTHORIZED, "토큰 오류");
    }

    const userIdx = decoded.idx;
    const userPayData = req.body;
    //console.log("페이 데이터" + userPayData);
    const payData = await paymentService.postPay(userIdx, userPayData);

    if (!payData) {
      console.log("존재하지 않는 파라미터");
      errResponse(res, returnCode.BAD_REQUEST, "존재하지 않는 파라미터");
    }

    console.log("결제 상태 호출");
    response(res, returnCode.OK, "결제 상태 호출 성공");
  } catch (error) {
    console.log(error.message);
    errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
}

module.exports = {
  postPay
};
