const userDao = require('../dao/userDao');
const hashtagDao = require('../dao/hashtagDao');

const jwt = require('../library/jwt');
const encryption = require('../library/encryption');

/**
 * 디비에 해시태그 넣는 함수
 * 
 * @param {*} hashtagType hashtagName 내용들 적은거
 * @param {*} userIdx 사용자 고유 번호
 * @param {*} hashtag 해시태그타입 이름
 * 
 */
async function insertHashTag(hashtagType, userIdx, hashtag) {
        Promise.all(hashtagType.map((hashtagName) => {
            hashtagDao.insertHashtag({hashtagName, hashtag, userIdx});
        }))
}

/**
 * 로그인
 * 
 * @param {*} user 유저정보
 * 
 * @return -1 아이디가 없을 때
 * @return -2 비밀번호가 틀릴 때
 * @return token 로그인 성공할 때
 */
async function postUserSignIn(user) {
    const users = await userDao.selectUserById(user);
    // 아이디가 없을 때
    if (users.length <= 0) {
        return -1;
    } 
    // 비밀번호가 틀릴 때
    const hashedPassword = await encryption.notSaltEncrypt(user.password, users[0].userSalt);
    if (hashedPassword != users[0].userHash) {
        return -2;
    } else {
        const token = jwt.sign(users[0].userIdx);
        return token;
    }
}

/**
 * 회원가입
 * 
 * @param {id, name, password, nickname, age, image, comment, location, selectGender, selectMinAge, selectMaxAge, preferGenre, attractPoint, myLikes, school, major, kakao} user 유저 정보
 * 
 * @return -1 데이터가 부족할 때
 * @return -2 아이디가 존재 할 때
 * @return check 
 */
async function postUserSignUp(user) {
    const {id, name, password, nickname, age, comment, location, selectGender, selectMinAge, selectMaxAge, preferGenre, attractPoint, favor, school, major, kakao} = user;
    if(!id || !name || !password || !nickname || !age || !comment || !location || !selectGender || !selectMinAge || !selectMaxAge || !preferGenre || !attractPoint || !favor || !school || !major || !kakao) {
        return -1;
    }

    const alreadyUser = await userDao.selectUserById(user);
    if (!(alreadyUser.length <= 0)) {
        return -2;
    }

    const passwordEncryption = await encryption.encrypt(user.password);
    const salt = passwordEncryption.salt;
    const hash = passwordEncryption.hashPassword;
    let encryptedUser = user;
    delete encryptedUser.password;
    encryptedUser['salt'] = salt;
    encryptedUser['hash'] = hash;

    const check = await userDao.insertUser(encryptedUser);

    const users = await userDao.selectUserById(user);
    const userIdx =users[0].userIdx;
    
    const arrayPreferGenre = preferGenre.split(',');
    const arrayAttractPoint = attractPoint.split(',');
    const arrayFavor = favor.split(',');

    var hashtag = "preferGenreTag";
    await insertHashTag(arrayPreferGenre, userIdx, hashtag);
    var hashtag = "attractPointTag";
    await insertHashTag(arrayAttractPoint, userIdx, hashtag);
    var hashtag = "favorTag";
    await insertHashTag(arrayFavor, userIdx, hashtag);

    return check; 
}

module.exports = {
    postUserSignIn,
    postUserSignUp
}