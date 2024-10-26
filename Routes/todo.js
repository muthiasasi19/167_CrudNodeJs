const express = require('express');
const router = express.Router();

// Routetodos
let todos = [
    { id: 1, task: "Belajar Node.Js", completed: false },
    { id: 2, task: "Membuat API", completed: false },
    { id: 3, task: "New Task", completed: false },
];

// Route books
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

// Endpoint untuk mengupdate book berdasarkan ID
router.put('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = books.findIndex(book => book.id === id);

    if (index !== -1) {
        books[index] = {
            id,
            title: req.body.title,
            author: req.body.author,
            year: req.body.year,
            genre: req.body.genre
        };
        res.json(books[index]);
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
});

// Endpoint untuk mengupdate todo berdasarkan ID
router.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(todo => todo.id === id);

    if (index !== -1) {
        todos[index] = {
            id,
            task: req.body.task,
            completed: req.body.completed
        };
        res.json(todos[index]);
    } else {
        res.status(404).send({ message: 'Todo not found' });
    }
});

// Endpoint untuk menghapus todo berdasarkan ID
router.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.filter(todo => todo.id !== id);
    res.status(204).send(); 
});

// Endpoint untuk menghapus book berdasarkan ID
router.delete('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    books = books.filter(book => book.id !== id);
    res.status(204).send(); 
});

module.exports = router;
