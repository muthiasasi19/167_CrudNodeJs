require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql');

const app = express();
const todoRoutes = require('./Routes/tododb.js');
const port = process.env.PORT || 3000; // Gunakan default port jika process.env.PORT tidak diatur
const db = require('./database/db'); // Pastikan file ini hanya mendefinisikan koneksi database
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const authRoutes = require('./Routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware.js');

app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Konfigurasi express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret', // Default secret jika tidak diatur di .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set ke true jika menggunakan HTTPS
  })
);

// Gunakan Routes
app.use('/', authRoutes);
app.use('/todos', todoRoutes);

// Set view engine
app.set('view engine', 'ejs');

// Rute utama
app.get('/', isAuthenticated, (req, res) => {
  res.render('index', {
    layout: 'layouts/main-layout',
  });
});

// Rute untuk merender halaman add.ejs
app.get('/add', isAuthenticated, (req, res) => {
  res.render('add', {
    layout: 'layouts/main-layout',
  });
});

app.get('/todos', async (req, res) => {
  try {
      const todos = await Todo.find();
      console.log(todos); // Debug: memastikan data diambil
      res.render('todo', { todos });
  } catch (error) {
      console.error(error); // Debug: melihat pesan error
      res.status(500).send('Terjadi kesalahan: ' + error.message);
  }
});


// Rute untuk melihat semua todos
app.get('/todo', isAuthenticated, (req, res) => {
  db.query(
    'SELECT id, nama_buku, genre, tahun_terbit FROM todos',
    (err, todos) => {
      if (err) return res.status(500).send('Internal Server Error');
      res.render('todo', {
        layout: 'layouts/main-layout',
        todos: todos,
      });
    }
  );
});

// Rute POST untuk menambah data
app.post('/add', isAuthenticated, (req, res) => {
    const { nama_buku, genre, tahun_terbit } = req.body;
  
    if (!nama_buku || !genre || !tahun_terbit) {
      return res.status(400).send('Semua field harus diisi');
    }
  
    db.query(
      'INSERT INTO todos (nama_buku, genre, tahun_terbit) VALUES (?, ?, ?)',
      [nama_buku, genre, tahun_terbit],
      (err, results) => {
        if (err) {
          console.error('Database Insert Error:', err);
          return res.status(500).send('Internal Server Error');
        }
  
        res.redirect('/contact'); // Redirect setelah data disimpan
      }
    );
  });
  


// Rute kontak untuk menampilkan data terbaru
app.get('/contact', isAuthenticated, (req, res) => {
  db.query('SELECT id, nama_buku, genre, tahun_terbit FROM todos', (err, todos) => {
    if (err) return res.status(500).send('Internal Server Error');
    
    // Kirim data todos terbaru ke contact.ejs
    res.render('contact', {
      layout: 'layouts/main-layout',
      todos: todos, // Kirimkan data todos yang sudah diperbarui
    });
  });
});

  

  // Rute untuk merender halaman edit.ejs
app.get('/edit/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM todos WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('edit', {
            layout: 'layouts/main-layout',
            todo: result[0],
        });
    });
});

// Rute untuk memperbarui data
app.post('/edit/:id', isAuthenticated, (req, res) => {
  const { nama_buku, genre, tahun_terbit } = req.body;
  const id = req.params.id;

  db.query('UPDATE todos SET nama_buku = ?, genre = ?, tahun_terbit = ? WHERE id = ?', 
    [nama_buku, genre, tahun_terbit, id], 
    (err, result) => {
      if (err) return res.status(500).send('Internal Server Error');
      
      // Redirect setelah update data selesai
      res.redirect('/contact'); // Redirect ke halaman todos dengan data terbaru
  });
});


// Rute untuk menghapus data
app.post('/delete/:id', isAuthenticated, (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send('Internal Server Error');
    
    // Setelah data dihapus, redirect ke halaman contact untuk memperbarui tampilan
    res.redirect('/contact'); // Redirect ke route contact agar halaman diperbarui
  });
});

  

// Rute untuk halaman edit
app.get('/edit/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM todos WHERE id = ?', [id], (err, result) => {
      if (err || !result.length) return res.status(404).send('Data tidak ditemukan');
      
      res.render('edit', {
        layout: 'layouts/main-layout',
        todo: result[0] // Kirimkan data todo yang akan diedit
      });
    });
  });
  
  // Route untuk merender todo.ejs
app.get('/todos', async (req, res) => {
  try {
      const todos = await Todo.find(); // Ambil data dari database
      res.render('todo', { todos }); // Render file todo.ejs dengan data
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send('Terjadi kesalahan: ' + error.message);
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
