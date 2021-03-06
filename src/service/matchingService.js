const moment = require('moment');

const { verify } = require('../library/jwt');
const gcp = require('../gcp/gcp');

const matchingDao = require("../dao/matchingDao");
const movieDao = require("../dao/movieDao");
const userDao = require("../dao/userDao");
const hashTagDao = require("../dao/hashtagDao");
const chatRoomDao = require("../dao/chatRoomDao");
const reservationDao = require("../dao/reservationDao");


/**
 * 매칭 페이지
 * 
 * @param  token 유저 토큰 
 */
function findOpponentIdx(matchingRow, userIdx) {
    let opponentIdx;
    if (matchingRow.userLeftIdx == userIdx) {
        opponentIdx = matchingRow.userRightIdx;
    } else if (matchingRow.userRightIdx == userIdx) {
        opponentIdx = matchingRow.userLeftIdx;
    }

    return opponentIdx;
}

async function getMatching(token) {
    //에러 처리
    const userIdx = verify(token).idx;
    const userData = await userDao.selectUserByIdx(userIdx);
    if (userData.length == 0) {
        return -2;
    }
    const userMatchingData = await matchingDao.selectMatchingByUseridx(userIdx, moment().format('YYYY-MM-DD')); //시간대 + 상태 확인 안함
    if (userMatchingData.length == 0) {
        return -1;
    }

    //상대방 정보 받아오기
    const opponentUserIdx = findOpponentIdx(userMatchingData[0], userIdx);
    console.log(opponentUserIdx);
    const opponentUserData = await userDao.selectUserByIdx(opponentUserIdx);

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
    const movieInfoText = await movieDao.selectMovieNameByMovieIdx(userMatchingData[0].movieIdx, moment().format('YYYY-MM-DD'));

    console.log(opponentUserData[0]);

    let parsingUser = {
        name: opponentUserData[0].userName,
        img: opponentUserData[0].userImg,
        age: opponentUserData[0].userAge,
        school: opponentUserData[0].userSchool,
        major: opponentUserData[0].userMajor,
        location: opponentUserData[0].userLocation,
        genreHash: genreTagContent,
        charmingHash: charmingTagContent,
        favorHash: favorTagContent,
        moiveInfo: movieInfoText[0]
    }

    return parsingUser;
}

