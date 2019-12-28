const moment = require('moment');

const { verify } = require('../library/jwt');

const matchingDao = require("../dao/matchingDao");
const movieReservationDao = require("../dao/movieReservationDao");
const userDao = require("../dao/userDao");
 

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
    const opponentUserData = await userDao.selectUserByIdx(opponentUserIdx);
    const meetingStatus = await movieReservationDao.selectMovieReservationByMatchingidx(userMatchingData[0].matchingIdx);
    const movieInfoText = String(moment(meetingStatus[0].movieDate).format('YYYY-MM-DD')) + " " + meetingStatus[0].movieTime + " \n " + 
    meetingStatus[0].moviePlace + " \n " + meetingStatus[0].movieSeat;
    
    let parsingUser = {
        name : opponentUserData[0].userName,
        age : opponentUserData[0].userAge,
        school : opponentUserData[0].userSchool,
        major : opponentUserData[0].userMajor,
        location : opponentUserData[0].userLocation,
        // genreHash : 
        moiveInfo : movieInfoText,
        img : opponentUserData[0].userImg,
        ticket : opponentUserData[0].userTicket,
        popcorn : opponentUserData[0].userPopcorn
    }

    return parsingUser;
}

module.exports = {
    getMatching
}