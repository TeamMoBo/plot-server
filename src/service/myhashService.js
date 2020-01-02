const userDao = require("../dao/hashtagDao");
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

async function putHash(token, charmingTag) {
  const userIdx = verify(token).idx;
  const userData = await userDao.selectUserByIdx(userIdx);
  if (userData.length == 0) {
    return -1;
  } else {
        const arrayAttractPoint = charmingTag.split('#').map(it => it.trim()).filter(word => word.length > 0);
        console.log(arrayAttractPoint);
        Promise.all(arrayAttractPoint.map((hashtagName) => {
          hashtagDao.updateCharmingTagByUserIdx()
        }))
        async function insertHashTag(hashtagType, userIdx, hashtag) {
          Promise.all(hashtagType.map((hashtagName) => {
              hashtagDao.insertHashtag({hashtagName, hashtag, userIdx});
          }))
  }
        const putHashtagResult = await hashtagDao.updateCharmingTagByUserIdx(useIdx,)
    }
  
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
