const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const SECRET = "access";

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password} = req.body   // Obtener username y password del body
    
    if (!username || !password) {
        return res.status(400).json({message: "Username and password required"})
    }
    
    const findUser = users.find(
        (user) => user.username === username && user.password === password
    );

    if (!findUser) {
        return res.status(401).json({message: "Invalid credentials"})
    }

    const token = jwt.sign(
        {username, }, 
        SECRET, 
        { expiresIn: "2h" }
    );
    req.session.authorization = { accessToken: token }
    return res.json({message: "Login successful", token});
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    
    const reviewsUser = req.query.reviews;
    const username = req.user.username;
    const isbn = req.params.isbn;

    const foundIsbn = books[isbn]

    if (!foundIsbn) {
        return res.status(404).json({message: "Book not found"})
    }

    if (!reviewsUser) {
        return res.status(404).json({message: "Add a valid review"})
    }

    books[isbn].reviews[username] = reviewsUser

  return res.status(201).json({message:"Your review has been successfully added"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    foundIsbn = books[isbn]

    if (!foundIsbn) {
        return res.status(404).json({message: "Book not found"})
    }

    delete books[isbn].reviews[username];
    return res.status(200).json({message:`Review for ISBN ${isbn} deleted`})

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
