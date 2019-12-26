const crypto = require('crypto');

const encryption = {
    encrypt: (password) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(64, (err, buf) => {
                if(err) {
                    reject(err);
                } else {
                    const salt = buf.toString('base64');
                    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, hashed) => { // 비밀번호, salt, 반복 횟수, 비밀번호 길이, 해시 알고리즘
                        if(err) {
                            reject(err);
                        } else {
                            const hashPassword = hashed.toString('base64');
                            const result = {
                                salt, 
                                hashPassword
                            };
                            resolve(result);
                        }
                    })
                }    
            })
        })
    },
    notSaltEncrypt: (password, salt) => {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, hashed) => {
                if(err) {
                    reject(err);
                } else {
                    const hash = hashed.toString('base64');
                    resolve(hash);
                }
            })
        })
    }
}
module.exports = encryption;