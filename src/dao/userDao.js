const mysql = require('../library/mysql');

const table = 'user';

/**
 * user 테이블에 insert하는 함수
 * 
 * @param {*} 
 * @param {*} userData 유저의 모든 정보 
 * 
 * @return 유저 정보 들어간거 성공
 */
async function insertUser(userData) {
    const fields = 'userId, userName, userSalt, userHash, userNickname, userImg, userAge, userComment, userLocation, userGender, userSelectGender, userSelectMinAge, userSelectMaxAge, userSchool, userMajor, userKakao';
    const values = [userData.id, userData.name, userData.salt, userData.hash, userData.nickname, userData.image, userData.age, userData.comment, userData.location, userData.gender, userData.selectGender, userData.selectMinAge, userData.selectMaxAge, userData.school, userData.major, userData.kakao];
    const insertUser = `INSERT INTO ${table} (${fields}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    return await mysql.query(insertUser, values);
}

/**
 * user 테이블에서 userId기준으로 선택하는 함수
 * 
 * @param {id, pw} userData 유저정보
 * 
 * @return 유저의 모든 정보
 */
async function selectUserById(userData) {
    const searchUser = `SELECT * FROM ${table} WHERE userId = ?`;
    const value = [userData.id];
    return await mysql.query(searchUser, value);
}


async function selectUserByEncryption(userSalt, userHash){
    const selectQuery = `SELECT * FROM user WHERE userSalt = ? AND userHash`;
    return await mysql.query(selectQuery, [userSalt, userHash])
    
}

async function selectUserByIdx(userIdx) {
    const selectQuery = `SELECT * FROM user WHERE userIdx = ?`;
    return await mysql.query(selectQuery, [userIdx]);
}

module.exports = {
    insertUser,
    selectUserById,
    selectUserByEncryption,
    selectUserByIdx
}