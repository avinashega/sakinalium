var hbs = require('express-hbs'),
    moment = require('moment');

module.exports = function (app) {

    app.engine('hbs', hbs.express3({
        partialsDir: __dirname + '/../partials/',
        layoutsDir: __dirname + '/../layouts/'
    }));
    app.set('views', __dirname + '/../views/');
    app.set('view engine', 'hbs');
};