const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

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
    return res.json({token});
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
