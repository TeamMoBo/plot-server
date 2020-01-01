const mysql = require("../library/mysql");

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
  const hashtagName = hashtag.hashtag + "Name";
  console.log(hashtagName);
  const fields = `${hashtagName}, userIdx`;
  const values = [hashtag.hashtagName, hashtag.userIdx];
  // console.log(hashtag.hashtagName);
  const insertHashtag = `INSERT INTO ${table} (${fields}) VALUES (?, ?)`;
  // console.log(fields);
  // console.log(values);
  return await mysql.query(insertHashtag, values);
}

async function selectGenreTagByUseridx(userIdx) {
  const selectQuery = `SELECT * FROM preferGenreTag WHERE userIdx = ? ORDER BY 3`;
  return await mysql.query(selectQuery, [userIdx]);
}

async function selectCharmingTagByUseridx(userIdx) {
  const selectQuery = `SELECT * FROM attractPointTag WHERE userIdx = ? ORDER BY 3`;
  return await mysql.query(selectQuery, [userIdx]);
}

async function selectFavorTagByUserIdx(userIdx) {
  const selectQuery = `SELECT * FROM favorTag WHERE userIdx = ? ORDER BY 3`;
  return await mysql.query(selectQuery, [userIdx]);
}

async function updateCharmingTagByUserIdx(userIdx, userData) {
  //해시태그 디비 수정
  const updateQuery = `UPDATE attractPointTag SET attractPointTagName = ? WHERE userIdx = ?`;
  return await mysql.query(updateQuery, [
    userData.attractPointTagName,
    userIdx
  ]);
}

module.exports = {
  insertHashtag,
  selectGenreTagByUseridx,
  selectCharmingTagByUseridx,
  selectFavorTagByUserIdx,
  updateCharmingTagByUserIdx
};
