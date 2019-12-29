var admin = require("firebase-admin");

var serviceAccount = require("../../config/my-project-1511976542359-firebase-adminsdk-4fifw-13d6e5c087.json");

admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://my-project-1511976542359.firebaseio.com"
});


function gcpAuth() {   
    var db = admin.database();
    
    return db;
}

module.exports = {
    gcpAuth
}