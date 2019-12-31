const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');

const { verify } = require('../library/jwt');

const movieService = require('../service/movieService');

async function getMovie(req, res) {
    try {
        const movieReleaseStatus = req.params.movieReleaseStatus;
        const movie = await movieService.getMovie(movieReleaseStatus);

        if(movieReleaseStatus == 0 || movieReleaseStatus == 1){  
            response(res, returnCode.OK, '영화 조회 성공', movie);
        }
        else{
            errResponse(res, returnCode.BAD_REQUEST, '올바르지 않은 요청'); // 올바르지 않은 요청일 경우
        } 

    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}


async function postMovie(req, res) {    // userIdx를 받아 영화선택 후 userIdx에 영화 값 넣기
    try {
        const token = req.headers.authorization;
        const decoded = verify(token); 
        const movieData = req.body; // movieData

        const movieIdx = req.body.movieIdx;
        const reservationTime = req.body.reservationTime;
        const reservationDate = req.body.reservationDate;

        if(decoded < -1) {    // invalid token, expired token
            errResponse(res, returnCode.UNAUTHORIZED, '정당하지 않은 토큰');
        }

        const userIdx = decoded.idx;    // userIdx
        const movie = await movieService.postMovie(userIdx, movieData);

        if(!movieIdx || !reservationTime || !reservationDate){
            errResponse(res, returnCode.BAD_REQUEST, '올바르지 않은 요청');
        }

        if(movie == -1){    // movieService에서 제대로 값을 받지 못했을 경우
            errResponse(res, returnCode.BAD_REQUEST, '영화 선택 실패');
        }
            response(res, returnCode.OK, '영화 선택 성공');

    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

async function putMovie(req, res) {
    /* 
    1. userIdx 받고 예약한 영화정보 가져오기 t_reservation, t_reservationSchedule
    2. 새로 받은 값으로 table에 UPDATE
    */
    try {
        const token = req.headers.authorization;
        const decoded = verify(token); 
        const movieData = req.body; // movieData 확인용

        const movieIdx = req.body.movieIdx;
        const reservationIdx = req.body.reservationIdx;
        const reservationTime = req.body.reservationTime;
        const reservationDate = req.body.reservationDate;

        if(decoded < -1) {    // invalid token, expired token
            errResponse(res, returnCode.UNAUTHORIZED, '정당하지 않은 토큰');
        }

        const userIdx = decoded.idx;    // userIdx
        const movie = await movieService.putMovie(userIdx, movieData);

        if(!movieIdx || !reservationIdx || !reservationTime || !reservationDate){
            errResponse(res, returnCode.BAD_REQUEST, '올바르지 않은 요청');
        }

        if(movie == -1){    // movieService에서 제대로 값을 수정하지 못했을 경우
            errResponse(res, returnCode.BAD_REQUEST, '영화 수정 실패');
        }
            response(res, returnCode.OK, '영화 수정 성공');

    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

module.exports = {
    getMovie,
    postMovie,
    putMovie
}