const { validationResult } = require('express-validator');
const registerService = require('../services/registerService');
const joi = require("joi");

let getRegisterPage = (req, res) => {
    req.flash('welcome_msg', 'Welcome to account creation page')
    return res.render('register', {
        errors: req.flash('errors'),
        welcome_msg: req.flash('welcome_msg')
    });
};

let createNewUser = async(req, res) => {

    // validate all require fields
    let errorsArr = [];
    let validationErorrs = validationResult(req);
    if (!validationErorrs.isEmpty()) {
        let errors = Object.values(validationErorrs.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash('errors', errorsArr);
        return res.redirect('/register');
    }
    console.log(req.body);
    // create a new user
    try {
        const validation = joi.object({
            name: joi.string().min(3).max(25).trim(true).required(),
            address: joi.string().trim(true).required(),
            email: joi.string().email().trim(true).required(),
            phone_number: joi.string().length(11).required(),
            sex: joi.string().required(),
            password: joi.string().min(7).required(),
            passwordConfirm: Joi.string().valid(Joi.ref('password')).required()
        });
        const { name, phone_number, email, address, sex, password, passwordConfirm } = req.body;
        let newUser = {
            name: name,
            phone_number: phone_number,
            email: email,
            address: address,
            sex: sex,
            password: password
        };
        const { error } = validation.validate(req.body);
        if (error) {
            res.status(406);
            return res.send({
                message: error.message + " Pleasee check your inputs"
            });
        }
        await registerService.createNewUser(newUser);
        req.flash('welcome_msg', 'You have successfully created an account with us. Please enter email and password to log in')
        return res.render('login', {
            welcome_msg: req.flash('welcome_msg'),
            msg: req.flash('success_msg', 'You have successfully created an account with us'),
            errors: '',
            user: newUser
        })

    } catch (e) {
        req.flash('errors', e);
        return res.redirect('/register');
    }
}

module.exports = {
    getRegisterPage: getRegisterPage,
    createNewUser: createNewUser
};