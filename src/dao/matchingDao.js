const mysql = require('../library/mysql');

async function selectMatchingByUseridx(userIdx) {
    const selectQuery = `SELECT * FROM matching WHERE (userLeftIdx = ? OR userRightIdx = ?)`
    return await mysql.query(selectQuery, [userIdx, userIdx]);
}

module.exports = {
    selectMatchingByUseridx
}