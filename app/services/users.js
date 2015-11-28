var q = require('q'),
    i = require('../i'),
    c = require('../c'),
    users = i.db().users;

module.exports = {

    getByLoginAndPassword: function (login, password) {
        return q.nbind(users.getByLoginAndPassword, users)(login, password);
    },

    signUp: function (req) {

        req.sanitize('login').trim();
        req.sanitize('email').trim();
        req.sanitize('company').trim();
        req.sanitize('firstName').trim();
        req.sanitize('lastName').trim();

        req.assert('email', 'Valid email required').isEmail();
        req.assert('login', 'Please provide a username of at least 4 characters.').len(4, 20);
        req.assert('firstName', 'First name required').notEmpty();
        req.assert('lastName', 'Last name required').notEmpty();
        req.assert('password', 'Please use at least 6 characters').len(6, 100);
        req.assert('passwordRepeat', 'Passwords are not equal').equals(req.param('password'));


        return q.fcall(function () {
            var errors = req.validationErrors();
            if (errors) {
                return q.reject(errors);
            } else {
                return req.body;
            }
        })
            .then(function (params) {
                return q.all([params, q.nbind(users.getByLogin, users)(params.login)]);
            })
            .then(function (res) {
                var params = res[0],
                    user = res[1];

                if (user) {
                    return q.reject(i.makePromiseError('login', 'A user with this login already exists'));
                }
                return q.nbind(users.signUp, users)(params);
            })
            // .then(function (user) {
            //     // console.log({users:user});
            //     var job = i.agenda()
            //         .create(c.JOB_TYPE.CONFIRMATION_EMAIL, {users:user});
            //     return q.all([user, q.nbind(job.save, job)()]);
            // })
            .then(function(user){
                return user;
            })
    },

    activateByKey: function (key) {
        return q.nbind(users.activateByKey, users)(key);
    },

    removeByKey: function (key) {
        return q.nbind(users.findOne, users)({key: key})
            .then(function (user) {
                if (!user) {
                    return q.reject('Can\'t find user to delete.');
                }
                return [user, q.nbind(users.removeByKey, users)(user.key)];
            })
            .spread(function (user) {
                return user;
            });
    }

};