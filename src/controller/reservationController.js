const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");
const mysql = require("../library/mysql");

async function deleteReservation(req, res) {
    try {
        const userIdx = req.params.userIdx;

        const selectReservationIdxByUserIdx = `SELECT * FROM reservation WHERE userIdx = ?`;
        const reservation = await mysql.query(selectReservationIdxByUserIdx, [userIdx]);
        Promise.all(reservation.map(async (reserve) => {
            const reservationIdx = reserve.reservationIdx;
            console.log(reservationIdx)
            const deleteReservationHourByUserIdx = `DELETE FROM reservationHour WHERE reservationIdx = ?`;
            await mysql.query(deleteReservationHourByUserIdx, [reservationIdx]);
            const deleteReservationMovieByUserIdx = `DELETE FROM reservationMovie WHERE reservationIdx = ?`;
            await mysql.query(deleteReservationMovieByUserIdx, [reservationIdx]);
            const deleteReservationByUserIdx = `DELETE FROM reservation WHERE userIdx = ?`;
            await mysql.query(deleteReservationByUserIdx, [userIdx]);
        }))
        
        response(res, returnCode.OK, "예약정보 삭제완료");

    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}

module.exports = {
    deleteReservation
}