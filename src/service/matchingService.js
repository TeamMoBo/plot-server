const moment = require('moment');

const { verify } = require('../library/jwt');
const gcp = require('../gcp/gcp');

const matchingDao = require("../dao/matchingDao");
const movieReservationDao = require("../dao/movieReservationDao");
const userDao = require("../dao/userDao");
const hashTagDao = require("../dao/hashtagDao");
const chatRoomDao = require("../dao/chatRoomDao");
const reservationDao = require("../dao/reservationDao");


/**
 * 매칭 페이지
 * 
 * @param  token 유저 토큰 
 */
function findOpponentIdx(matchingArr, userIdx) {
    let opponentIdx;
    if (matchingArr[0].userLeftIdx == userIdx) {
        opponentIdx = matchingArr[0].userRightIdx;
    } else if (matchingArr[0].userRightIdx == userIdx) {
        opponentIdx = matchingArr[0].userLeftIdx;
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
    const userMatchingData = await matchingDao.selectMatchingByUseridx(userIdx); //시간대 + 상태 확인 안함
    if (userMatchingData.length == 0) {
        return -1;
    }



    //상대방 정보 받아오기
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
        name: opponentUserData[0].userName,
        img: opponentUserData[0].userImg,
        age: opponentUserData[0].userAge,
        school: opponentUserData[0].userSchool,
        major: opponentUserData[0].userMajor,
        location: opponentUserData[0].userLocation,
        genreHash: genreTagContent,
        charmingHash: charmingTagContent,
        favorHash: favorTagContent,
        moiveInfo: movieInfoText
    }

    return parsingUser;
}

async function postMatchingConfirm(token, reply) {
    const userIdx = verify(token).idx;
    const userData = await userDao.selectUserByIdx(userIdx);
    if (userData.length == 0) {
        return -2;
    }

    const userMatchingData = await matchingDao.selectMatchingByUseridx(userIdx); //시간대 + 상태 확인 안
    let matchingIdx = userMatchingData[0].matchingIdx;

    if (userMatchingData[0].matchingLeftState == userIdx) {
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

    const userMatchingData = await matchingDao.selectMatchingByUseridx(userIdx); //시간대 + 상태 확인 안
    let matchingIdx = userMatchingData[0].matchingIdx;

    if (userMatchingData[0].matchingLeftState == userIdx) {
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

    const matchingData = await matchingDao.selectMatchingByUseridx(verifyToken.idx);
    let chatRoomData = await chatRoomDao.selectChatRoomByMatchingIdx(matchingData[0].matchingIdx);

    if (chatRoomData.length == 0) {
        const chatRoomId = await gcp.makeChatRoom(matchingData[0].userLeftIdx, matchingData[0].userRightIdx);
        const insertResult = await chatRoomDao.insertChatRoom(chatRoomId, matchingData[0].matchingIdx);
        chatRoomData = await chatRoomDao.selectChatRoomByMatchingIdx(insertResult.insertId);
    }
    const uid = await gcp.insertFbUser(verifyToken.idx);
    return {
        address: chatRoomData[0].chatRoomId,
        uid: uid
    }
}

function checkSameMovie(leftUser, rightUser) {
    for (let i = 0; i < leftUser['movieList'].length; i++) {
        for (let j = 0; j < rightUser['movieList'].length; j++) {
            if (leftUser['movieList'][i] == rightUser['movieList'][j]) {
                return true;
            }
        }
    }

    return false;
}


async function requireCondition(leftUser, rightUser) {
    // let condition = checkSameMovie(leftUser, rightUser);
    // if (!condition) {
    //     return false;
    // } else {
        return true;
    // }
}


//다른 성별 간 랜덤 매칭
async function randomMatching(leftUserList, rightUserList) {
    let leftList = leftUserList;
    let rightList = rightUserList;

    let matchingList = [];
    while (leftList.length != 0 && rightList.length != 0) {
        const randomNumLeft = Math.floor(Math.random() * 264239) % leftList.length;
        let tempRightList = JSON.parse(JSON.stringify(rightList)); rightList;
        while (tempRightList.length != 0) {
            const randomNumRight = Math.floor(Math.random() * 264239) % rightList.length;

            const condition = await requireCondition(leftList[randomNumLeft], tempRightList[randomNumRight]) 
            if (condition) {
                //조건에 맞는 경우
                const matchingObject = {
                    leftUser: leftList[randomNumLeft],
                    rightUser: tempRightList[randomNumRight]
                }
                matchingList.push(matchingObject);

                leftList.splice(randomNumLeft, 1);
                for (let i = 0; i < rightList.length; i++) {
                    if (rightList[i] == tempRightList[randomNumRight]) {
                        console.log('숙청');
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

    console.log(matchingList);



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
    //아무나 해주세요 매칭

    // await Promise.all((finalMatchingUser) => {


    //     const insertDto = {
    //         leftUserIdx : leftUser.userIdx,
    //         rightUserIdx : rightUser.userIdx,
    //         matchingDate : moment().format('YYYY-MM-DD'),
    //         movieIdx : 1
    //     }
    // })

    return matchingResult;
}


module.exports = {
    getMatching,
    postMatchingConfirm,
    postMatchingDecision,
    getMatchingAddress,
    matchingAlgorithm
}