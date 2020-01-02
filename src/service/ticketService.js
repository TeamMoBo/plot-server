const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");
const mypageDao = require("../dao/mypageDao");

async function getTicket(userIdx) {
  const ticketData = await mypageDao.selectTicket(userIdx);
  //console.log("data[0]" + ticketData[0]);

  const ticketAll = {
    userTicket: 0,
    userPopcorn: 0
  };

  ticketAll.userTicket = ticketData[0].userTicket;
  ticketAll.userPopcorn = ticketData[0].userPopcorn;
  //return ticketData[0];
  return ticketAll;
}

async function putTicket(userIdx, body) {
  //1. db값 받아오기 - 2. 사용자 값 받아오기 - 3. db값 + 사용자값 -> db에 넣기
  //Dao UPDATE 안에서 모두 해결
  const ticketPutData = await mypageDao.updateTicket(userIdx, body);
  console.log("수정 ticket 부분");
  return ticketPutData;
}

module.exports = {
  getTicket,
  putTicket
};
