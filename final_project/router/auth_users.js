const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {};

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return users[username] == password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let {username, password} = req.body;
  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
          {data: password},
          'access',
          {expiresIn: 60*60}
      );
      req.session.authorization = {accessToken, username};
      return res.send(`User ${username} was successfully logged in!`);
  }
  else {
    return res.status(403).send('Invalid login credentials');
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let {review} = req.body;
  if (!review || !req.params.isbn) return res.status(404).send('You must provide a review and ISBN');
  let username = req.session.authorization['username'];
  if (!books[req.params.isbn]) return res.status(404).send('No book found.');
  books[req.params.isbn].reviews[username] = review;
  return res.send(`Review of the user ${username} was submitted!`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    if (!req.params.isbn) return res.status(404).send('You must provide an ISBN');
    let username = req.session.authorization['username'];
    if (!books[req.params.isbn]) return res.status(404).send('No book found.');
    delete books[req.params.isbn].reviews[username];
    return res.send(`Review of the user ${username} was deleted!`);
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
