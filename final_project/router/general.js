const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user with username and password
public_users.post("/register", (req, res) => {
    const { username, password } = req.body

    // Validate that username and password are provided
    if (!username || !password)
        return res.status(400).json({ message: 'Username or password not provided' })

    // Check if user already exists
    const existingUser = users.find(
        (user) => user.username === username
    );

    if (existingUser)
        return res.status(400).json({ message: 'User already exists' })

    // Add new user to the users array
    users.push({ username, password })
    return res.status(200).json({ message: "User successfully registered" })
});

// Get the book list available in the shop using async/await with Promise
public_users.get('/', async function (req, res) {
    try {
        // Resolve the books object using a Promise
        const resBook = await new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject(new Error("No books found"));
            }
        });
        return res.status(200).json(resBook);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
});

// Get book details based on ISBN using async/await with Promise
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn

        // Search for book by ISBN using a Promise
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

// Get book details based on author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author

        // Fetch all books using Axios
        const axiosResponse = await axios.get('http://localhost:5000/');
        const result = axiosResponse.data;

        // Convert books object to array and filter by author
        const allBooks = Object.values(result);
        const findAuthor = allBooks.filter((b) => b.author === author);

        if (findAuthor.length === 0) {
            return res.status(404).json({ message: "Author not found" });
        }
        return res.status(200).json(findAuthor)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
});

// Get all books based on title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title

        // Fetch all books using Axios
        const axiosResponse = await axios.get('http://localhost:5000/');
        const result = axiosResponse.data;

        // Convert books object to array and filter by title
        const allBooks = Object.values(result);
        const findTitle = allBooks.filter(book => book.title === title);

        if (findTitle.length === 0) {
            return res.status(404).json({ message: "Title not found" })
        }
        return res.status(200).json(findTitle)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
});

// Get book review by ISBN
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;

    // Check if book exists
    const findBook = books[isbn]
    if (!findBook)
        return res.status(404).json({ message: 'Book not found' })

    // Return the reviews for the book
    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;