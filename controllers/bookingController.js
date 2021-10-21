const db = require('../configs/connectDB');
require('../controllers/passportLocalController');
require('../services/loginService')
let getbookingPage = (req, res) => {
    console.log(req.user);
    req.flash('msg', 'Welcome to booking section');
    return res.render('booking', {
        errors: '',
        name: req.user.Name,
        mobile: req.user.phone_number,
        email: req.user.Email,
        address: req.user.Address,
        sex: req.user.Sex,
        msg: req.flash('msg')
    });
};

let reserveRoom = (req, res) => {

    const { cust_name, mobile, address, sex, email, maritalStatus, nAdults, nChildren, roomtype, nRooms, duration, fromW, toW, amount } = req.body;

    // Inserting user details into the database table
    db.query('INSERT INTO booking SET ?', {
        cust_name: cust_name,
        phone_number: mobile,
        address: address,
        sex: sex,
        email: email,
        marital_status: maritalStatus,
        num_adults: nAdults,
        num_children: nChildren,
        Room_type: roomtype,
        Rooms: nRooms,
        duration: duration,
        from_when: fromW,
        to_when: toW,
        amount: amount
    }, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            req.flash('msg', 'Please continue to make your payment')
            return res.render('bookingSlip', {
                errors: req.flash('errors', 'Please continue to make your payment'),
                user: req.body,
                msg: req.flash('msg')
            });
        }
    })
}

let payThere = (req, res) => {
    return new Promise(((resolve, reject) => {
        let user = req.user;

        try {
            db.query("SELECT * FROM booking WHERE email =?", [user.Email], (error, rows) => {
                if (error) {
                    reject(error);
                    console.log(error)
                } else {
                    let bUser = rows[0];
                    console.log(bUser);
                    return res.render('bookingReceipt', {
                        user: req.user,
                        bUser: bUser
                    });

                }
            })
        } catch (e) {
            reject(e);
        }
    }));
}

let cancelReservation = (req, res) => {
    return new Promise(((resolve, reject) => {
        let user = req.user;
        try {
            db.query("DELETE FROM booking WHERE email =?", [user.Email], (error, results) => {
                if (error) {
                    throw (error);
                } else if (results) {
                    req.flash('msg', 'You have successfully cancelled your reservation. If you have made payment, please forward the receipt with reasons of cancellation to this email: cidusface@gmail.com to have your money back')
                    return res.render('dashboard', {
                        user: req.user,
                        bUser: '',
                        msg: req.flash('msg')
                    });
                }
            })
        } catch (e) {
            reject(e);
        }
    }));
}
module.exports = {
    getbookingPage: getbookingPage,
    reserveRoom: reserveRoom,
    payThere: payThere,
    cancelReservation: cancelReservation
}