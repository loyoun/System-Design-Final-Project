const con = require('./lms_db_connection.js');

/*module.exports = new Promise(function(resolve, reject) {
	con.connect(function(err) {
		if(err) throw err;
		con.query('SELECT title FROM books', function(err, result, fields) {
			if (err) throw err;
			resolve(result);
		});
	});
});*/


function getAllBooks() {
	return new Promise(function(resolve, reject) {
		con.query('SELECT * FROM books', function(err, result, fields) {
			if(err) throw err;
			resolve(result.map(v => Object.assign({}, v)));
		});
	});
};

// Return all titles from books as JSON Map
function getAllTitles() {
	return new Promise(function(resolve, reject) {
		//con.connect(function(err) {
			//if(err) throw err;
			con.query('SELECT title FROM books', function(err, result, fields) {
				if(err) throw err;
				resolve(result.map(v => Object.assign({}, v)));
			});
		//});
	});
};

// Return all titles from books User has checked out as JSON Map
function getUserTitles(user_id) {
	return new Promise(function(resolve, reject) {
		//con.connect(function(err) {
			//if(err) throw err;
			con.query('SELECT title FROM books WHERE user_id = ?', [user_id], function(err, result, fields) {
				if(err) throw err;
				resolve(result.map(v => Object.assign({}, v)));
			});
		//});
	});
};

// Export module functions
module.exports = {
	getAllTitles: getAllTitles(),
	getUserTitles,
	getAllBooks
};