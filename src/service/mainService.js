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
    const matchingData = await mainDao.selectMatchingState(userIdx);    // 매칭상태
    
    const allData = {
        "userIdx" : 0,
        "matchingState" : 0,
        "randMovie" : [],
        "reserveMovie" : [],
        "reserveDate" : [],
    }

    allData.userIdx = userIdx;

    /* 
    매칭 상태
    matchingTable가져오고 status 1 : 1 인 경우 TRUE, 
    아니면 0, 1
    */

    for(let i = 0; i<matchingData.length; i++){
        let left = matchingData[i].matchingLeftState;
        let right = matchingData[i].matchingRightState;

        if(left == 1 && right == 1){    // 매칭 상태가 1:1일 경우
            allData.matchingState = 1;
        }
    }

    for(let i = 0; i<randMovie.length; i++){
        // 랜덤영화 정보조회
        let randomData = {
        }
            randomData["movieIdx"] = randMovie[i].movieIdx;
            randomData["movieImg"] = randMovie[i].movieImg;
            randomData["movieName"] = randMovie[i].movieName;
            randomData["movieScore"] = randMovie[i].movieScore;
            randomData["movieRuntime"] = randMovie[i].movieRunTime;
            randomData["movieGenre"] = randMovie[i].movieGenre;
            randomData["movieURL"] = randMovie[i].movieURL;

            allData.randMovie.push(randomData);
    }

    if(!reserveMovie == 0 || !reserveDate == 0){    //  예약이 존재하지 않을 경우
        return allData;
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

        let timeFilterArr = dateData.reservationTime.filter((item, idx, array) =>{
            return array.indexOf(item) === idx;
        });

        dateData.reservationTime.splice(0,dateData.reservationTime.length); // 배열 초기

        for(let i = 0; i<timeFilterArr.length; i++){
            dateData.reservationTime[i] = timeFilterArr[i]
        }

        dateData.reservationTime.sort(function(a, b) {return a-b}); // 오름차순 정렬
        
        for(let i = 0; i < allData.reserveMovie.length - 1; i++) {  // reserveMovie.movieIdx 중복제거
            for(let j = i + 1; j < allData.reserveMovie.length; j++) {
                if(JSON.stringify(allData.reserveMovie[i].movieIdx) === JSON.stringify(allData.reserveMovie[j].movieIdx)) {
                    allData.reserveMovie.splice(j, 1);
                }
            }
        }
        for(let i = 0; i < allData.reserveMovie.length - 1; i++) {  // reserveMovie.movieIdx 중복제거
            for(let j = i + 1; j < allData.reserveMovie.length ; j++) {
                if(JSON.stringify(allData.reserveMovie[i].movieIdx) === JSON.stringify(allData.reserveMovie[j].movieIdx)) {
                    allData.reserveMovie.splice(j, 1);
                }
            }
        }
        for(let i = 0; i < allData.reserveMovie.length - 1; i++) {  // reserveMovie.movieIdx 중복제거
            for(let j = i + 1; j < allData.reserveMovie.length ; j++) {
                if(JSON.stringify(allData.reserveMovie[i].movieIdx) === JSON.stringify(allData.reserveMovie[j].movieIdx)) {
                    allData.reserveMovie.splice(j, 1);
                }
            }   
        }
    return allData;
}

module.exports = {
    getMain
}