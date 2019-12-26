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
            errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 내부 에러');
    }
}

async function signUp(req, res) {
    try {
        const image = req.files[0].location;
        req.body["image"] = image;
        const check = await userService.signUp(req.body)
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

// async function signUpImg(req, res) {
//     try {
//         const image = req.files[0].location;
//         const check = await userService.signUpImg({image});
//         if(check == -1) {
//             response(res, returnCode.BAD_REQUEST, '데이터가 부족합니다')
//         } else {
//             response(res, returnCode.OK, '이미지 등록 성공');
//         }
//     } catch (error) {
//         console.log(err);
//         errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 내부 에러');
//     }
// }

module.exports = {
    signIn,
    signUp,
    // signUpImg
}