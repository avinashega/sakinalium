var express = require('express'),
    path = require('path'),
    app = express();

var bodyParser = require('body-parser')

    //just touch it, to check mongodb connection
    //require('./bootstraps/mongoskin');

    app.use(express.static('public'));
    app.user(bodyParser);
    require('./bootstraps/handlebars')(app);


    require('./bootstraps/controllers')(app);
    require('./bootstraps/errors')(app);

app.listen(8000);

module.exports = app;
