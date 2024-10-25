const express = require('express');
const app = express();
const todoRoutes = require('./Routes/todo.js'); 

const port = 3000;

app.use(express.json());

// Menambahkan route ke `/api` yang mencakup `todos` dan `books`
app.use('/api', todoRoutes); 

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
