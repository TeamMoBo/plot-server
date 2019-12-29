const encryption = require("../library/encryption");
const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");
const mypageDao = require("../dao/mypageDao");

async function getTicket(userIdx) {
  const ticketData = await mypageDao.selectTicket(userIdx);
  console.log("data[0]" + ticketData[0]);

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
  const ticketPutData = await mypageDao.updateTicket(userIdx, body);
  return ticketPutData;
}

module.exports = {
  getTicket,
  putTicket
};
