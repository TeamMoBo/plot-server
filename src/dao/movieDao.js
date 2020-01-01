const mysql = require("../library/mysql");

// 예매율 TOP10 영화조회(현재상영작,개봉예정작)
async function selectCurrentMovie() {
  const selectCurrentSql = `SELECT movieIdx, movieReleaseStatus, movieName, movieScore, movieImg, movieReserveRate 
    FROM movie WHERE movieReleaseStatus = 0 ORDER BY movieReserveRate DESC LIMIT 10`;
  return await mysql.query(selectCurrentSql);
}
async function selectFutureMovie() {
  const selectFutureSql = `SELECT movieIdx, movieReleaseStatus, movieName, movieScore, movieImg, movieReserveRate 
    FROM movie WHERE movieReleaseStatus = 1 ORDER BY movieReserveRate DESC LIMIT 10`;
  return await mysql.query(selectFutureSql);
}

async function selectMovieReserveMovie(userIdx) {
  // 예매한 영화 조회
  const selectReserveSql = `SELECT reservation.userIdx, reservationMovie.movieIdx, reservation.reservationIdx
    FROM reservationMovie JOIN reservation 
    ON reservationMovie.reservationIdx = reservation.reservationIdx WHERE userIdx = ?`;
  return await mysql.query(selectReserveSql, [userIdx]);
}

async function selectMovieReserveDate(userIdx) {
  // 예매한 시간조회
  const selectTimeSql = `SELECT reservationDate, reservationTime
    FROM reservation JOIN reservationHour 
    ON reservation.reservationIdx = reservationHour.reservationIdx WHERE userIdx = ?`;

  return await mysql.query(selectTimeSql, [userIdx]);
}

async function insertReservation(userIdx, movieData, weekday) {
  // 예약 idx 선택
  const insertReserveSql = `INSERT INTO reservation (userIdx, reservationDate, reservationWeekday) VALUES (?, ?, ?)`;
  return await mysql.query(insertReserveSql, [
    userIdx,
    movieData.reservationDate,
    weekday
  ]);
}
async function insertReservationMovie(reservationIdx, movieIdx) {
  // 예약영화 선택
  const insertMovieSql = `INSERT INTO reservationMovie (reservationIdx, movieIdx) VALUES (?, ?)`;
  return await mysql.query(insertMovieSql, [reservationIdx, movieIdx]);
}
async function insertReservationTime(reservationIdx, reservationTime) {
  // 예약시간 선택
  const insertTimeSql = `INSERT INTO reservationHour (reservationIdx, reservationTime) VALUES (?, ?)`;
  return await mysql.query(insertTimeSql, [reservationIdx, reservationTime]);
}

async function updateReservation(movieData, weekday, userIdx) {
  // 예약 idx 수정
  const updateReserveSql = `UPDATE reservation SET reservationDate = ?, reservationWeekday = ? WHERE userIdx = ?`;
  return await mysql.query(updateReserveSql, [
    movieData.reservationDate,
    weekday,
    userIdx
  ]);
}
async function updateReservationMovie(movieIdx, reservationIdx) {
  // 예약영화 수정
  const updateMovieSql = `UPDATE reservationMovie SET movieIdx = ? WHERE reservationIdx = ?`;
  return await mysql.query(updateReservationMovie, [movieIdx, reservationIdx]);
}
async function updateReservationTime(reservationTime, reservationIdx) {
  // 예약시간 수정
  const updateTimeSql = `UPDATE reservationHour SET reservationTime = ? WHERE reservationIdx = ?`;
  return await mysql.query(updateReservationTime, [
    reservationTime,
    reservationIdx
  ]);
}

module.exports = {
  selectCurrentMovie,
  selectFutureMovie,

  selectMovieReserveMovie,
  selectMovieReserveDate,

  insertReservation,
  insertReservationMovie,
  insertReservationTime,

  updateReservation,
  updateReservationMovie,
  updateReservationTime
};
