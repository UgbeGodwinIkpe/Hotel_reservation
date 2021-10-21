let getLoginPage = (req, res) => {
    req.flash('welcome_msg', 'Welcome to log in page. Please enter your email and password');
    return res.render('login', {
        errors: req.flash('errors'),
        msg: '',
        welcome_msg: req.flash('welcome_msg'),
        user: ''
    });
};

let checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('welcome_msg', 'Please log in with your email and password first')
        return res.render('login', {
            errors: req.flash('errors'),
            welcome_msg: req.flash('welcome_msg'),
            email: '',
            password: '',
            user: ''
        });
    }
    next();
};

let checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('dashboard');
    }
    next();
};

let postLogOut = (req, res) => {
    req.session.destroy((err) => {
        // req.flash('welcome_msg', 'You are logged out')
        return res.redirect('/login')
    });
};

module.exports = {
    getLoginPage: getLoginPage,
    checkLoggedOut: checkLoggedOut,
    checkLoggedIn: checkLoggedIn,
    postLogOut: postLogOut
}