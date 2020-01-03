const movieDao = require('../dao/movieDao');
const moment = require('moment');

/*
1. 영화 널값인지 확인
2. condition 0, 1로 현재상영작, 개봉예정작 구분하기
3. 이미지, 이름, 별점
*/

async function getOrderMovie(movieReleaseStatus) {
    const movieData = {
        "movieReleaseStatus" : 0,
        "movieData" : []
    };

    if(movieReleaseStatus == 0){    // 현재 상영작
        const currentMovieData = await movieDao.selectCurrentMovie();
        movieData.movieReleaseStatus = currentMovieData[0].movieReleaseStatus;

        for(let i = 0; i<currentMovieData.length; i++){
            let movieArr = {
                "movieIdx" : 0,
                "movieName" : "",
                "movieScore" : 0,
                "movieImg" : ""
            }
            movieArr.movieIdx = currentMovieData[i].movieIdx;
            movieArr.movieName = currentMovieData[i].movieName;
            movieArr.movieScore = currentMovieData[i].movieScore;
            movieArr.movieImg = currentMovieData[i].movieImg;
            movieData.movieData.push(movieArr);
        }
    }

    if(movieReleaseStatus == 1){    // 개봉 예정작
        const futureMovieData = await movieDao.selectFutureMovie();
        movieData.movieReleaseStatus = futureMovieData[0].movieReleaseStatus;

        for(let i = 0; i<futureMovieData.length; i++){
            let movieArr = {
                "movieIdx" : 0,
                "movieName" : "",
                "movieScore" : 0,
                "movieImg" : ""
            }
            movieArr.movieIdx = futureMovieData[i].movieIdx;
            movieArr.movieName = futureMovieData[i].movieName;
            movieArr.movieScore = futureMovieData[i].movieScore;
            movieArr.movieImg = futureMovieData[i].movieImg;
            movieData.movieData.push(movieArr);
        }
    }
    return movieData;
}


async function getReserveMovie(userIdx) {
    const selectMovieResult = await movieDao.selectMovieReserveMovie(userIdx);
    const selectTimeResult = await movieDao.selectMovieReserveDate(userIdx);

    console.log(selectMovieResult)
    // console.log(selectTimeResult)

    const movieData = {
        "reservationIdx" : 0,
        "userIdx" : 0,
        "movieIdx" : [],
        "reserveInfo" : []
    };
        
    movieData.reservationIdx = selectMovieResult[0].reservationIdx;
    movieData.userIdx = userIdx;

    // movie filtering
    let movieLength = Object.keys(selectMovieResult);
    let movieArr = [];

    for(let i = 0; i<movieLength.length; i++){
        movieArr.push(selectMovieResult[i].movieIdx);
    }

    let movieFilterArr = movieArr.filter((item, idx, array) =>{
        return array.indexOf(item) === idx;
    });

    for(let i = 0; i<movieFilterArr.length; i++){
        movieData.movieIdx.push(movieFilterArr[i])
    }

    const dateLength = Object.keys(selectTimeResult) // idx.length
    let duplicationDateValue = selectTimeResult[0].reservationDate;  // 중복확인 value
    let duplicationTimeValue = selectTimeResult[0].reservationTime;

    let dateData = {
        "reservationDate" : "",
        "reservationTime" : []
    };

    for(let i = 0; i<dateLength.length; i++){
        if(i == 0){
            dateData.reservationDate = selectTimeResult[0].reservationDate;
            dateData.reservationTime.push(selectTimeResult[0].reservationTime);
            movieData.reserveInfo.push(dateData);
            continue;
        }

        if(selectTimeResult[i].reservationDate == duplicationDateValue){ // 중복확인, 중복일 경우
            if(duplicationTimeValue != selectTimeResult[i].reservationTime){
                dateData.reservationTime.push(selectTimeResult[i].reservationTime)   // time push
                duplicationTimeValue = selectTimeResult[i].reservationTime;
            }
        } else {    // 중복이 아닐 경우, reservationDate new value
            dateData = {    // dateData Initialization
                "reservationDate" : "",
                "reservationTime" : []
            }
            dateData.reservationDate = selectTimeResult[i].reservationDate;
            duplicationDateValue = selectTimeResult[i].reservationDate;
            movieData.reserveInfo.push(dateData);
        }
    }


    // time filtering
    // let timeLength = Object.keys(selectTimeResult);
    // let timeArr = [];

    // for(let j = 0; j<timeLength.length; j++){
    //     timeArr.push(selectTimeResult[j].reservationTime);
    // }

    // let timeFilterArr = timeArr.filter((item, idx, array) =>{
    //     return array.indexOf(item) === idx;
    // });

    // for (let j = 0; j<timeFilterArr.length; j++){
    //     movieData.reservationTime.push(timeFilterArr[j])
    // }
    return movieData;
}

/* 
1. 인풋 널값인지 확인
2. 최소 몇개 이상 선택해야 하는 것
*/
async function postMovie(userIdx, movieData) {
    if(movieData.reservationTime.length < 3){   // reservationTime을 3개 이상 받지 않았을 경우 = -4
        return -1;
    }

    const weekdayArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];  /// weekday data set
    const weekday = weekdayArr[new Date(movieData.reservationDate).getDay()];
    
    const reservationResult = await movieDao.insertReservation(userIdx, movieData, weekday);
    const reservationIdx = reservationResult.insertId;

    if(!reservationResult){ // 쿼리가 제대로 수행되지 않았을 경우
        return -4;
    }

    const idxLength = Object.keys(movieData.movieIdx);
    const timeLength = Object.keys(movieData.reservationTime);
    
    for(let i = 0; i<idxLength.length; i++){
        const movieResult = await movieDao.insertReservationMovie(reservationIdx, movieData.movieIdx[i]);

        if(!movieResult){   // 쿼리가 제대로 수행되지 않았을 경우
            return -4;
        }
    }

    for(let i = 0; i<timeLength.length; i++){
        const timeResult = await movieDao.insertReservationTime(reservationIdx, movieData.reservationTime[i]);

        if(!timeResult){    // 쿼리가 제대로 수행되지 않았을 경우
            return -4;
        }
    }
    return 0;
}


async function putMovie(userIdx, movieData) {
    if(movieData.reservationTime.length < 3){   // reservationTime을 3개 이상 받지 않았을 경우 = -4
        return -1;
    }

    const weekdayArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];  /// weekday data set
    const weekday = weekdayArr[new Date(movieData.reservationDate).getDay()];
    
    const reservationResult = await movieDao.updateReservation(movieData, weekday, userIdx);

    if(!reservationResult){ // 쿼리가 제대로 수행되지 않았을 경우
        return -4;
    }

    // body가 더 많을경우 INSERT도 해야함,, 없으면 DELETE? UPDATE = 0?

    const idxLength = Object.keys(movieData.movieIdx);
    const timeLength = Object.keys(movieData.reservationTime);
    
    for(let i = 0; i<idxLength.length; i++){
        const movieResult = await movieDao.insertReservationMovie(reservationIdx, movieData.movieIdx[i]);

        if(!movieResult){   // 쿼리가 제대로 수행되지 않았을 경우
            return -4;
        }
    }

    for(let i = 0; i<timeLength.length; i++){
        const timeResult = await movieDao.insertReservationTime(reservationIdx, movieData.reservationTime[i]);

        if(!timeResult){    // 쿼리가 제대로 수행되지 않았을 경우
            return -4;
        }
    }
    return 0;
}

module.exports = {
    getOrderMovie,
    getReserveMovie,
    postMovie,
    putMovie
}