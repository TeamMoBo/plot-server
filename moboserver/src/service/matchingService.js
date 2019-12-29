const { verify } = require('../library/jwt');

const matchingDao = require("../dao/matchingDao");
const userDao = require("../dao/userDao");
const encryption = require("../library/encryption");
 

/**
 * 매칭 페이지
 * 
 * @param  token 유저 토큰 
 */
function findOpponentIdx(matchingArr, userIdx) {
    let opponentIdx;
    matchingArr.map((data) => {
        if(data.userLeftIdx == userIdx) {
            opponentIdx = data.userRightIdx;
        } else if(data.userRightIdx == userIdx) {
            opponentIdx = data.userLeftIdx;
        }
    })

    return opponentIdx;
}

async function getMatching(token) {
    // const userIdx = verify(token).idx;
    const userIdx = 30;
    const userData = await userDao.selectUserByIdx(userIdx);
    if(userData.length == 0) {
        return -1;
    }
    const userMatchingData = await matchingDao.selectMatchingByUseridx(userIdx); //시간대 + 상태 확인 안함
    if(userMatchingData.length == 0) {
        return -2;
    }
    const opponentUserIdx = findOpponentIdx(userMatchingData, userIdx);
    console.log(opponentUserIdx);
    
    
}

module.exports = {
    getMatching
}