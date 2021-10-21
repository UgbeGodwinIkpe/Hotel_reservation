const express = require('express');
const loginController = require('../controllers/loginController');
const registerController = require('../controllers/registerController');
const bookingController = require('../controllers/bookingController');
const roomAvaliabityController = require('../controllers/roomAvaliabityController');
const loginService = require('../services/loginService');
const auth = require('../validation/authValidation');
const passport = require('passport');
const initPassportLocal = require('../controllers/passportLocalController');
const dashboardPageController = require('../controllers/dashboardPageController');
const multer = require('multer');
const path = require('path');
// Set storage engine
const storage = multer.diskStorage({
    destination: './public/upload',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

    }
});
// initializing the upload variable
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');
// function to check type of file uploading
function checkFileType(file, cb) {
    // Allow extension
    const filetypes = /jpeg|jpg|png|gig/;
    // checking the extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // ckeck mimetype
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images only')
    }
}

let router = express.Router();

initPassportLocal();

let initWebRoutes = (app) => {
    router.get('/', (req, res) => {
        req.flash('welcome_msg', 'Welcome to CIDUSFACE HOTEL Online Room Reservation Home Page');
        return res.render('index', {
            error_msg: '',
            success_msg: '',
            welcome_msg: req.flash('welcome_msg')
        });

    });
    router.get('/register', registerController.getRegisterPage);
    router.post('/register', auth.validateRegister, registerController.createNewUser);
    router.get('/login', loginController.checkLoggedOut, loginController.getLoginPage);
    router.post('/login', (req, res, next) => {
        console.log(req.body);
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/login',
            successFlash: true,
            failureFlash: true
        })(req, res, next)
    });
    router.get('/dashboard', loginController.checkLoggedIn, dashboardPageController.getdashboardPage)
    router.post('/viewReservation', loginController.checkLoggedIn, dashboardPageController.viewReservation);
    router.post('/logout', loginController.postLogOut);
    router.get('/innerview', (req, res) => {
        res.render('innerview')
    });
    router.get('/booking', loginController.checkLoggedIn, bookingController.getbookingPage);
    router.post('/booking', bookingController.reserveRoom);
    router.get('/forgotPassword', (req, res) => {
        res.render('forgotPassword', {
            error: ''
        })
    });
    router.post('/forgotPassword', loginService.forgotPassword);
    router.get('/payThere', (req, res) => {
        res.render('bookingReceipt');
    });
    router.post('/payThere', bookingController.payThere);
    router.post('/cancelReservation', bookingController.cancelReservation);
    // router.get('/uploadImage', (req, res) => {
    //     res.render('image', {
    //         msg: '',
    //         image: ''
    //     })
    // });

    // router.post('/upload', (req, res) => {
    //     upload(req, res, (err) => {
    //         if (err) {
    //             res.render('image', {
    //                 msg: err
    //             });
    //         } else {
    //             if (req.file == 'undefinded') {
    //                 res.render('image', {
    //                     msg: 'Error: No file selected'
    //                 });
    //             } else {
    //                 console.log(req.file);
    //                 res.render('dashboard', {
    //                     msg: 'File Uploaded',
    //                     image: `images/${req.file.filename}`
    //                 });
    //             }

    //         }
    //     })
    // })
    return app.use('/', router);
};
module.exports = initWebRoutes;