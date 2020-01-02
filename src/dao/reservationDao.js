const mysql = require('../library/mysql');

async function selectReservationByDate(reservationDate) {
    const selectQuery = `SELECT * FROM reservation WHERE reservationDate = ?`;
    return await mysql.query(selectQuery, [reservationDate]);
}

async function selectReservationMovieByRvidx(reservationIdx) {
    const selectQuery = `SELECT * FROM reservationMovie WHERE reservationIdx = ?`;
    return await mysql.query(selectQuery, [reservationIdx]);
}

async function deleteAllReservation(nowaday) {
    const deleteQuery = `DELETE FROM reservationInfo WHERE reservationDate = ?`;
    return await mysql.query(deleteQuery, [nowaday]);
}

module.exports = {
    selectReservationByDate,
    selectReservationMovieByRvidx,
    deleteAllReservation
}