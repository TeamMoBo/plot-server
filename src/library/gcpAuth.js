var admin = require("firebase-admin");

var serviceAccount = require("../../config/mobo-6f428-firebase-adminsdk-fvmux-ed71fe1b4d.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mobo-6f428.firebaseio.com"
});

// var serviceAccount = require("../../config/google-services.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://chotalk-65363.firebaseio.com"
// });

function gcpAuth() {   
    var db = admin.database();
    
    return db;
}

module.exports = {
    gcpAuth
}