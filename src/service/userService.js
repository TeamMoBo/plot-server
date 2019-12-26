const userDao = require("../dao/userDao");

async function postUser() {
  // const userDao = await userDao.insertUser();
  const userData = "니들이 게맛을 알아?";
  return userData;
}

module.exports = {
  postUser
};
