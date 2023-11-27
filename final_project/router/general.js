const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let {username, password} = req.body;
  if (!username || !password) {
    return res.status(404).send('You must provide the username and password!');
  }
  else if (users[username]) {
    return res.status(404).send('User already exists');
  }
  users[username] = password;
  return res.send(`User ${username} was successfully created!`);
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  return res.send(await JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  return res.send(await books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  return res.send(await Object.values(books).filter(book => book.author == req.params.author));
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  return res.send(await Object.values(books).filter(book => book.title == req.params.title));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.send(books[req.params.isbn]['reviews']);
});

module.exports.general = public_users;
