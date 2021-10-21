const { check } = require('express-validator');

let validateRegister = [
    check('email', 'Invalid email').isEmail().trim(),
    // check('paasword', 'Invalid password. Password must be at least 6 charaters long').isLength({ min: 6 }),
    check('passwordConfirm', ' Confirmation password do not match with the first').custom((value, { req }) => {
        return value === req.body.password
    })
];

module.exports = {
    validateRegister: validateRegister
};