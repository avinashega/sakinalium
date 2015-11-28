var express = require('express'),
    config = require('getconfig'),
    path = require('path'),
    app = express();

app.configure(function () {
    //just touch it, to check mongodb connection
    require('./bootstraps/mongoskin');

    app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
    app.use(express.static('public'));
    require('./bootstraps/handlebars')(app);

    app.use(express.favicon());

    app.use(express.limit('5mb'));
    app.use(express.urlencoded({limit: '5mb'}));
    app.use(express.multipart({limit: '5mb'}));
    app.use(express.json({limit: '5mb'}));

    app.use(express.cookieParser(config.http.cookieSecret));
    app.use(expressValidator());

    app.use(express.methodOverride());
    app.use(app.router);

    require('./bootstraps/controllers')(app);
    require('./bootstraps/errors')(app);
});

app.listen(process.env.PORT || config.http.port);

module.exports = app;
