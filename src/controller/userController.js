const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');

const userService = require('../service/userService');

async function signIn(req, res) {
    try {
        const token = await userService.signIn(req.body);
        if(token == -1) {
            response(res, returnCode.BAD_REQUEST, '아이디가 없습니다');
        } else if (token == -2) {
            response(res, returnCode.UNAUTHORIZED, '비밀번호가 틀립니다');
        } else {
            response(res, returnCode.OK, '로그인 성공', token);
        }
    } catch (error) {
            console.log(error);
            errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

async function signUp(req, res) {
    try {
        const image = req.files[0].location;
        req.body['image'] = image;
        const user = await userService.signUp(req.body)
        if(user == -1) {
            response(res, returnCode.BAD_REQUEST, '회원가입실패');
        } else {
            response(res, returnCode.OK, '회원가입성공');
        }
    } catch (error) {
        console.log(error);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

module.exports = {
    signIn,
    signUp
}