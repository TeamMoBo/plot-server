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

    for(let i = 0; i<movieData.movieIdx.length; i++){
        const insertMovieSql = `INSERT INTO reservation (movieIdx, userIdx) VALUES (?, ?)`;
        const insertMovieResult = await mysql.query(insertMovieSql, [movieData[i].movieIdx, userIdx]);

        for(let j = 0; j<movieData.reservationDate.length; j++){
            const insertDateSql = `INSERT INTO reservationSchedule (reservationIdx, reservationTime, reservationDate) VALUES (?, ?, ?)`;
            const insertDateResult = await mysql.query(insertDateSql, 
                [insertMovieSql[i].insertId, movieData[j].reservationTime, movieData[j].reservationDate]);

            if(!insertDateResult){  // 쿼리가 제대로 수행되지 않았을 경우 = -1
                return -1;
            }
        }
        if(!insertMovieResult){ // 쿼리가 제대로 수행되지 않았을 경우 = -1
            return -1;
        }
    }
    return true;
}

async function updateMovie(userIdx, movieData) {    // 영화 수정
    // const selectMovieSql = `SELECT * FROM reservation JOIN reservationSchedule 
    // ON reservation.reservationIdx = reservationSchedule.reservationIdx WHERE userIdx = ?`;
    // const selectMovieResult = await mysql.query(selectMovieSql, [userIdx]);

    // const updateMovieSql = `INSERT INTO reservation (userIdx, movieIdx) VALUES (?, ?);`;
    // const updateDateSql = `INSERT INTO reservationSchedule (reservationIdx, reservationTime, reservationDate) VALUES (?, ?, ?)`;
    // "UPDATE user SET notistate = ? WHERE user_idx =?";

    // 출처: https://121202.tistory.com/28 [책방 창고]
    // const updateResult = `UPDATE reservation SET movieIdx = ? WHERE userIdx = `;
    // const transaction = await mysql.transaction(async (connection) => {
    //     const insertMovieResult = await connection.query(insertMovieSql, [userIdx, movieData.movieIdx]);
    //     const insertDateResult = await connection.query(insertDateSql, 
    //         [movieData.reservationIdx, movieData.reservationTime, movieData.reservationDate]);
    // });
    // return transaction
}

module.exports = {
    selectMovie,
    insertMovie,
    updateMovie
}