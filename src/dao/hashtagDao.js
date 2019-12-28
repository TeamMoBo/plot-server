const mysql = require('../library/mysql');


/**
 * 디비에 해시태그 넣는 함수
 * 
 * @param {*} hashtag 해시태그 정보
 * 
 * @return 해시태그 성공정보
 */
async function insertHashtag(hashtag) {
    const table = hashtag.hashtag;
    // console.log(table);
    const hashtagName = hashtag.hashtag + 'Name';
    console.log(hashtagName);
    const fields = `${hashtagName}, userIdx`;
    const values = [hashtag.hashtagName, hashtag.userIdx];
    // console.log(hashtag.hashtagName);
    const insertHashtag = `INSERT INTO ${table} (${fields}) VALUES (?, ?)`;
    // console.log(fields);
    // console.log('----------');
    // console.log(values);
    return await mysql.query(insertHashtag, values);
}

module.exports = {
    insertHashtag
}