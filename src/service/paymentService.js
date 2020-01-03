const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");
const mypageDao = require("../dao/mypageDao");

async function postPay(userIdx, body) {
  //   const payAll = {
  //     userTicket: 0,
  //     userPopcorn: 0
  //   };

  const ticketData = await mypageDao.selectTicket(userIdx);
  const ticketAll = {
    userTicket: 0,
    userPopcorn: 0
  };
  ticketAll.userTicket = ticketData[0].userTicket;
  ticketAll.userPopcorn = ticketData[0].userPopcorn;

  const paymentData = await mypageDao.postPay(userIdx, body);

  console.log("사용자 결제 부분");

  //   payAll.userTicket = paymentData[0].userTicket;
  //   payAll.userPopcorn = paymentData[0].userPopcorn;
  //   return payAll;
  // Dao 에서 column 선택해서 값이 계산되므로, 요기서 따로 지정해줄 필요 없음
  return paymentData;
}

module.exports = { postPay };
