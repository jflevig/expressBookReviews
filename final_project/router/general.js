const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push(
        {
          username: username,
          password: password
        }
      );
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } else {
    return res.status(404).json({message: "Unable to register user."});
  }
});

// Get the book list available in the shop
async function getBooks() {
  return books;
}

public_users.get('/', async function (req, res) {
  try {
    const bookList = await getBooks();
    return res.status(200).json(bookList);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" })
  }
});

// Get book details based on ISBN
async function getBookByIsbn(isbn) {
  return books[isbn]
}

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await getBookByIsbn(isbn);
    return res.status(200).json(book);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" })
  }
 });
  
// Get book details based on author
async function getBookByAuthor(author) {
  let filteredBooks = {}
  Object.keys(books).forEach(key => {
    if (books[key].author === author) {
      filteredBooks[key] = books[key];
    }
  })
  return filteredBooks;
}
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const bookList = await getBookByAuthor(author);
    return res.status(200).json(bookList);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" })
  }
});

// Get all books based on title
async function getBookByTitle(title) {
  let filteredBooks = {}
  Object.keys(books).forEach(key => {
    if (books[key].title === title) {
      filteredBooks[key] = books[key];
    }
  })
  return filteredBooks;
}
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
try {
    const bookList = await getBookByTitle(title);
    return res.status(200).json(bookList);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" })
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews
  return res.json(reviews);
});

module.exports.general = public_users;
