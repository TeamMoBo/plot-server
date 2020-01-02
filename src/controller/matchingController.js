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
        const matchingResult = await matchingService.getMatching(req.headers.authorization);

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

async function postMatchingConfirm(req, res) {
    try {
        const matchingResult = await matchingService.postMatchingConfirm(req.headers.authorization, req.body.reply);
        if(matchingResult == -1) {
            console.log('매칭 거부');
            response(res, returnCode.ACCEPTED, '매칭 실패');    
        } else if(matchingResult == -2) {
            console.log('토큰 오류');
            errResponse(res, returnCode.UNAUTHORIZED, '토큰 오류');
        } else if(matchingResult == -3) {
            console.log('시간 초과');
            response(res, returnCode.BAD_REQUEST, '시간 초과');    
        } else if(matchingResult == -4){
            console.log('요청 양식 오류');
            response(res, returnCode.BAD_REQUEST, '요청 양식 오류');    
        } else {
            console.log('매칭 승인');
            response(res, returnCode.OK, '매칭 승인');
        }
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

async function postMatchingDecision(req, res) {
    try {
        const matchingResult = await matchingService.postMatchingDecision(req.headers.authorization, req.body.decision);

        if(matchingResult == -1) {
            console.log('매칭 거절');
            response(res, returnCode.ACCEPTED, '매칭 실패');    
        } else if(matchingResult == -2) {
            console.log('토큰 오류');
            errResponse(res, returnCode.UNAUTHORIZED, '토큰 오류');
        } else if(matchingResult == -4){
            console.log('요청 양식 오류');
            response(res, returnCode.BAD_REQUEST, '요청 양식 오류');    
        } else if(matchingResult == -5){
            console.log('매칭이 존재하지 않을 경우');
            response(res, returnCode.BAD_REQUEST, '매칭이 존재하지 않습니다');
        } else {
            console.log('매칭 승인');
            response(res, returnCode.OK, '매칭 승인');
        }
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

async function getMatchingAddress(req, res) {
    try {
        const matchingResult = await matchingService.getMatchingAddress(req.headers.authorization);

        if(matchingResult == -1) {
            console.log('토큰 오류');
            errResponse(res, returnCode.UNAUTHORIZED, '토큰 오류');
        } else if(matchingResult == -2) {
            console.log('시간 초과');
            errResponse(res, returnCode.BAD_REQUEST, '시간 초과');
        } else if(matchingResult == -3) {
            console.log('채팅 거절');
            errResponse(res, returnCode.BAD_REQUEST, '채팅 거절');
        } else if(matchingResult == - 4){   // 오늘 날짜의 매칭이 없거나 userIdx가 매칭되지 않았을 경우
            console.log('매칭이 존재하지 않습니다');
            errResponse(res, returnCode.BAD_REQUEST, '매칭이 존재하지 않습니다');
        }
            console.log('주소 요청 성공');
            response(res, returnCode.OK, '주소 요청 성공', matchingResult);
    } catch (error) {
        console.log(error);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

async function matchingAlgorithm(req, res) {
    try {
        const matchingResult = await matchingService.matchingAlgorithm();
        response(res, returnCode.OK, '매칭 생성', matchingResult);
    } catch(error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

async function deleteMatchingAlgorithm(req, res) {
    try {
        const matchingResult = await matchingService.deleteMatchingAlgorithm();
        response(res, returnCode.OK, '매칭 삭제', matchingResult);
    } catch(error) {
        console.log(error);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오444444류');
    }
}

module.exports = {
    getMatching,
    postMatchingConfirm,
    postMatchingDecision,
    getMatchingAddress,
    matchingAlgorithm,
    deleteMatchingAlgorithm
}