const mysql = require('../library/mysql');

/*
1. 랜덤 영화 추천 3개 까지
2. 예매한 영화 이미지,이름,별점
3. 예매한 영화
*/

async function selectMainMovie() {  // 영화 랜덤 추천 3개 
    const selectSql = `SELECT movieIdx, movieName, movieScore, movieGenre, movieImg, movieShowTime, movieURL 
    FROM movie ORDER BY RAND() LIMIT 3`;
    
    return await mysql.query(selectSql);
}

async function selectMainReserve(userIdx) {    // 예매한 영화 조회
    const selectSql = `SELECT reservationIdx, movie.movieIdx, userIdx, reservationDate, reservationTime, movieName, movieScore, movieImg 
    FROM reservation JOIN movie ON reservation.movieIdx = movie.movieIdx 
    WHERE userIdx = ?`;

    console.log(userIdx);
    return await mysql.query(selectSql, userIdx);
}

module.exports = {
    selectMainMovie,
    selectMainReserve
}