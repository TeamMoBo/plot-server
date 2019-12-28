const mainDao = require('../dao/mainDao');

/*
1. 영화 3개 랜덤으로 추천
2. 토큰 null 확인, 로그인 확인
3. idx에 해당하는 reservation 가져오기
*/
async function getMain(userIdx) {
    const randMovie = await mainDao.selectMainMovie();
    const reserveMovie = await mainDao.selectMainReserve(userIdx);
    
    const allData = {
        "randMovie" : [],
        "reserveMovie" : [],
        "reserveDate" : [],
    }

    for(let i = 0; i<randMovie.length; i++){
        // 랜덤영화 정보조회
        let randomData = {
        }
            randomData["movieIdx"] = randMovie[i].movieIdx;
            randomData["movieImg"] = randMovie[i].movieImg;
            randomData["movieName"] = randMovie[i].movieName;
            randomData["movieScore"] = randMovie[i].movieScore;
            randomData["movieShowTime"] = randMovie[i].movieShowTime;
            randomData["movieGenre"] = randMovie[i].movieGenre

            allData.randMovie.push(randomData);
    }

    for(let i = 0; i<reserveMovie.length; i++){ // 예약영화 조회
        let movieData = {
        }
            movieData["reservationIdx"] = reserveMovie[i].reservationIdx;
            movieData["movieIdx"] = reserveMovie[i].movieIdx;
            movieData["userIdx"] = reserveMovie[i].userIdx;
            movieData["movieImg"] = reserveMovie[i].movieImg;
            movieData["movieName"] = reserveMovie[i].movieName;
            movieData["movieScore"] = reserveMovie[i].movieScore;

            allData.reserveMovie.push(movieData);
    }

    for(let i = 0; i<reserveMovie.length; i++){ // 예약시간 조회
        let dateData = {
        }
            dateData["reservationDate"] = reserveMovie[i].reservationDate;

            let timeData = reserveMovie[i].reservationTime;

            dateData["reservationTime"] = timeData.split(',');

            allData.reserveDate.push(dateData);
    }


    return allData;
}


module.exports = {
    getMain
}