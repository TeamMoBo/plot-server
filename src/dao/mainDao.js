const mysql = require('../library/mysql');

/*
1. 랜덤 영화 추천 3개 까지
2. 예매한 영화 이미지,이름,별점
3. 예매한 영화
*/

async function selectMainMovie() {  // 영화 랜덤 추천 3개 
    const selectSql = `SELECT movieIdx, movieName, movieScore, movieGenre, movieImg, movieRunTime, movieURL 
    FROM movie ORDER BY RAND() LIMIT 3`;
    
    return await mysql.query(selectSql);
}

// Select * From A left JOIN B
// ON A.name = B.name
// left JOIN C
// ON A.name = C.name

async function selectMainReserveMovie(userIdx) {    // 예매한 영화 조회
    const selectMovieSql = `SELECT reservation.userIdx, reservationMovie.movieIdx, movieImg, movieName, movieScore 
    FROM reservationMovie JOIN movie ON reservationMovie.movieIdx = movie.movieIdx 
    left JOIN reservation ON reservationMovie.reservationIdx = reservation.reservationIdx WHERE userIdx = ?`;
    return await mysql.query(selectMovieSql, userIdx);
}

async function selectMainReserveDate(userIdx) {    // 예매한 영화 시간조회
    const selectScheduleSql = `SELECT reservationDate, reservationTime, reservationWeekday 
    FROM reservation JOIN reservationHour ON reservation.reservationIdx = reservationHour.reservationIdx WHERE userIdx = ? ORDER BY reservationDate ASC, reservationTime ASC`;

    return await mysql.query(selectScheduleSql, userIdx);
}

async function selectMatchingState(userIdx) {    // 매칭상태 조회
    const selectMatchingSql = `SELECT matchingLeftState, matchingRightState FROM matching WHERE userLeftIdx = ? OR userRightIdx = ?`
    return await mysql.query(selectMatchingSql, [userIdx, userIdx]);
}

module.exports = {
    selectMainMovie,
    selectMainReserveMovie,
    selectMainReserveDate,
    selectMatchingState
}