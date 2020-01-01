const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');

const { verify } = require('../library/jwt');

const movieService = require('../service/movieService');

async function getOrderMovie(req, res) {
    try {
        const movieReleaseStatus = req.params.movieReleaseStatus;
        const movie = await movieService.getOrderMovie(movieReleaseStatus);

        if(!movieReleaseStatus){    // input null
            errResponse(res, returnCode.BAD_REQUEST, '올바르지 않은 요청'); // 올바르지 않은 요청일 경우
        }

        if(movieReleaseStatus == 0 || movieReleaseStatus == 1){  
            response(res, returnCode.OK, '영화 조회 성공', movie);
        }
        else {
            errResponse(res, returnCode.BAD_REQUEST, '올바르지 않은 요청'); // 올바르지 않은 요청일 경우
        } 

    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}


async function getReserveMovie(req, res) {
    try {
        const token = req.headers.authorization;
        const decoded = verify(token);

        if(decoded < -1){
            errResponse(res, returnCode.UNAUTHORIZED, '정당하지 않은 토큰');
        }

        const userIdx = decoded.idx;
        const movie = await movieService.getReserveMovie(userIdx);

        if(!movie){    // fail input data
            errResponse(res, returnCode.BAD_REQUEST, '올바르지 않은 요청'); // 올바르지 않은 요청일 경우
        }
            response(res, returnCode.OK, '영화 조회 성공', movie);

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

        const movieIdx = req.body.movieIdx; // array
        const reservationTime = req.body.reservationTime;   // array
        const reservationDate = req.body.reservationDate;

        if(decoded < -1) {    // invalid token, expired token
            errResponse(res, returnCode.UNAUTHORIZED, '정당하지 않은 토큰');
        }

        if(!movieIdx || !reservationTime || !reservationDate){
            errResponse(res, returnCode.BAD_REQUEST, '올바르지 않은 요청');
        }

        const userIdx = decoded.idx;    // userIdx
        const movie = await movieService.postMovie(userIdx, movieData);

        if(movie == -4){    // movieService에서 제대로 값을 받지 못했을 경우
            errResponse(res, returnCode.BAD_REQUEST, '영화 선택 실패');
        }

        if(movie == -1){    // reservationTime을 3개이상 받지 못했을 경우
            errResponse(res, returnCode.BAD_REQUEST, '선택한 시간이 3개 미만입니다');
        }
            response(res, returnCode.OK, '영화 선택 성공');

    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

async function putMovie(req, res) {
    try {
        const token = req.headers.authorization;
        const decoded = verify(token); 
        const movieData = req.body; // movieData

        const movieIdx = req.body.movieIdx; // array
        const reservationTime = req.body.reservationTime;   // array
        const reservationDate = req.body.reservationDate;

        if(decoded < -1) {    // invalid token, expired token
            errResponse(res, returnCode.UNAUTHORIZED, '정당하지 않은 토큰');
        }

        if(!movieIdx || !reservationTime || !reservationDate){
            errResponse(res, returnCode.BAD_REQUEST, '올바르지 않은 요청');
        }

        const userIdx = decoded.idx;    // userIdx
        const movie = await movieService.putMovie(userIdx, movieData);

        if(movie == -4){    // movieService에서 제대로 값을 받지 못했을 경우
            errResponse(res, returnCode.BAD_REQUEST, '영화 수정 실패');
        }

        if(movie == -1){    // reservationTime을 3개이상 받지 못했을 경우
            errResponse(res, returnCode.BAD_REQUEST, '선택한 시간이 3개 미만입니다');
        }
            response(res, returnCode.OK, '영화 수정 성공');

    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

module.exports = {
    getOrderMovie,
    getReserveMovie,
    postMovie,
    putMovie
}