const mysql = require('../library/mysql');

async function selectChatRoomByMatchingIdx(matchingIdx) {
    const selectQuery = `SELECT * FROM chatRoomId WHERE matchingIdx = ?`;
    return await mysql.query(selectQuery, [matchingIdx]);
}

async function insertChatRoom(chatRoomId, matchingIdx) {
    const insertQuery = `INSERT INTO chatRoomId(chatRoomId, matchingIdx) VALUES(?, ?)`
    return await mysql.query(insertQuery, [chatRoomId, matchingIdx]);
}

module.exports = {
    selectChatRoomByMatchingIdx,
    insertChatRoom
}