async function postMatchingConfirm(token, reply) {
    const userIdx = verify(token).idx;
    const userData = await userDao.selectUserByIdx(userIdx);
    if (userData.length == 0) {
        return -2;
    }
    if (reply == undefined) {
        return -4;
    }

    const userMatchingData = await matchingDao.selectMatchingByUseridx(userIdx, moment().format('YYYY-MM-DD')); //시간대 + 상태 확인 안

    if(userMatchingData == 0){
        return -5;
    }

    let matchingIdx = userMatchingData[0].matchingIdx;
    console.log(userMatchingData[0]);
    if (userMatchingData[0].userLeftIdx == userIdx) {
        if (reply == true) {
            await matchingDao.updateLeftStateByMatchingIdx(matchingIdx, 2);
            return 1;
        } else {
            await matchingDao.updateLeftStateByMatchingIdx(matchingIdx, 0);
            return -1;
        }
    } else {
        if (reply == true) {
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
    if (userData.length == 0) {
        return -2;
    }
    if (decision == undefined) {
        return -4;
    }

    const userMatchingData = await matchingDao.selectMatchingByUseridx(userData[0].userIdx, moment().format('YYYY-MM-DD')); //시간대 + 상태 확인 안

    if(userMatchingData == 0){
        return -5;
    }

    let matchingIdx = userMatchingData[0].matchingIdx;

    if (userMatchingData[0].userLeftIdx == userIdx) {
        if (decision == true) {
            await matchingDao.updateLeftStateByMatchingIdx(matchingIdx, 3);
            return 1;
        } else {
            await matchingDao.updateLeftStateByMatchingIdx(matchingIdx, 0);
            return -1;
        }
    } else {
        if (decision == true) {
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
    if (verifyToken < 0) {
        return -1;
    }

    const matchingData = await matchingDao.selectMatchingByUseridx(verifyToken.idx, moment().format('YYYY-MM-DD'));
    console.log(matchingData[0]);

    const opponentUserIdx = findOpponentIdx(matchingData[0],verifyToken.idx);
    const opponentUserData = await userDao.selectUserByIdx(opponentUserIdx);

    console.log(opponentUserData);
    if(matchingData.length == 0){ 
        return -4;;
    }

    // if(!(matchingData[0].matchingLeftState == 2 && matchingData[0].matchingRightState == 2)) {
    //     return -3;
    // }

    let chatRoomData = await chatRoomDao.selectChatRoomByMatchingIdx(matchingData[0].matchingIdx);
    const uid = await gcp.insertFbUser(verifyToken.idx);

    let chatroomObject = {
        opponentName : opponentUserData[0].userName,
        opponentImg : opponentUserData[0].userImg,
        uid: uid
    }
    if (chatRoomData.length == 0) {
        console.log('체크');
        const chatRoomId = await gcp.makeChatRoom(matchingData[0].userLeftIdx, matchingData[0].userRightIdx);
        chatroomObject['address'] = chatRoomId;
        const insertResult = await chatRoomDao.insertChatRoom(chatRoomId, matchingData[0].matchingIdx);
        return chatroomObject;
    } else {
        chatroomObject['address'] = chatRoomData[0].chatRoomId
        return chatroomObject
    }
    

}

function checkSameMovie(leftUser, rightUser) {
    if(leftUser && rightUser){
        for (let i = 0; i < leftUser['movieList'].length; i++) {
            for (let j = 0; j < rightUser['movieList'].length; j++) {
                if (leftUser['movieList'][i] == rightUser['movieList'][j]) {
                    return leftUser['movieList'][i];
                }
            }
        }
    }

    return false;
}


async function requireCondition(leftUser, rightUser) {
    let objectCollection;
    const movieIdx = checkSameMovie(leftUser, rightUser);
    if (!movieIdx) {
        return false;
    } else {
        objectCollection = movieIdx;
    }

    
    return objectCollection;
}


//다른 성별 간 랜덤 매칭
async function randomMatching(leftUserList, rightUserList) {
    let leftList = leftUserList;
    let rightList = rightUserList;


    // console.log(leftList);
    // console.log(rightList);

    let matchingList = [];
    while (leftList.length != 0 && rightList.length != 0) {
        const randomNumLeft = Math.floor(Math.random() * 264239) % leftList.length;
        let tempRightList = JSON.parse(JSON.stringify(rightList)); 
        
        while (tempRightList.length != 0) {
            const randomNumRight = Math.floor(Math.random() * 264239) % rightList.length;
            const condition = await requireCondition(leftList[randomNumLeft], tempRightList[randomNumRight]);

            if (condition) {
                //조건에 맞는 경우
                const matchingObject = {
                    leftUser: leftList[randomNumLeft],
                    rightUser: tempRightList[randomNumRight],
                    movieIdx : condition
                }
                matchingList.push(matchingObject);

                leftList.splice(randomNumLeft, 1);
                for (let i = 0; i < rightList.length; i++) {
                    if (rightList[i].userIdx == tempRightList[randomNumRight].userIdx) {
                        rightList.splice(i, 1);
                        break;
                    }
                }

                break;

            } else if (tempRightList.length == 1) {
                //좌측 배열의 조건이 전부 안맞는 경우
                leftList.splice(randomNumLeft, 1);
                break;
            } else {
                //매칭 결과가 조건에 안맞는 경우;
                tempRightList.splice(randomNumRight, 1);
            }
        }

    }

    //매칭이 안된 아무나 상관 없는 부류들

    let select2TypeUser = [];
    leftList.map((data) => {
        if (data.favorGender == 2) {
            select2TypeUser.push(data);
        }
    })
    rightList.map((data) => {
        if (data.favorGender == 2) {
            select2TypeUser.push(data);
        }
    })

    while (select2TypeUser.length > 2) {
        let randNum = Math.floor(Math.random() * 459485) % select2TypeUser.length;
        const leftUser = select2TypeUser[randNum];
        select2TypeUser.splice(randNum, 1);

        randNum = Math.floor(Math.random() * 459485) % select2TypeUser.length;
        const rightUser = select2TypeUser[randNum];
        select2TypeUser.splice(randNum, 1);

        const matching2User = {
            leftUser: leftUser,
            rightUser: rightUser
        }
        matchingList.push(matching2User);
    }

    return matchingList;
}


async function matchingAlgorithm() {
    const momentToday = moment().format('YYYY-MM-DD');
    const reservationData = await reservationDao.selectReservationByDate(momentToday);

    const userRvList = await Promise.all(reservationData.map(async (rvData) => {

        const userProfile = await userDao.selectUserByIdx(rvData.userIdx);

        let userData = {
            userIdx: rvData.userIdx,
            userName: userProfile[0].userName,
            gender: userProfile[0].userGender,
            favorGender: userProfile[0].userSelectGender
        }

        const rvMovie = await reservationDao.selectReservationMovieByRvidx(rvData.reservationIdx);
        const rvMovieList = await Promise.all(rvMovie.map(async (movie) => {
            return movie.movieIdx;
        }))

        userData['movieList'] = rvMovieList;
        // 특정 날짜만 꺼내서 User별 날짜별 movie를 배열로 넣어 저장

        return userData;
    }))

    

    //이성 혹은 아무나 상관 없는 사람들 매칭
    let maleUser = [];
    let femaleUser = [];

    for (let i = 0; i < userRvList.length; i++) {
        if (userRvList[i].gender == 0 && userRvList[i].favorGender == 1
            || userRvList[i].gender == 0 && userRvList[i].favorGender == 2) {
            maleUser.push(userRvList[i]);
        } else if ((userRvList[i].gender == 1 && userRvList[i].favorGender == 0)
            || userRvList[i].gender == 1 && userRvList[i].favorGender == 2) {
            femaleUser.push(userRvList[i]);
        }
    }

    let matchingResult = await randomMatching(maleUser, femaleUser);
    
    console.log(matchingResult);

    await Promise.all(matchingResult.map(async (finalMatchingUser) => {
        const insertDto = {
            leftUserIdx : finalMatchingUser.leftUser.userIdx,
            rightUserIdx : finalMatchingUser.rightUser.userIdx,
            matchingDate : moment().format('YYYY-MM-DD'),
            movieIdx : finalMatchingUser.movieIdx
        }

        const insertResult = await matchingDao.insertMatching(insertDto);
    }))

    return matchingResult;
}

async function deleteMatchingAlgorithm() {
    let nowadays = moment().format('YYYY-MM-DD');
    await reservationDao.deleteAllReservation(nowadays);
    await chatRoomDao.deleteAllChatRoom();
    await matchingDao.deleteAllMatching(nowadays);
}

async function getMatchingInfo(token) {
    
    if(verify(token) < 0) {
        return -1;
    }
    const userIdx = verify(token).idx;
    const matchingResult = await matchingDao.selectMyMatchingByUseridx(userIdx);
    
    let matchingObject = [];

    await Promise.all(matchingResult.map(async matching => {
        if((matching.matchingLeftState == 3 || matching.matchingRightState == 3) && 
        (matching.matchingLeftState != 0 && matching.matchingRightState != 0)) {
            
            const opponentUserIdx = findOpponentIdx(matching, userIdx);
            const opponentUserData = await userDao.selectUserByIdx(opponentUserIdx);
            
            const matchingMovieData = await movieDao.selectMovieNameByMovieIdx(matching.movieIdx);
            const matchingState = String(moment().format('YYYY-MM-DD')) <= String(matching.matchingDate)
            
            const matchingParsed = {
                matchingIdx : matching.matchingIdx,
                name : opponentUserData[0].userName,
                age : opponentUserData[0].userAge,
                kakaotalk : opponentUserData[0].userKakao,
                img : opponentUserData[0].userImg,
                movieTitle : matchingMovieData[0].movieName,
                state : matchingState,
                date : String(moment(matching.matchingDate).format('YYYY-MM-DD')),
            }

            matchingObject.push(matchingParsed);
        }
    }))

    return matchingObject;
}

async function getMatchingInfoPage(token, matchingIdx) {
    if(verify(token) < 0) {
        return -1;
    }
    else if(matchingIdx == undefined) {
        return -2;
    }
    
    const userIdx = verify(token).idx;
    const matchingData = await matchingDao.selectMatchingByMatchingIdx(matchingIdx);

    const opponentUserIdx = findOpponentIdx(matchingData[0], userIdx)
    const opponentUserData = await userDao.selectUserByIdx(opponentUserIdx);
    
    const opponentHashTag = await hashTagDao.selectCharmingTagByUseridx(userIdx);

    let hashList = [];
    await Promise.all(opponentHashTag.map((hashtag) => {
        hashList.push(hashtag.attractPointTagName);
    }))

    const movieTitle = await movieDao.selectMovieNameByMovieIdx(matchingData[0].movieIdx);

    const matchingParsed = {
        name : opponentUserData[0].userName,
        comment : opponentUserData[0].userComment,
        hashtTag : hashList,
        school : opponentUserData[0].userSchool,
        location : opponentUserData[0].userLocation,
        kakaotalk : opponentUserData[0].userKakao,
        img : opponentUserData[0].userImg,
        movieTitle : movieTitle[0].movieName,
        date : moment(matchingData[0].matchingDate).format('YYYY-MM-DD')
    }

    return matchingParsed;
}

module.exports = {
    getMatching,
    postMatchingConfirm,
    postMatchingDecision,
    getMatchingAddress,
    matchingAlgorithm,
    deleteMatchingAlgorithm,
    getMatchingInfo,
    getMatchingInfoPage
}