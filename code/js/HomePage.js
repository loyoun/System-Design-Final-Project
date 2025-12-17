/*
Author: 		Logan Young
Date Created: 	September 16th, 2025
Date Modified:	December 16th, 2025

Notes:
JavaScript for Home Page of LMS. This is still a bit messy overall.
There's a lot of optimization that could be done.
*/


// Navigation Tab Scripts
function openBookTab(evt, bookTab) {
	var i, bookGrid, navTabs;
	// Set all elements with 'bookGrid' class display to none.
	bookGrid = document.getElementsByClassName("bookGrid");
	for(i = 0; i < bookGrid.length; i++) {
		bookGrid[i].style.display = "none";
	}
	// Replace " active" class with ""
	navTabs = document.getElementById("NavTabs").children;
	for(i = 0; i < navTabs.length; i++) {
		navTabs[i].className = navTabs[i].className.replace(" active", "");
	}
	// Set display of clicked tab to grid and add 'active' class
	document.getElementById(bookTab).style.display = "grid";
	evt.currentTarget.className += " active";
}

function openActionTab(evt, selectedTab) {
	var i, actionTab, actionTabLinks;
	actionTab = document.getElementsByClassName("actionTab");
	for(i = 0; i < actionTab.length; i++) {
		actionTab[i].style.display = "none";
	}
	let tabGroups = document.getElementsByClassName("actionTabLinks");
	console.log(tabGroups[1]);
	for(i = 0; i < tabGroups.length; i++) {
		actionTabLinks = tabGroups[i].children;
		console.log(actionTabLinks);
		for(let j = 0; j < actionTabLinks.length; j++) {
			actionTabLinks[j].className = actionTabLinks[j].className.replace(" active", "");
		}
	}
	document.getElementById(selectedTab).style.display = "block";
	evt.currentTarget.className += " active";
}

// // test function for getting genres of books
// var genres = document.getElementById("getGenres");
// genres.addEventListener("click", () => getGenres(), false);
// async function getGenres() {
// 	try {
// 		const response = await fetch('/genres');
// 		// returns Array of Objects: "Object { genre: "Science Fiction" }"
// 		const genres =  await response.json();
// 		console.log(genres);
// 		console.log(genres[0].genre);
// 	}
// 	catch (error) {
// 		console.error(error);
// 	}
// }


// page load event listeners to tell if book has been clicked
async function pageLoadBookView() {
	var response = await fetch("/books");
	var books = await response.json();
	var bookDivs = document.getElementsByClassName("bookBackground");
	for (const bookDiv of bookDivs) {
		bookDiv.addEventListener("click", (event) => handleChosenClass(event, bookDivs), true);
		bookDiv.addEventListener("contextmenu", (event) => showDetails(event, books, bookDivs), false);
	}
}
pageLoadBookView();

// function to handle above event listener
// it would be great to be able to store the chosen book (object)
// in a global variable. promises are not quick to oblige
function handleChosenClass(event, bookDivs) {
	var elem = event.currentTarget;

	if(event.target.classList.contains("chosen")) {
		elem.className = elem.className.replace("chosen", "");
	}
	else {
		for(const bookDiv of bookDivs) {
			bookDiv.className = bookDiv.className.replace(" chosen", "");
		}
		elem.className += " chosen";
	}
}
// function to handle additional details of book
function showDetails(event, books, bookDivs) {
	// prevent right click context menu from showing
	event.preventDefault();

	var elem = event.currentTarget;

	if(elem.classList.contains("expanded")) {
		let pane = elem.querySelector(".detailsPane");
		if(!(pane == null)) {
			elem.removeChild(pane);
			elem.classList.remove("expanded");
		}
	}
	else {
		for(let bookDiv of bookDivs) {
			let pane = bookDiv.querySelector(".detailsPane");
			if(!(pane == null)) {
				bookDiv.removeChild(pane);
				bookDiv.classList.remove("expanded");
			}
		}
		for(let book of books) {
			if (book.local_id == elem.firstElementChild.getAttribute("data-id")) {
				elem.classList.add("expanded");
				let div = document.createElement("div");
				div.classList.add("detailsPane");
				// I'll have to clean this up later. Very sloppy work
				let p = document.createElement("p");
				p.textContent = "Title: " + book.title + "\nAuthor: " + 
					book.author + "\n\nGenre: " + book.genre + "\nStatus: " + 
					book.status + "\nPublication Date: " + book.pub_date + 
					"\nISBN: " + book.isbn + "\nLocal ID: " + book.local_id;
				div.appendChild(p);
				elem.appendChild(div);
				return;
			}
		}
	}
}


