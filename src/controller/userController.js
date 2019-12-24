const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const jwt = require('../library/jwt');

const userService = require('../service/userService');

async function postUser(req, res) {
    try {
        const user = await userService.postUser(req.body);
        console.log(user);
        response(res, returnCode.OK, '테스트 성공', user);
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

async function signIn(req, res) {
    try {    
        const idx = await userService.signIn(req.body);
        const token = jwt.sign(idx);

        response(res, returnCode.OK, '로그인 성공', token);
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

async function signUp(req, res) {
    try {
        if(await userService.signUp(req.body)) {
            response (res, returnCode.OK, '회원가입 성공');
        }
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

module.exports = {
    postUser,
    signIn,
    signUp
}