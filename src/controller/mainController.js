const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const { verify } = require('../library/jwt');

const mainService = require('../service/mainService');

async function getMain(req, res) {  
    try {
        const token = req.headers.authorization;
        const decoded = verify(token); // 토큰 확인용

        if(decoded < -1){ // 토큰이 정당하지 않을 경우
            errResponse(res, returnCode.UNAUTHORIZED, '정당하지 않은 토큰');    // invalid token (-2) expired token (-3)
        }

        const userIdx = decoded.idx;
        const main = await mainService.getMain(userIdx);

        if(!userIdx){
            errResponse(res, returnCode.BAD_REQUEST, '존재하지 않은 유저');
        }

        response(res, returnCode.OK, '메인화면 조회 성공', main);

    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

module.exports = {
    getMain
}
