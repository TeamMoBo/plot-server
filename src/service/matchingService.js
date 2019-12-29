const moment = require('moment');

const { verify } = require('../library/jwt');
const gcp = require('../gcp/gcp');

const matchingDao = require("../dao/matchingDao");
const movieReservationDao = require("../dao/movieReservationDao");
const userDao = require("../dao/userDao");
const hashTagDao = require("../dao/hashtagDao");
const chatRoomDao = require("../dao/chatRoomDao");

/**
 * 매칭 페이지
 * 
 * @param  token 유저 토큰 
 */
function findOpponentIdx(matchingArr, userIdx) {
    let opponentIdx;
    if(matchingArr[0].userLeftIdx == userIdx) {
            opponentIdx = matchingArr[0].userRightIdx;
    } else if (matchingArr[0].userRightIdx == userIdx) {
            opponentIdx = matchingArr[0].userLeftIdx;
    }

    return opponentIdx;
}

async function getMatching(token) {
    const userIdx = verify(token).idx;
    const userData = await userDao.selectUserByIdx(userIdx);
    if(userData.length == 0) {
        return -2;
    }
    const userMatchingData = await matchingDao.selectMatchingByUseridx(userIdx); //시간대 + 상태 확인 안함
    if(userMatchingData.length == 0) {
        return -1;
    }
    const opponentUserIdx = findOpponentIdx(userMatchingData, userIdx);
    const opponentUserData = await userDao.selectUserByIdx(opponentUserIdx);
    const meetingStatus = await movieReservationDao.selectMovieReservationByMatchingidx(userMatchingData[0].matchingIdx);
    
    const genreTag = await hashTagDao.selectGenreTagByUseridx(userIdx);
    const genreTagContent = genreTag.map((data) => {
        return data['preferGenreTagName'];
    })
    const charmingTag = await hashTagDao.selectCharmingTagByUseridx(userIdx);
    const charmingTagContent = charmingTag.map((data) => {
        return data['attractPointTagName'];
    })
    const favorTag = await hashTagDao.selectFavorTagByUserIdx(userIdx);
    const favorTagContent = favorTag.map((data) => {
        return data.favorTagName;
    })
    const movieInfoText = String(moment(meetingStatus[0].movieDate).format('YYYY-MM-DD')) + " " + meetingStatus[0].movieTime + " \n " + 
    meetingStatus[0].moviePlace + " \n " + meetingStatus[0].movieSeat;
    
    let parsingUser = {
        name : opponentUserData[0].userName,
        img : opponentUserData[0].userImg,
        age : opponentUserData[0].userAge,
        school : opponentUserData[0].userSchool,
        major : opponentUserData[0].userMajor,
        location : opponentUserData[0].userLocation,
        genreHash : genreTagContent,
        charmingHash : charmingTagContent,
        favorHash : favorTagContent,
        moiveInfo : movieInfoText   
    }

    return parsingUser;
}

async function postMatchingConfirm(token, reply) {
    const userIdx = verify(token).idx;
    const userData = await userDao.selectUserByIdx(userIdx);
    if(userData.length == 0) {
        return -2;
    }
    
    const userMatchingData = await matchingDao.selectMatchingByUseridx(userIdx); //시간대 + 상태 확인 안
    let matchingIdx = userMatchingData[0].matchingIdx;
    
    if(userMatchingData[0].matchingLeftState == userIdx) {
        if(reply == true) {
            await matchingDao.updateLeftStateByMatchingIdx(matchingIdx, 2);
            return 1;
        } else {
            await matchingDao.updateLeftStateByMatchingIdx(matchingIdx, 0);
            return -1;
        }     
    } else {
        if(reply == true) {
            await matchingDao.updateRightStateByMatchingIdx(matchingIdx, 2);
            return 1;
        } else {
            await matchingDao.updateRightStateByMatchingIdx(matchingIdx, 0);
            return -1;
        }
    }    
}

async function postMatchingDecision(token, decision) {
    const userIdx = verify(token).idx;
    const userData = await userDao.selectUserByIdx(userIdx);
    if(userData.length == 0) {
        return -2;
    }

    const userMatchingData = await matchingDao.selectMatchingByUseridx(userIdx); //시간대 + 상태 확인 안
    let matchingIdx = userMatchingData[0].matchingIdx;
    
    if(userMatchingData[0].matchingLeftState == userIdx) {
        if(decision == true) {
            await matchingDao.updateLeftStateByMatchingIdx(matchingIdx, 3);
            return 1;
        } else {
            await matchingDao.updateLeftStateByMatchingIdx(matchingIdx, 0);
            return -1;
        }     
    } else {
        if(decision == true) {
            await matchingDao.updateRightStateByMatchingIdx(matchingIdx, 3);
            return 1;
        } else {
            await matchingDao.updateRightStateByMatchingIdx(matchingIdx, 0);
            return -1;
        }
    }

}

async function getMatchingAddress(token) {
    const verifyToken = verify(token);
    if(verifyToken < 0) {
        return -1;
    } 

    const matchingData = await matchingDao.selectMatchingByUseridx(verifyToken.idx);
    let chatRoomData = await chatRoomDao.selectChatRoomByMatchingIdx(matchingData[0].matchingIdx);

    if(chatRoomData.length == 0) {
        const chatRoomId = await gcp.makeChatRoom(matchingData[0].userLeftIdx, matchingData[0].userRightIdx);
        const insertResult = await chatRoomDao.insertChatRoom(chatRoomId, matchingData[0].matchingIdx);
        chatRoomData = await chatRoomDao.selectChatRoomByMatchingIdx(insertResult.insertId);
    }
    const uid = await gcp.insertFbUser(verifyToken.idx);
    return {
        address : chatRoomData[0].chatRoomId,
        uid : uid
    }
}


module.exports = {
    getMatching,
    postMatchingConfirm,
    postMatchingDecision,
    getMatchingAddress
}