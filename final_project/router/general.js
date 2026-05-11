const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    const { username, password } = req.body
    if (!username || !password)
    return res.status(400).json ({ message:'username o password no proporcionado'})

    const existingUser = users.find(
        (user) => user.username === username
    );

    if (existingUser)
    return res.status(400).json ({ message:'Este usuario ya existe'})

    const user = {
        username,
        password
    }

    users.push(user)

    return res.status(200).json ({ message:'User Register'})
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const resBook = await new Promise((resolve, reject) => {
            resolve(books);
        });
        return res.status(200).json(resBook);
    } catch (error) {
        return res.status(500).json({message: "Error getting books"})
    }
});
    

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn
    const findBook = books[isbn]

    if (!findBook) {
        return res.status(404).json({
            message: "Book not found"
        })
    }

    res.status(200).json(findBook);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    const keys = Object.keys(books);

    const findBook = keys.find(
        (key) => books[key].author === req.params.author
    );


    if (!findBook)
        return res.status(404).send('Book not found')


    const bookFound = books[findBook]
    res.status(200).json(bookFound);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const keys = Object.keys(books)
    const title = req.params.title

    const findBook = keys.find(
        (key) => books[key].title === title
    );

    if (!findBook)
        return res.status(404).send('Book not found')

    const bookFound = books[findBook]
    return res.status(200).json(bookFound);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;
    const findBook = books[isbn]

    if (!findBook)
        return res.status(404).send ('Book not found')

    const findReview = books[isbn].reviews

    return res.status(200).json(findReview);
});

module.exports.general = public_users;
