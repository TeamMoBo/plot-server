const mainDao = require('../dao/mainDao');

/*
1. 영화 3개 랜덤으로 추천
2. 토큰 null 확인, 로그인 확인
3. idx에 해당하는 reservation 가져오기
*/
async function getMain(userIdx) {
    const randMovie = await mainDao.selectMainMovie();  // 랜덤영화정보
    const reserveMovie = await mainDao.selectMainReserveMovie(userIdx); // 영화정보
    const reserveDate = await mainDao.selectMainReserveDate(userIdx);   // 영화시간정보
    
    const allData = {
        "userIdx" : 0,
        "randMovie" : [],
        "reserveMovie" : [],
        "reserveDate" : [],
    }

    allData.userIdx = reserveMovie[0].userIdx;

    for(let i = 0; i<randMovie.length; i++){
        // 랜덤영화 정보조회
        let randomData = {
        }
            randomData["movieIdx"] = randMovie[i].movieIdx;
            randomData["movieImg"] = randMovie[i].movieImg;
            randomData["movieName"] = randMovie[i].movieName;
            randomData["movieScore"] = randMovie[i].movieScore;
            randomData["movieRuntime"] = randMovie[i].movieRunTime;
            randomData["movieGenre"] = randMovie[i].movieGenre

            allData.randMovie.push(randomData);
    }

    const movieLength = Object.keys(reserveMovie);
    let duplicationMovieValue = reserveMovie[0].movieIdx;

    let movieData = {
        "movieIdx" : 0,
        "movieImg" : "",
        "movieName" : "",
        "movieScore" : 0
    }

    for(let i = 0; i<movieLength.length; i++){ // 예약영화 조회

        if(i == 0){ // data set
            movieData.movieIdx = reserveMovie[0].movieIdx;
            movieData.movieImg = reserveMovie[0].movieImg;
            movieData.movieName = reserveMovie[0].movieName;
            movieData.movieScore = reserveMovie[0].movieScore;
            allData.reserveMovie.push(movieData);   // push data
            continue;
        }
        
        if(duplicationMovieValue == reserveMovie[i].movieIdx){  // duplication value checking
            console.log(i)
            continue;
        } else {
            movieData = {   // movieData initialization
            "movieIdx" : 0,
            "movieImg" : "",
            "movieName" : "",
            "movieScore" : 0
            }
            movieData.movieIdx = reserveMovie[i].movieIdx;
            movieData.movieImg = reserveMovie[i].movieImg;
            movieData.movieName = reserveMovie[i].movieName;
            movieData.movieScore = reserveMovie[i].movieScore;
            duplicationMovieValue = reserveMovie[i].movieIdx;
            allData.reserveMovie.push(movieData);
        }
    }

    for(var i = 0; i < allData.reserveMovie.length - 1; i++) {  // reserveMovie.movieIdx 중복제거
        for(var j = i + 1; j < allData.reserveMovie.length; j++) {
            if(JSON.stringify(allData.reserveMovie[i]) === JSON.stringify(allData.reserveMovie[j])) {
                allData.reserveMovie.splice(j, 1);
            }
        }
    }

    // console.log(allData.reserveMovie)

    const dateLength = Object.keys(reserveDate) // idx.length
    let duplicationDateValue = reserveDate[0].reservationDate;  // 중복확인 value

    let dateData = {
        "reservationDate" : "",
        "reservationWeekday" : "",
        "reservationTime" : []
    }
        for(let i = 0; i<dateLength.length; i++){ // 예약시간 조회

            if(i == 0){ // data set
                dateData.reservationDate = reserveDate[0].reservationDate;
                dateData.reservationWeekday = reserveDate[0].reservationWeekday
                dateData.reservationTime.push(reserveDate[0].reservationTime);
                allData.reserveDate.push(dateData);
                continue;
            }

            if(reserveDate[i].reservationDate == duplicationDateValue){ // 중복확인, 중복일 경우
                dateData.reservationTime.push(reserveDate[i].reservationTime)   // time push
            } else {    // 중복이 아닐 경우, reservationDate new value
                dateData = {    // dateData Initialization
                    "reservationDate" : "",
                    "reservationWeekday" : "",
                    "reservationTime" : []
                }
                dateData.reservationDate = reserveDate[i].reservationDate;
                dateData.reservationWeekday = reserveDate[i].reservationWeekday;
                dateData.reservationTime.push(reserveDate[i].reservationTime);
                duplicationDateValue = reserveDate[i].reservationDate;
                allData.reserveDate.push(dateData);
            }
        }
    return allData;
}

module.exports = {
    getMain
}