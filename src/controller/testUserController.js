const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");
const { verify, sign } = require("../library/jwt");
const encryption = require('../library/encryption');
const userDao = require('../dao/userDao');
const hashtagDao = require('../dao/hashtagDao');


async function login(req, res) {
    try {
        const users = await userDao.selectUser(req.body);
        if(!req.body) {
            errResponse(res, returnCode.BAD_REQUEST, "데이터 입력해주세요");
        }
        const hashedPassword = await encryption.notSaltEncrypt(req.body.password, users[0].userSalt);
        
        if(users.length <= 0){
            errResponse(res, returnCode.BAD_REQUEST, "아이디가 없습니다")
        } else if (hashedPassword != users[0].userHash) {
            errResponse(res, returnCode.UNAUTHORIZED, "비밀번호가 틀립니다")
        } else {
            token = sign(users[0].userIdx);
            response(res, returnCode.OK, "로그인 성공", token);
        }
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}

//id, password만 입력하면 자동 가입
const userDummyData = {
    name : "김민진",
    nickname : "Min",
    image : "https://user-images.githubusercontent.com/30704569/71476753-0375a300-282a-11ea-9d17-80d1e7844d02.png",
    age : 22,
    comment : "신승민 화이팅",
    location : "신촌",
    selectGender : "남성",
    selectMinAge: "10",
    selectMaxAge: "49",
    school : "서울대",
    major : "컴퓨터공학과",
    kakao : "facebook",
    preferGenre: "바보,멍청이,말미잘",
    attractPoint: "똥개,개똥,똥",
    myLikes: "멍,멍,멍"

}

async function signup(req, res) {
    try {
        const encryptionData = await encryption.encrypt(req.body.password);
        const userSalt = encryptionData.salt;
        const userHash = encryptionData.hashPassword; 
        userDummyData['id'] = req.body.id;
        userDummyData['salt'] = userSalt;
        userDummyData['hash'] = userHash;

        const alreadyUser = await userDao.selectUser(req.body);
        if(!req.body.id) {
            errResponse(res, returnCode.BAD_REQUEST, '데이터가 부족합니다.');
        } else if (!(alreadyUser.length <= 0)) {
            errResponse(res, returnCode.BAD_REQUEST, '아이디가 존재합니다');
        } else {
            await userDao.insertUser(userDummyData);
            
            response(res, returnCode.OK, '회원가입 성공');
        }
    } catch(error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}

module.exports = {
    login,
    signup
};