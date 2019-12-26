const userDao = require('../dao/userDao');


const jwt = require('../library/jwt');
const encryption = require('../library/encryption');

/*
- 로그인 성공경우
1. 토큰 반환
- 로그인 실패경우
1. id가 없을 때
2. 비밀번호가 틀릴 때
*/

async function signIn(user) {
    const users = await userDao.selectUser(user);
    const hashedPassword = await encryption.notSaltEncrypt(user.password, users[0].userSalt);
    if (users.length <= 0) {
        return -1;
    } else if (hashedPassword != users[0].userHash) {
        return -2;
    } else {
        const token = jwt.sign(users[0].userIdx);
        return token;
    }
}

async function signUp(user) {

    // 파라미터 값이 부족합니다.
    const {id, name, password, nickName, age, comment, location} = user;
    if(!id || !name || !password || !nickName || !age || !comment || !location) {
        return -1;
    }
    // 비밀번호 암호화 과정
    const passwordEncryption = await encryption.encrypt(user.password);
    const salt = passwordEncryption.salt;
    const hash = passwordEncryption.hashPassword;
    let encryptedUser = user;
    delete encryptedUser.password;
    encryptedUser['salt'] = salt;
    encryptedUser['hash'] = hash;

    const users = await userDao.insertUser(encryptedUser);
    console.log(users);
    return users; 
}

module.exports = {
    signIn,
    signUp
}