const hashtagDao = require("../dao/hashtagDao");
const { response, errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");
const { verify } = require("../library/jwt");

async function getHash(token) {
  const userIdx = verify(token).idx;
  console.log("해시태그 받는 부분");
  const getHashData = await hashtagDao.selectCharmingTagByUseridx(userIdx);
  const charmData = {
    attractPointTagName: getHashData.map(it => it.attractPointTagName)
  };
  //return getHashData;
  return charmData;
}

async function putHash(userIdx, body) {
  const putHashData = await hashtagDao.updateCharmingTagByUserIdx(
    userIdx,
    body
  );
  console.log("수정 해시태그 부분");
  return putHashData;
}

module.exports = {
  getHash,
  putHash
};

/** 
동일한 방법1
const genreData = {
  preferGenreTagName: mypageHashGenre.map(it => it.preferGenreTagName)
};

동일한 방법2
for (let i = 0; i < mypageHashGenre.length; i++) {
  genreData.preferGenreTagName.push(mypageHashGenre[i].preferGenreTagName);
}
*/
