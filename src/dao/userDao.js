const mysql = require('../library/mysql');

const table = 'user';

async function insertUser(userData) {
    const fields = 'userId, userName, userPassword, userNickName, userImg, userAge, userComment, userLocation';
    const values = [userData.id, userData.name, userData.password, userData.nickName, userData.image, userData.age, userData.comment, userData.location];
    const insertUser = `INSERT INTO ${table} (${fields}) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

    return await mysql.query(insertUser, values);
}

async function selectUser(user) {
    const searchUser = `SELECT * FROM ${table} WHERE userId = ?`;
    const values = [user.id];
    return await mysql.query(searchUser, values);
}

module.exports = {
    insertUser,
    selectUser
}