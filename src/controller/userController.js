

const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");
const userService = require("../service/userService");
const jwt = require("../library/jwt");



/**
 * 로그인
 * 
 * @param {*} req 사용자 ID, PW
 * @param {*} res
 * 
 * @response 로그인 실패 메세지 - 아이디가 없음
 * @response 로그인 실패 메세지 - 비밀번호가 틀림
 * @response token 로그인 성공 메세지 - 토큰
 */
async function postUserSignIn(req, res) {
    try {
        const token = await userService.postUserSignIn(req.body);
        if(token == -1) {
            response(res, returnCode.BAD_REQUEST, '아이디가 없습니다');
        } else if (token == -2) {
            response(res, returnCode.UNAUTHORIZED, '비밀번호가 틀립니다');
        } else {
            response(res, returnCode.OK, '로그인 성공', token);
        }
    } catch (error) {
            console.log(error);
            errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 내부 에러');
    }
}

/**
 * 회원가입
 * 
 * @param req 사용자 정보들
 * @param res
 * 
 * @response 데이터가 부족합니다
 * @response 아이다가 존재합니다
 * @response 회원가입 성공 
 */
async function postUserSignUp(req, res) {
    try {
        const image = req.files[0].location;
        req.body["image"] = image;
        const check = await userService.postUserSignUp(req.body)
        if(check == -1) {
            response(res, returnCode.BAD_REQUEST, '데이터가 부족합니다');
        } else if (check == -2) {
            response(res, returnCode.BAD_REQUEST, '아이디가 존재합니다');
        } else {
            response(res, returnCode.OK, '회원가입성공');
        }
    } catch (error) {
        console.log(error);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 내부 에러');
    }
}

module.exports = {
    postUserSignIn,
    postUserSignUp
}



