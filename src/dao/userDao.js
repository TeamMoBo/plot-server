const mysql = require('../library/mysql');

async function insertUser(userData) {
    const insertSql = `INSERT INTO user () VALUES (?, ?, ?, ?, ?, ?, ?);`;
    return await mysql.query(insertSql, userData);
}

async function selectUser(userData) {
    const searchUser = `SELECT * FROM () WHERE userIdx = ${userIdx}`;
    return await mysql.query(searchUser, userData);
}
module.exports = {
    insertUser
}