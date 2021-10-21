const passport = require('passport');
const passportLocal = require('passport-local');
const db = require('../configs/connectDB');
const loginService = require('../services/loginService');
let LocalStrategy = passportLocal.Strategy;

let initPassportLocal = () => {
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true

        },
        async(req, email, password, done) => {
            // try {
            let user = await loginService.findUserByEmail(email);
            if (!user) {
                return done(null, false, req.flash("errors", "Email or password is incorrect."))

            } else {

                // compare password with the hashed passwor in the database
                let match = await loginService.comparePasswordUser(user, password);

                if (match === true) {

                    return done(null, user, null);
                } else {
                    return done(null, false, req.flash('errors', 'Incorrect email or password entered'));
                }
            }


        }
    ));
};

module.exports = initPassportLocal;