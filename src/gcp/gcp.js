const moment = require('moment');

const { pad } = require('../library/pad');
const gcpAuth = require('../library/gcpAuth');
const encryption = require('../library/encryption');

const userDao = require('../dao/userDao');

const hashingSalt = require('../../config/hashing.json');

async function insertFbUser(userIdx) {

    // const userIdx = 30;
    // console.log(userIdx);
    const userData = await userDao.selectUserByIdx(userIdx);
    let uid = await encryption.notSaltEncrypt(userData[0].userId, hashingSalt);
    
    const parsedUserData = {
        profileImageUrl : userData[0].userImg,
        uid : uid.replace(/\//gi, '').substring(0,30),
        userName : userData[0].userName
    }

    return await writeUserData(parsedUserData.uid, parsedUserData);
}

async function writeUserData(uid, userData) {
    const db = gcpAuth.gcpAuth();
    const dbFind = await db.ref('users/' + uid).once('value').then((snapshot) => {
        return snapshot.val();
    })
    
    if(dbFind){
        return dbFind.uid;
    } else {
        db.ref('users/' + uid).set(userData);
        return uid;
    }
    
}

async function makeChatRoom(leftUserIdx, rightUserIdx) {
    const userLeftData = await userDao.selectUserByIdx(leftUserIdx);
    const userRightData = await userDao.selectUserByIdx(rightUserIdx);
    const leftUid = await encryption.notSaltEncrypt(userLeftData[0].userId, hashingSalt);
    const rightUid = await encryption.notSaltEncrypt(userRightData[0].userId, hashingSalt);
    
    const chatRoomId = moment().format('x') + leftUid.replace(/\//gi, '').substring(0,5) + rightUid.replace(/\//gi, '').substring(0,5);
    return chatRoomId;
}


module.exports = {
    insertFbUser,
    makeChatRoom
}

