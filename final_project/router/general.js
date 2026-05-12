const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    const { username, password } = req.body
    if (!username || !password)
        return res.status(400).json({ message: 'username o password no proporcionado' })

    const existingUser = users.find(
        (user) => user.username === username
    );

    if (existingUser)
        return res.status(400).json({ message: 'Este usuario ya existe' })

    const user = {
        username,
        password
    }

    users.push(user)

    return res.status(200).json({ message: 'User Register' })
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const resBook = await new Promise((resolve, reject) => {
            resolve(books);
        });
        return res.status(200).json(resBook);
    } catch (error) {
        return res.status(500).json({ message: "Error getting books" })
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn

        const findBook = await new Promise((resolve, reject) => {

            const book = books[isbn]
            if (book) {
                resolve(book)
            } else {
                reject(new Error("Book not found"))
            }
        });
        return res.status(200).json(findBook);
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {

    const author = req.params.author

    try {
        const axiosResponse = await axios.get (`http://localhost:5000/`);
        const result = axiosResponse.data;
        const allBooks = Object.values(result);

        const findAuthor = allBooks.filter((b) => b.author === author);
        if (findAuthor.length === 0) {
            return res.status(404).json({message: "Not found author"});
        } 

        return res.status(200).json(findAuthor)

    }
    catch (error) {
        return res.status(500).json(error.message)
    }

});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {

    const title = req.params.title

    try { 
        const axiosResponse = await axios.get(`http://localhost:5000/`);
        const result = axiosResponse.data;
        const allBooks = Object.values(result);

        const findTitle = allBooks.filter(book => book.title === title);

        if (findTitle.length === 0) {
            return res.status(404).json({message: "Not found title"})
        }

        return res.status(200).json(findTitle)
 
    } catch (error) {
        return res.status(500).json(error.message)
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;
    const findBook = books[isbn]

    if (!findBook)
        return res.status(404).send('Book not found')

    const findReview = books[isbn].reviews

    return res.status(200).json(findReview);
});

module.exports.general = public_users;