var modSubmit = document.getElementById("ModifiersButton");
modSubmit.addEventListener("click", () => filterBooks(), false);
async function filterBooks() {
	var response = await fetch("/books");
	// old books array to be filtered
	var books = await response.json();
	// new books array to be filled and sorted
	var newBooks = [];

	const modFormInfo = document.getElementById("ModifiersForm");
	// modData is an Iterator object with its own methods.
	const modData = new FormData(modFormInfo);
	let title = modData.get("Title").toLowerCase();
	let author = modData.get("Author").toLowerCase();
	let genre = modData.get("Genre").toLowerCase();
	let status = modData.get("Status");

	let sort = modData.get("Sort");
	let order = modData.get("Order");

	for(let i = 0; i < books.length; i++) {
		//console.log(books[i]);
		if(!(books[i].title.toLowerCase().includes(title))) {
			//console.log("Title does not include", title);
			continue;
		}
		else if(!(books[i].author.toLowerCase().includes(author))) {
			//console.log("Author does not include", author);
			continue;
		}
		else if(!(books[i].genre.toLowerCase().includes(genre))) {
			//console.log("Genre does not include", genre);
			continue;
		}
		else if(!((books[i].status == status) || status == "ANY")) {
			//console.log("Status is not", status);
			continue;
		}
		else {
			newBooks.push(books[i]);
		}
	}
	let sortedBooks = sortBooks(newBooks, sort, order);

	displayBooks(sortedBooks);
}

function sortBooks(books, sort, order) {
	// case sensitive
	if(sort == "title" || sort == "author" || sort == "genre") {
		books = books.sort((a, b) => {
			const nameA = a[sort].toLowerCase();
			const nameB = b[sort].toLowerCase();
			if((nameA < nameB && order == "ascending") || (nameA > nameB && order == "descending")) {
				return -1;
			}
			else if((nameA < nameB && order == "descending") || (nameA > nameB && order == "ascending")) {
				return 1;
			}
			return 0;
		});
	}
	else {
		if(order == "descending") {
			books = books.sort((a, b) => b[sort] - a[sort]);
		}
		else {
			books = books.sort((a, b) => a[sort] - b[sort]);
		}
	}
	return books;
}

// pass boolean to determine whether to update "YourBooks" too?
function displayBooks(books) {
	let grid = document.getElementById("LibraryBookGrid");
	let bookDivs = [];
	// Remove all current books in library display grid
	while(grid.firstChild) {
		grid.removeChild(grid.firstChild);
	}
	// Add 'books' to library display grid (titles only)
	for(let book of books) {
		let div = document.createElement("div");
		div.classList.add("bookBackground");
		bookDivs.push(div);
		// Event listener function to handle the "chosen" class
		div.addEventListener("click", (event) => handleChosenClass(event, bookDivs), false);
		// Event listener function to show details of books in new pane
		div.addEventListener("contextmenu", (event) => showDetails(event, books, bookDivs), false);
		let title = document.createElement("span");
		title.textContent = book.title;
		title.setAttribute("data-id", book.local_id);
		grid.appendChild(div);
		div.appendChild(title);
	}
}

// The check out and return functions could probably be combined,
// and then which operation is completed is decided by a passed
// argument. Something to keep in mind for later.

// Checking out a book
checkOutSubmit = document.getElementById("CheckOutSubmit");
checkOutSubmit.addEventListener("click", () => checkOutBook(), false);
async function checkOutBook() {
	let response = await fetch("/books");
	let books = await response.json();
	let chosen = document.getElementsByClassName("chosen");
	var bookCheckedOut = false;
	try {
		// if user already has three books checked out
		if(document.getElementsByClassName("yourBook").length > 2) {
			alert("You already have 3 books checked out!");
		}
		// if user has not selected a book yet
		else if(chosen.length == 0) {
			alert("You have not selected a book to check out yet!");
		}
		else {
			book_id = chosen[0].firstElementChild.getAttribute("data-id");
			for(let book of books) {
				if(book.local_id == book_id) {
					if(!(book.status == "AVAILABLE")) {
						alert("This book is not currently available! Its status is: " + book.status);
					}
					else if(book.status == "AVAILABLE") {
						// post request to update db
						await fetch('/checkout', {
							method: 'POST',
							body: JSON.stringify({
								"local_id": book.local_id,
								"status": "CHECKED_OUT"
							}),
							headers: {"Content-Type": "application/json"}
						});
						// additionally, update local book to pass to display
						book.status = "CHECKED_OUT"
						// set checked out flag to true
						bookCheckedOut = true;
						// break out of loop
						break;
					}
				}
			}
			// if book check out was successful
			if(bookCheckedOut == true) {
				console.log("book checked out client side!");
				//displayBooks(books);
			}
		}
	}
	catch (error) {
		console.error(error);
	}
}

