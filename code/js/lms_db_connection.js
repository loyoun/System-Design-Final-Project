const mysql = require('mysql');

const con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Hitchhikers1431997!',
	database: 'lms_db'
});

module.exports = con;