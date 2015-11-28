module.exports = {
    index: function (req, resp) {
        resp.render('index');
    },

    register: function (req, resp) {
        resp.render('register');
    },

    table: function (req, resp) {
        resp.render('table');
    },

    accordion: function (req, resp) {
        resp.render('accordion');
    },

    frameWindow: function (req, resp) {
        resp.render('frame-window');
    },

    frame: function (req, resp) {
        resp.render('frame');
    },

    frame2: function (req, resp) {
        resp.render('frame2');
    },

    frame3: function (req, resp) {
        resp.render('frame3');
    },

    video: function (req, resp) {
        resp.render('video');
    },

    alerts: function (req, resp) {
        resp.render('alerts');
    },

    routes: function (app) {
        app.get('/', this.index);
        app.get('/register', this.register);
        app.get('/table', this.table);
        app.get('/accordion', this.accordion);
        app.get('/frame-window', this.frameWindow);
        app.get('/frame', this.frame);
        app.get('/frame2', this.frame2);
        app.get('/frame3', this.frame3);
        app.get('/video', this.video);
        app.get('/alerts', this.alerts);
    }
};