const mysql = require('../library/mysql');

const table = 'user';

async function insertUser(userData) {
    const {userIdx, userName, userPassword, userNickName, userId, userImg, userAge, userComment, userLocation} = userData;
    const fields = 'userIdx, userName, userPassword, userNickName, userId, userImg, userAge, userComment, userLocation';
    const values = [userIdx, userName, userPassword, userNickName, userId, userImg, userAge, userComment, userLocation];
    const insertUser = `INSERT INTO ${table} (${fields}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

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