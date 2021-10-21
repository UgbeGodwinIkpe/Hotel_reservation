const mysql = require('mysql');
require('dotenv').config();
let db = mysql.createConnection({
    host: 'localhost',
    database: 'hotel_reservation',
    user: 'root',
    password: ''
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database connection established');
});

module.exports = db;