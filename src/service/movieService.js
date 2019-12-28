const movieDao = require('../dao/movieDao');

const { verify } = require('../library/jwt');
/*
1. 영화 널값인지 확인
2. switch 0, 1로 현재상영작, 개봉예정작 구분하기
3. 이미지, 이름, 별점
*/

async function getMovie(movieReleaseStatus) {
    const movieData = await movieDao.selectMovie(movieReleaseStatus);
    
    if(!movieReleaseStatus){  // 입력 값이 null일 경우
        return -1;
    }
    
    return movieData;
}


/* 
1. 인풋 널값인지 확인
2. 최소 몇개 이상 선택해야 하는 것
*/
async function postMovie(token, AllData) {
    const userIdx = verify(token).idx;
    const movieData = await movieDao.insertMovie(userIdx, AllData);

    if(!AllData){    // 입력 값이 null일 경우
        return -1;
    }
    
    return movieData;
}

module.exports = {
    getMovie,
    postMovie
}