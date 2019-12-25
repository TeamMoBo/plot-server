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
        console.log(idx);
        if(idx == -1) {
            response(res, returnCode.UNAUTHORIZED, '아이디가 없습니다');
        } else if (idx == -2) {
            response(res, returnCode.UNAUTHORIZED, '비밀번호가 틀립니다');
        } else {
            const token = jwt.sign(idx);
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
        const {id, name, password, nickName, age, comment, location} = req.body;
        console.log(req.file);
        console.log(req.body);
        const user = await userService.signUp({id, name, password, nickName, image, age, comment, location})
        if(user.length <= 0) {
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
    postUser,
    signIn,
    signUp
}