const mysql = require('../library/mysql');

async function selectMyMatchingByUseridx(userIdx) {
    const selectQuery = `SELECT * FROM matching WHERE (userLeftIdx = ? OR userRightIdx = ?) ORDER BY matchingIdx DESC`
    return await mysql.query(selectQuery, [userIdx, userIdx]);
}

async function selectMatchingByUseridx(userIdx, nowaDay) {
    const selectQuery = `SELECT * FROM matching WHERE (userLeftIdx = ? OR userRightIdx = ?) AND (matchingDate = ?) ORDER BY matchingIdx DESC`
    return await mysql.query(selectQuery, [userIdx, userIdx, nowaDay]);
}

async function selectMatchingByMatchingIdx(matchingIdx) {
    const selectQuery = `SELECT * FROM matching WHERE matchingIdx = ?`;
    return await mysql.query(selectQuery, [matchingIdx]);
}

async function updateLeftStateByMatchingIdx(matchingIdx, reply){
    const updateQuery = `UPDATE matching SET matchingLeftState = ? WHERE matchingIdx = ?`;
    return await mysql.query(updateQuery, [reply, matchingIdx])
}

async function updateRightStateByMatchingIdx(matchingIdx, reply) {
    const updateQuery = `UPDATE matching SET matchingRightState = ? WHERE matchingIdx = ?`;
    return await mysql.query(updateQuery, [reply, matchingIdx])
}

async function insertMatching(insertDto) {
    const insertQuery = `INSERT INTO matching(userLeftIdx, userRightIdx, matchingLeftState, matchingRightState, matchingDate, movieIdx) VALUES(?, ?, 1, 1, ?, ?)`;
    return await mysql.query(insertQuery, [insertDto.leftUserIdx, insertDto.rightUserIdx, insertDto.matchingDate, insertDto.movieIdx])
}

async function deleteAllMatching(nowaDay) {
    const deleteQuery = `DELETE FROM matching WHERE matchingDate = ?`;
    return await mysql.query(deleteQuery, [nowaDay]);
}

module.exports = {
    selectMatchingByUseridx,
    selectMatchingByMatchingIdx,
    updateLeftStateByMatchingIdx,
    updateRightStateByMatchingIdx,
    insertMatching,
    deleteAllMatching,
    selectMyMatchingByUseridx
}