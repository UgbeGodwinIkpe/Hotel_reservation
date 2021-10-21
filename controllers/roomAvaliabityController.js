const db = require('../configs/connectDB');
// const alert = require('alert');

let checkRoom = (req, res) => {
    const { roomN, checkIn } = req.body;
    db.query("SELECT room_number FROM booking WHERE room_number = ?", [roomN], (error, results) => {
        if ((results.length > 0) && (roomN <= 350)) {
            console.log('Room ' + roomN + ' is currently occupied by another customer');
            req.flash('error_msg', 'Rooms in this category [1 - 350] cost N4000 per day, but room ' + roomN + ' is currently occupied by another customer. Please check another room');
            return res.render('index', {
                error_msg: req.flash('error_msg'),
                success_msg: '',
                welcome_msg: ''
            })
        }
        if ((results.length > 0) && (roomN <= 450)) {
            console.log('Room ' + roomN + ' is currently occupied by another customer');
            req.flash('error_msg', 'Rooms in this category [351 - 450] cost N10000 per day, but room ' + roomN + ' is currently occupied by another customer. Please check another room');
            return res.render('index', {
                error_msg: req.flash('error_msg'),
                success_msg: '',
                welcome_msg: ''

            })
        }
        if ((results.length > 0) && (roomN <= 500)) {
            console.log('Room ' + roomN + ' is currently occupied by another customer');
            req.flash('error_msg', 'Rooms in this category [456 - 5000] cost N15,000 per day, but room ' + roomN + ' is currently occupied by another customer. Please check another room');
            return res.render('index', {
                error_msg: req.flash('error_msg'),
                success_msg: '',
                welcome_msg: ''

            })
        } else
        if ((roomN >= 1) && (roomN <= 350)) {
            req.flash('success_msg', 'Room ' + roomN + " is N4000 per day and it's free for booking. If you need something higher, check room [356 - 450]");
            return res.render('index', {
                success_msg: req.flash('success_msg'),
                error_msg: '',
                welcome_msg: ''

            });
        }
        if ((roomN >= 356) && (roomN <= 450)) {
            req.flash('success_msg', 'Room ' + roomN + " is N10,000 per day and it's free for booking. If you need room of less price check room [1 - 350]");
            return res.render('index', {
                success_msg: req.flash('success_msg'),
                error_msg: '',
                welcome_msg: ''

            });
        }
        if ((roomN >= 456) && (roomN <= 500)) {
            req.flash('success_msg', 'Room ' + roomN + " is N15,000 per day and it's free for booking. If you need room of less price check room [1 - 350 cost N4000 per day], [356 - 450 cost N10,000 per day]");
            return res.render('index', {
                success_msg: req.flash('success_msg'),
                error_msg: '',
                welcome_msg: ''

            });
        } else {
            console.log("Sorry we don't have such room in the hotel. Check room 1 to 500")
            req.flash('error_msg', "Sorry we don't have such room in the hotel. Check from room [1 - 500] for avalibility");
            return res.render('index', {
                success_msg: '',
                error_msg: req.flash('error_msg'),
                welcome_msg: ''
            })
        }

    });

};

module.exports = {
    checkRoom: checkRoom
};