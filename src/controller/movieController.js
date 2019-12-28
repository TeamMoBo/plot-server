const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');

const movieService = require('../service/movieService');

async function getMovie(req, res) {
    try {
        const movieReleaseStatus = req.params.movieReleaseStatus;
        const movie = await movieService.getMovie(movieReleaseStatus);
        console.log(movieReleaseStatus);

        if(movieReleaseStatus == 0 || movieReleaseStatus == 1){  // 올바르지 않은 요청일 경우
            response(res, returnCode.OK, '영화 조회 성공', movie);
        }
        else { 
            errResponse(res, returnCode.BAD_REQUEST, '올바르지 않은 요청');
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
        const userIdx = decoded.idx;    // userIdx
        const movieData = req.body; // movieData

        const movie = await movieService.postMovie(userIdx);
        console.log(movie);

        if(decoded < -1) {    // invalid token, expired token
            errResponse(res, returnCode.UNAUTHORIZED, '정당하지 않은 토큰');
        }
        else {
            response(res, returnCode.OK, '영화 선택 성공', movie);
        }
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

module.exports = {
    getMovie,
    postMovie
}