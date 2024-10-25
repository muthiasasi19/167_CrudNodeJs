
const express = require('express');
const router = express.Router();

// todos
let todos = [
    { id: 1, 
        task: "Belajar Node.Js", 
        completed: false },
    { id: 2,
         task: "Membuat API", 
         completed: false },
    { id: 3, 
        task: "New Task", 
        completed: false },
];


// books (baru)
let books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, genre: "Fiction" },
    { id: 2, title: "1984", author: "George Orwell", year: 1949, genre: "Dystopian" },
    { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Fiction" },
];

// Endpoint untuk mendapatkan data todos
router.get('/todos', (req, res) => {
    res.json(todos);
});

// Endpoint untuk mendapatkan data books
router.get('/books', (req, res) => {
    res.json(books);
});

// Endpoint untuk menambahkan book baru
router.post('/books', (req, res) => {
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author,
        year: req.body.year,
        genre: req.body.genre
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

module.exports = router;
