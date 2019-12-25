const userDao = require('../dao/userDao');

async function postUser() {
    // const userDao = await userDao.insertUser();
    const userData = '니들이 게맛을 알아?';
    
    return userData;
}

/*
- 로그인 성공경우
1. 토큰 반환
- 로그인 실패경우
1. id가 없을 때
2. 비밀번호가 틀릴 때
*/

async function signIn(user) {
    const users = await userDao.selectUser(user);
    console.log(users);
    if (users.length <= 0) {
        return -1;
    } else if (user.password != users[0].userPassword) {
        return -2;
    } else {
        return users[0].userIdx;
    }
}

async function signUp(userData) {
    const users = await userDao.insertUser(userData);
    console.log(users);
    return users; 
}

module.exports = {
    postUser,
    signIn,
    signUp
}