var config = require('getconfig'),
    mongoskin = require('mongoskin'),

    fs = require('fs'),
    db = mongoskin.db(process.env.MONGOLAB_URI, {w: 1});

var collectionsDir = __dirname + '/../collections/';
fs.readdirSync(collectionsDir).forEach(function (file) {
    require(collectionsDir + file)(db);
});

module.exports = db;