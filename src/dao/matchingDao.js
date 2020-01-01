const mysql = require('../library/mysql');

async function selectMatchingByUseridx(userIdx) {
    const selectQuery = `SELECT * FROM matching WHERE (userLeftIdx = ? OR userRightIdx = ?) ORDER BY matchingIdx DESC`
    return await mysql.query(selectQuery, [userIdx, userIdx]);
}

async function updateLeftStateByMatchingIdx(matchingIdx, reply){
    const updateQuery = `UPDATE matching SET matchingLeftState = ? WHERE matchingIdx = ?`;
    return await mysql.query(updateQuery, [reply, matchingIdx])
}

async function updateRightStateByMatchingIdx(matchingIdx) {
    const updateQuery = `UPDATE matching SET matchingRightState = 2 WHERE matchingIdx = ?`;
    return await mysql.query(updateQuery, [reply, matchingIdx])
}

async function insertMatching(insertDto) {
    const insertQuery = `INSERT INTO matching(userLeftIdx, userRightIdx, matchingLeftState, matchingRightState, matchingDate, movieIdx) VALUES(?, ?, 1, 1, ?, ?)`;
    return await mysql.query(insertQuery, [insertDto.leftUserIdx, insertDto.rightUserIdx, insertDto.matchingDate, insertDto.movieIdx])
}

module.exports = {
    selectMatchingByUseridx,
    updateLeftStateByMatchingIdx,
    updateRightStateByMatchingIdx,
    insertMatching
}