const passport = require('../services/passport');

module.exports = {
    localLogin: passport.authenticate('local', {session: false})
}