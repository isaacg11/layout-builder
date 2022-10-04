const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (username, password, done) {
        User.findOne({ email: username })
        .then((user, err) => {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.validatePassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));

module.exports = passport;