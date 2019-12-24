const userDao = require('../dao/userDao');


async function postUser() {
    // const userDao = await userDao.insertUser();
    const userData = '니들이 게맛을 알아?';
    
    return userData;
}

async function signIn(user) {
    // const userDao = await userDao.selectUser();
    const idx = userDao.idx;

    return idx;
}

async function signUp(user) {
    const userDao = await userDao.insertUser(user);
    return true;
}
module.exports = {
    postUser
}