const mysql = require('../library/mysql');

async function insertUser(userData) {
    const insertSql = `INSERT INTO user () VALUES (?, ?, ?, ?, ?, ?, ?);`;
    return await mysql.query(insertSql, userData);
}

module.exports = {
    insertUser
}