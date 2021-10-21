const db = require('../configs/connectDB');
const bcrypt = require('bcryptjs');

let createNewUser = (user) => {
    return new Promise(async(resolve, reject) => {
        try {

            // check email is exist or not
            let check = await checkEmailUser(user.email);
            if (check) {
                reject('This email ' + user.email + ' has been used');
            } else {
                //hash the user password
                let salt = bcrypt.genSaltSync(8);
                let data = {
                    name: user.name,
                    phone_number: user.phone_number,
                    email: user.email,
                    address: user.address,
                    sex: user.sex,
                    password: bcrypt.hashSync(user.password, salt)
                };

                db.query("INSERT INTO registeredCustomer SET ? ", data, (error, rows) => {
                    if (error) {
                        reject(error);
                    }
                    resolve('New user has been successsfully created')
                })
            }
        } catch (e) {
            reject(e);
        }
    });
};

let checkEmailUser = (email) => {
    return new Promise(((resolve, reject) => {
        try {
            db.query("SELECT * FROM registeredCustomer WHERE email = ?", email, (error, rows) => {
                if (error) {
                    reject(error);
                }
                if (rows.length > 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        } catch (e) {
            reject(e);
        }
    }))
}

module.exports = {
    createNewUser: createNewUser
}