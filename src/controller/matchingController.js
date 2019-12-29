const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');

const matchingService = require("../service/matchingService");

/**
 * 매칭 페이지
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function getMatching(req, res) {
    try {
        const matchingResult = await matchingService.getMatching(req.headers.token);

        if(matchingResult == -1) {
            console.log('매칭 실패');
            response(res, returnCode.ACCEPTED, '매칭 실패');    
        } else if(matchingResult == -2) {
            console.log('토큰 오류');
            errResponse(res, returnCode.UNAUTHORIZED, '토큰 오류');
        } else if(matchingResult == -3) {
            console.log('시간 초과');
            response(res, returnCode.BAD_REQUEST, '시간 초과');    
        } else {
            console.log('매칭 성공');
            response(res, returnCode.OK, '매칭 성공', matchingResult);
        }
    
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

// async function postMatchingConfirm(req, res) {
//     try {
//         const matchingResult = await matchingService.postMatchingConfirm(req.headers.authorization, req.body.reply);
//         if(matchingResult == -1) {
//             console.log('매칭 거부');
//             response(res, returnCode.ACCEPTED, '매칭 실패');    
//         } else if(matchingResult == -2) {
//             console.log('토큰 오류');
//             errResponse(res, returnCode.UNAUTHORIZED, '토큰 오류');
//         } else if(matchingResult == -3) {
//             console.log('시간 초과');
//             response(res, returnCode.BAD_REQUEST, '시간 초과');    
//         } else {
//             console.log('매칭 승인');
//             response(res, returnCode.OK, '매칭 승인');
//         }
//     } catch (error) {
//         console.log(error.message);
//         errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
//     }
// }

module.exports = {
    getMatching,
    // postMatchingConfirm
}