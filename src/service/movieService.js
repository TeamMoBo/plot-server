const movieDao = require('../dao/movieDao');

/*
1. 영화 널값인지 확인
2. condition 0, 1로 현재상영작, 개봉예정작 구분하기
3. 이미지, 이름, 별점
*/

async function getMovie(movieReleaseStatus) {
    const movieData = await movieDao.selectMovie(movieReleaseStatus);
    
    if(!movieData){  // 입력 값이 null일 경우
        return -1;
    }
    
    return movieData;
}

/* 
1. 인풋 널값인지 확인
2. 최소 몇개 이상 선택해야 하는 것
*/
async function postMovie(userIdx, movieData) {
    const infoData = await movieDao.insertMovie(userIdx, movieData);

    console.log(infoData)
    if(!infoData){    // 입력 값이 null일 경우
        return -1;
    }
    return infoData;
}

async function putMovie(userIdx, movieData) {
    const infoData = await movieDao.updateMovie(userIdx, movieData);

    console.log(infoData)
    if(!infoData){    // 입력 값이 null일 경우
        return -1;
    }
    return infoData;
}

module.exports = {
    getMovie,
    postMovie,
    putMovie
}