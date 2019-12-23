const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');

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

module.exports = {
    postUser
}