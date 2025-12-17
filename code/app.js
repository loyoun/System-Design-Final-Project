const express = require('express');
const session = require('express-session');
//const fetch = require('fetch');
const path = require('path');
const connection = require('./js/lms_db_connection.js');
const queryFunctions = require('./js/queries.js');

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// middleware setup
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '')));

// view engine setup
app.set('view engine', 'ejs');


// start of get and set requests

// login function
app.post('/auth', function(request, response) {
	// Capture the input fields
	let email = request.body.EmailIn;
	let password = request.body.PasswordIn;
	let accountType = request.body.AccountIn;
	// Ensure the input fields exists and are not empty
	if (email && password) {
		// Execute SQL query that'll select the account from the database based on the specified email and password
		connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.email = email;
				// Redirect to home page
				//response.redirect('/HomePage.ejs');
				//app.get('/', function(request, response) {
				let result_json = Object.assign({}, results[0]);
				request.session.userID = result_json.user_id;
				queryFunctions.getAllBooks().then(function(books) {
					return response.render('HomePage.ejs', 
					{'books': books, 
					'user': result_json});
				});
				//});
			} else {
				response.send('Incorrect Email and/or Password!');
			}			
			//response.end();
		});
	} else {
		response.send('Please enter Email and Password and Account Type!');
		response.end();
	}
});

app.post('/create_user', function(request, response, next) {
	let firstName = request.body.CreateFirstName;
	let lastName = request.body.CreateLastName;
	let email = request.body.CreateEmail;
	let password = request.body.CreatePassword;
	const user_type = 4;

	if(email && password && lastName) {
		connection.query('INSERT INTO users (user_type_id, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)', [user_type, firstName, lastName, email, password], function(error, results, fields) {
			if(error) throw error;
			else {
				response.send("User account created successfully!");
			}
		});
	}
	else {
		response.send("Please enter a last name, an email, and a password!");
	}
});

// logout function
app.get('/logout', function(request, response, next) {
	// if the user is logged in
	if(request.session.loggedin) {
		request.session.loggedin = false;
		response.redirect('/SignIn.html');
	}
	// else, the user isn't logged in
	else {
		response.redirect('/SignIn.html')
	}
});

// commonly used "get books" function
app.get('/books', function(request, response, next) {
	connection.query('SELECT * FROM books', function(error, results, fields) {
		if(error) throw error;
		else {
			response.send(results);
		}
	});
});

// user id function
app.get('/user_id', function(request, response, next) {
	console.log(request.session.userID);
	if(request.session.loggedin == true) {
		response.send(request.session.userID);
	}
	else {
		console.error("User is not logged in! No ID to send!");
	}
});

// checkout function
app.post('/checkout', function(request, response, next) {
	console.log(request.body);
	let book_id = request.body.local_id;
	let status = request.body.status;
	let user_id = request.session.userID;
	connection.query("UPDATE books SET status = ?, user_id = ? WHERE local_id = ?", [status, user_id, book_id], function(error, results, fields) {
		if(error) throw error;
		else {
			response.send("Book checked out successfully!");
		}
	});
});

// return function
app.post('/return', function(request, response, next) {
	let book_id = request.body.local_id;
	let status = request.body.status;
	connection.query("UPDATE books SET status = ?, user_id = null WHERE local_id = ?", [status, book_id], function(error, results, fields) {
		if(error) throw error;
		else {
			response.send("Book returned successfully!");
		}
	});
});

app.put('/suggest', function(request, response, next) {
	let title = request.body.title;
	let author = request.body.author;
	connection.query("INSERT INTO suggestedbooks (title, author) VALUES (?, ?)", [title, author], function(error, results, fields) {
		if(error) throw error;
		else {
			response.send("Book suggested successfully!");
		}
	})
});

app.put('/edit_book', function(request, response, next) {
	let book_id = request.body.local_id;
	let title = request.body.title;
	let author = request.body.author;
	let genre = request.body.genre;
	let pub_date = request.body.pub_date;
	let isbn = request.body.isbn;
	connection.query("UPDATE books SET title = ?, author = ?, genre = ?, pub_date = ?, isbn = ? WHERE local_id = ?", [title, author, genre, pub_date, isbn, book_id], function(error, results, fields) {
		if(error) throw error;
		else {
			response.send("Book edited successfully!");
		}
	})
})

app.put('/create_book', function(request, response, next) {
	let title = request.body.title;
	let author = request.body.author;
	let genre = request.body.genre;
	let pub_date = request.body.pub_date;
	let isbn = request.body.isbn;
	let status = "AVAILABLE";
	connection.query("INSERT INTO books (title, author, genre, pub_date, isbn, status) VALUES (?, ?, ?, ?, ?, ?)", [title, author, genre, pub_date, isbn, status], function(error, results, fields) {
		if(error) throw error;
		else {
			response.send("Book created successfully!");
		}
	})
})

// get sign in page to display upon connection to server
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/SignIn.html'));
});

// not sure if this is entirely necessary
app.get('/', (request, response) => {
	// If the user is loggedin
	if (request.session.loggedin == true) {
		// Output email
		response.send('Welcome back, ' + request.session.email + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});


// test function
/*app.get('/genres', function(request, response, next) {
	connection.query('SELECT genre FROM books', function(error, results, fields) {
		if(error) throw error;
		else {
			response.send(results);
		}
	});
});*/



app.listen(3000);

/*
Some starter code was taken from here: https://codeshack.io/basic-login-system-nodejs-express-mysql/
It has been largely edited beyond recognition with my own additions.
*/