const mysql = require('../library/mysql');

const table = 'user';

async function insertUser(userData) {
    const fields = 'userId, userName, userSalt, userHash, userNickname, userImg, userAge, userComment, userLocation, userSelectGender, userSelectMinAge, userSelectMaxAge, userSchool, userMajor, userKakao';
    const values = [userData.id, userData.name, userData.salt, userData.hash, userData.nickname, userData.image, userData.age, userData.comment, userData.location, userData.selectGender, userData.selectMinAge, userData.selectMaxAge, userData.school, userData.major, userData.kakao];
    const insertUser = `INSERT INTO ${table} (${fields}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    return await mysql.query(insertUser, values);
}

async function selectUser(userData) {
    const searchUser = `SELECT * FROM ${table} WHERE id = ${userData.id}`;

    return await mysql.query(searchUser);
}
module.exports = {
    insertUser,
    selectUser
}