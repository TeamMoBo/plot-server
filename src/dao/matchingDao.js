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

module.exports = {
    selectMatchingByUseridx,
    updateLeftStateByMatchingIdx,
    updateRightStateByMatchingIdx
}