const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../../config/env/development')
const { response, errResponse } = require('../library/response')
const returnCode = require('../library/returnCode')

function sign(idx) {
    const payload = {
        'idx': idx
    }

    // const token = jwt.sign(payload, jwtConfig.secretKey, jwtConfig.option);
    const result = {
        "token" : jwt.sign(payload, jwtConfig.secretKey, jwtConfig.option)
    }
    return result;
}

function verify(authorization) {
    try {
        return jwt.verify(authorization, jwtConfig.secretKey);
    } catch (err) {
        if (err.message === 'jwt expired') {
            console.log('expired token');
            return -3;
        } else if (err.message === 'invalid token') {
            console.log('invalid token');
            return -2;
        } else {
            console.log("invalid token");
            return -2;
        }
    }
}

function authCheck(req, res, next) {
    const { authorization } = req.headers;

    try {
        req.user = jwt.verify(authorization, jwtConfig.secretKey);

        next();
    } catch (error) {
        errResponse(res, returnCode.UNAUTHORIZED, error.message)
    }
}

function managerCheck(req, res, next) {
    const { authorization } = req.headers;

    try {
        req.user = jwt.verify(authorization, jwtConfig.secretKey);

        if (req.user.type != 0) {
            errResponse(res, returnCode.FORBIDDEN, '관리자가 아닙니다')
        } else {
            next();
        }
    } catch (error) {
        errResponse(res, returnCode.UNAUTHORIZED, error.message)
    }
}

function isLogin(req, res, next) {
    const { authorization } = req.headers;

    if (authorization == undefined) {
        req.user = {
            'idx': null
        }
    } else {
        try {
            req.user = jwt.verify(authorization, jwtConfig.secretKey);

            next();
        } catch (error) {
            errResponse(res, returnCode.UNAUTHORIZED, error.message)
        }
    }
}

module.exports = {
    sign,
    verify,
    authCheck,
    managerCheck,
    isLogin,
}