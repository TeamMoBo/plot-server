const userDao = require("../dao/userDao");

async function postUser() {
  // const userDao = await userDao.insertUser();
  const userData = "니들이 게맛을 알아?";
  return userData;
}

/*
로그인 실패경우
1. id가 없을 때
2. 비밀번호가 없을 때
*/

async function signIn(user) {
    //const userDao = await userDao.selectUser(user);
    if (!userDao) {
        return -1;
    } else if (user.password == userDao.password) {
        return -2;
    } else {
        return userDao.idx;
    }
}

async function signUp(user) {
    //const userDao = await userDao.insertUser(user);
    return true;
}
module.exports = {
    postUser,
    signIn,
    signUp
}