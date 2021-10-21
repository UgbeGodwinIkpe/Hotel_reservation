const db = require('../configs/connectDB');
require('../controllers/passportLocalController');

let getdashboardPage = (req, res) => {
    return res.render('dashboard', {
        errors: req.flash('errors'),
        user: req.user,
        bUser: '',
        msg: ''
    });
};

let viewReservation = (req, res) => {
    return new Promise(((resolve, reject) => {
        let user = req.user;
        try {
            db.query("SELECT * FROM booking WHERE email =?", [user.Email], (error, rows) => {
                if (error) {
                    reject(error);
                    console.log(error)
                } else {
                    let bUser = rows[0];
                    if (!bUser) {
                        req.flash('msg', 'You have not reserved room with us.')
                        return res.render('dashboard', {
                            user: req.user,
                            bUser: '',
                            msg: req.flash('msg')
                        })
                    }
                    if (bUser) {
                        return res.render('dashboard', {
                            user: req.user,
                            bUser: bUser,
                            msg: ''
                        });
                    }
                }
            })
        } catch (e) {
            reject(e);
        }
    }));
};

module.exports = {
    getdashboardPage: getdashboardPage,
    viewReservation: viewReservation
}