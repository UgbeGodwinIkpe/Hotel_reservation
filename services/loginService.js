const db = require('../configs/connectDB');
const bcrypt = require('bcryptjs');
require('connect-flash');

let findUserByEmail = (email) => {
    return new Promise(((resolve, reject) => {
        try {
            db.query("SELECT * FROM registeredCustomer WHERE email =?", email, (error, rows) => {
                if (error) {
                    reject(error);
                    console.log(error);
                }
                let user = rows[0];
                resolve(user);
            })
        } catch (e) {
            reject(e);
        }
    }));
};

let comparePasswordUser = (user, password) => {
    return new Promise(async(resolve, reject) => {

        bcrypt.compare(password, user.password, (err, isMatch, req) => {

            if (err) reject(err)
            if (!isMatch) {
                console.log("Password doesn't match")
            } else {
                console.log("Correct password")
                resolve(isMatch);
            }
        })
    })
};

let findUserById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query("SELECT * FROM registeredCustomer WHERE id = ?", id, (error, rows) => {
                if (error) reject(error);
                let user = rows[0];
                resolve(user);
            })
        } catch (e) {
            reject(e);
        }
    });
};

let forgotPassword = (req, res) => {
    const { email, password, confirmPassword } = req.body;
    if (confirmPassword !== password) {
        req.flash('error', 'Confirm password do not match')
        return res.render('forgotPassword', {
            error: req.flash('error')
        })
    }
    db.query('SELECT * FROM registeredCustomer WHERE email = ?', [email], (error, rows) => {
        if (error) throw error;
        let user = rows[0];
        let salt = bcrypt.genSaltSync(8);
        let newPassword = bcrypt.hashSync(password, salt)
        if (user) {
            db.query("UPDATE registeredCustomer SET password = ?", [newPassword], (error, results) => {
                if (results) {
                    req.flash('welcome_msg', 'Your password has been successfully reset to ' + password + ', you can now log in')
                    return res.render('login', {
                        welcome_msg: req.flash('welcome_msg'),
                        errors: req.flash('errors'),
                        user: req.body
                    })
                }
            });
        } else {
            req.flash('error', email + ' is not found. Please enter the correct email')
            res.render('forgotPassword', {
                error: req.flash('error')
            });
        }
    })
};
module.exports = {
    findUserByEmail: findUserByEmail,
    comparePasswordUser: comparePasswordUser,
    findUserById: findUserById,
    forgotPassword: forgotPassword
};