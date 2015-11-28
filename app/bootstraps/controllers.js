var fs = require('fs'),
    express = require('express');

/**
 *
 * @param {express} parent
 */
module.exports = function (parent, acl) {
    var controllersDir = __dirname + '/../controllers/',
        viewsDir = __dirname + '/../views/';

    fs.readdirSync(controllersDir).forEach(function (file) {
        var app = express(),
            controller = require(controllersDir + file),
            controllerName = file.replace(/\.js$/, '');

        app.set('views', viewsDir + controllerName + '/');
        controller.routes(app, acl);

        parent.use(app);
    });
};