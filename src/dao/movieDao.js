const mysql = require('../library/mysql');

const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');

// 예매율 TOP10 영화조회(현재상영작,개봉예정작)
async function selectMovie(movieReleaseStatus) {
    console.log(movieReleaseStatus)

    if(movieReleaseStatus == 0){   // 현재상영작
        const selectCurrentSql = `SELECT * FROM movie WHERE movieReleaseStatus = 0 
        ORDER BY movieReserveRate DESC LIMIT 10`;

        return await mysql.query(selectCurrentSql);
    }

    if(movieReleaseStatus == 1){   // 개봉에정작
        const selectFutureSql = `SELECT * FROM movie WHERE movieReleaseStatus = 1 
        ORDER BY movieReserveRate DESC LIMIT 10`;

        return await mysql.query(selectFutureSql);
    }
}

async function insertMovie(userIdx, movieData) {    // 영화 선택
    const insertSql = `INSERT INTO reservation (userIdx, movieIdx, reservationTime, reservationDate) VALUES (?, ?, ?, ?);`;
    return await mysql.query(insertSql, [userIdx, movieData]);
}

module.exports = {
    selectMovie,
    insertMovie
}