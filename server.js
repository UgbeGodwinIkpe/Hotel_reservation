require('dotenv').config();
const express = require('express');
const initWebRoutes = require('./routes/web');
const bodyParser = require('body-parser');
const session = require('express-session');
require('./controllers/loginController');
require('./controllers/registerController');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const loginService = require('./services/loginService');
const passport = require('passport');
// const Vonage = require('@vonage/server-sdk')

// const vonage = new Vonage({
//   apiKey: "cffa7576",
//   apiSecret: "XvE0uEV8Og7LTdQR"
// });
// const from = "Vonage APIs"
// const to = "2348127087575"
// const text = 'A text message sent using the Vonage SMS API'

// vonage.message.sendSms(from, to, text, (err, responseData) => {
//     if (err) {
//         console.log(err);
//     } else {
//         if(responseData.messages[0]['status'] === "0") {
//             console.log("Message sent successfully.");
//         } else {
//             console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
//         }
//     }
// })

let app = express();


app.use(express.static(__dirname + '/public'));


// Enable body parser post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use cookier parser
app.use(cookieParser('secret'));

// config middleware  session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
        // cookie: {
        //     maxAge: 1000 * 60 * 60 * 24 //86400000 1 day
        // }
}));

// Enable flash message
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//app.use(expressLayouts);
app.set('view engine', 'ejs');

// config passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    return done(null, user.id);
});
passport.deserializeUser((id, done) => {
    loginService.findUserById(id).then((user) => {
            return done(null, user);
        })
        /*.catch(error => {
                    return done(error, null)
                });*/
});

// init all web routes
initWebRoutes(app);

const port = process.env.PORT;
app.listen(port, () => console.log('App running on port ' + port + '!!'));