const mysql = require('../library/mysql');

const table = 'hashtag';

async function insertHashtag(hashtag) {
    const fields = `hashtagName, hashtagType, userIdx`;
    const values = [hashtag.hashtagName, hashtag.hashtag, hashtag.userIdx];
    const insertHashtag = `INSERT INTO ${table} (${fields}) VALUES (?, ?, ?);`;

    return await mysql.query(insertHashtag, values);
}

module.exports = {
    insertHashtag
}