// Returning a checked out book
returnSubmit = document.getElementById("ReturnSubmit");
returnSubmit.addEventListener("click", () => returnBook(), false);
async function returnBook() {
	var response = await fetch("/books");
	var books = await response.json();
	var idResponse = await fetch("/user_id");
	var user_id = await idResponse.json();

	let chosen = document.getElementsByClassName("chosen");
	var bookReturned = false;
	try {
		if(document.getElementsByClassName("yourBook").length < 1) {
			alert("You don't have any books checked out!");
		}
		else if(chosen.length == 0) {
			alert("You have not selected a book to return yet!");
		}
		else {
			book_id = chosen[0].firstElementChild.getAttribute("data-id");
			for(let book of books) {
				if(book.local_id == book_id) {
					if(!(book.status == "CHECKED_OUT" && book.user_id == user_id)) {
						alert("You have not checked out this book!");
						break;
					}
					else if(book.status == "CHECKED_OUT" && book.user_id == user_id) {
						// post request to update db
						await fetch('/return', {
							method: 'POST',
							body: JSON.stringify({
								"local_id": book.local_id,
								"status": "AVAILABLE"
							}),
							headers: {"Content-Type": "application/json"}
						});
						// additionally, update local book to pass to display
						book.status = "AVAILABLE"
						// set checked out flag to true
						bookReturned = true;
						// break out of loop
						break;
					}
				}
			}
			// if book check out was successful
			if(bookReturned == true) {
				console.log("book returned client side!");
				//displayBooks(books);
			}
		}
	}
	catch(error) {
		console.error(error);
	}
}

suggestSubmit = document.getElementById("SuggestSubmit");
suggestSubmit.addEventListener("click", () => suggestBook());
async function suggestBook() {
	const suggestionForm = document.getElementById("SuggestionForm")
	const suggestData = new FormData(suggestionForm);
	let title = suggestData.get("SuggestTitle");
	let author = suggestData.get("SuggestAuthor");
	let response = await fetch('/suggest', {
		method: "PUT",
		body: JSON.stringify({
			"title": title,
			"author": author
		}),
		headers: {"Content-Type": "application/json"}
	});
	document.getElementById("SuggestMessage").textContent = await response.text();
}

editBookSubmit = document.getElementById("EditBookSubmit");
editBookSubmit.addEventListener("click", () => editBook());
async function editBook() {
	const editBookForm = document.getElementById("EditBookForm");
	const editBookData = new FormData(editBookForm);
	let type = editBookData.get("EditType");
	let title = editBookData.get("EditTitle");
	let author = editBookData.get("EditAuthor");
	let genre = editBookData.get("EditGenre");
	let pub_date = editBookData.get("EditPubDate")
	let isbn = editBookData.get("EditISBN");

	// edit an existing book if type is "edit". requires user
	// to choose book in book view.
	// right now, blank inputs will replace columns.
	// might have to import books again (yay) to fix that.
	// need to figure out how to import this stuff once and set
	// it to have global reach.
	if(type == "edit") {
		let chosen = document.getElementsByClassName("chosen");
		if(chosen.length == 0) {
			alert("You have not chosen a book to edit!");
		}
		else {
			let book_id = chosen[0].firstElementChild.getAttribute("data-id");
			let response = await fetch('/edit_book', {
				method: "PUT",
				body: JSON.stringify({
					"local_id": book_id,
					"title": title,
					"author": author,
					"genre": genre,
					"pub_date": pub_date,
					"isbn": isbn
				}),
				headers: {"Content-Type": "application/json"}
			});
			document.getElementById("EditBookMessage").textContent = await response.text();
		}
	}
	// create a new book if type is "create"
	else if(type == "create") {
		let response = await fetch('/create_book', {
			method: "PUT",
			body: JSON.stringify({
				"title": title,
				"author": author,
				"genre": genre,
				"pub_date": pub_date,
				"isbn": isbn
			}),
			headers: {"Content-Type": "application/json"}
		});
		document.getElementById("EditBookMessage").textContent = await response.text();
	}
	else {
		console.error("Could not create or edit a book!");
	}
}