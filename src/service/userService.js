const userDao = require('../dao/userDao');
const hashtagDao = require('../dao/hashtagDao');

const jwt = require('../library/jwt');
const encryption = require('../library/encryption');


async function insertHashTag(hashtagType, userIdx, hashtag) {
        console.log(hashtag);
        Promise.all(hashtagType.map((hashtagName) => {
            console.log(hashtagName);
            hashtagDao.insertHashtag({hashtagName, hashtag, userIdx});
        }))
}

async function signUp(user) {
    console.log(user);
    // 파라미터 값이 부족합니다.
    const {id, name, password, nickname, age, image, comment, location, selectGender, selectMinAge, selectMaxAge, preferGenre, attractPoint, myLikes, school, major, kakao} = user;
    if(!id || !name || !password || !nickname || !age || !image || !comment || !location || !selectGender || !selectMinAge || !selectMaxAge || !preferGenre || !attractPoint || !myLikes || !school || !major || !kakao) {
        return -1;
    }

    const alreadyUser = await userDao.selectUser(user);
    // 아이디가 존재 할 때
    if (!(alreadyUser.length <= 0)) {
        return -2;
    }

    // 비밀번호 암호화 과정
    const passwordEncryption = await encryption.encrypt(user.password);
    const salt = passwordEncryption.salt;
    const hash = passwordEncryption.hashPassword;
    let encryptedUser = user;
    delete encryptedUser.password;
    encryptedUser['salt'] = salt;
    encryptedUser['hash'] = hash;

    const check = await userDao.insertUser(encryptedUser);

    const users = await userDao.selectUser(user);
    const userIdx =users[0].userIdx;
    
    const arrayPreferGenre = preferGenre.split(',');
    const arrayAttractPoint = attractPoint.split(',');
    const arrayMyLikes = myLikes.split(',');

    var hashtag = "arrayPreferGenre";
    await insertHashTag(arrayPreferGenre, userIdx, hashtag);
    var hashtag = "arrayAttractPoint";
    await insertHashTag(arrayAttractPoint, userIdx, hashtag);
    var hashtag = "arrayMyLikes";
    await insertHashTag(arrayMyLikes, userIdx, hashtag);

    return check; 
}

async function signIn(user) {
    const users = await userDao.selectUser(user);
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

// async function signUpImg(img) {
//     const users = await userDao.insertImg(img);
//     if (users.length <= 0) {
//         return -1;
//     } else if (hashedPassword != users[0].userHash) {
//         return -2;
//     } else {
//         const token = jwt.sign(users[0].userIdx);
//         return token;
//     }
// }
module.exports = {
    signIn,
    signUp
}