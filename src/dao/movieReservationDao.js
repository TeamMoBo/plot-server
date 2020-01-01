const mysql = require('../library/mysql');

async function selectMovieReservationByMatchingidx(matchingIdx) {
    const selectQuery = `SELECT * FROM movieReservation WHERE matchingIdx = ?`
    return await mysql.query(selectQuery, [matchingIdx]);
}

module.exports = {
    selectMovieReservationByMatchingidx
}