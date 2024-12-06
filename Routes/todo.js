const express = require('express');
const router = express.Router();
const db = require('../database/tododb');


// Endpoint untuk mendapatkan data todos
router.get('/', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
  });

document.getElementById('addTodoBtn').addEventListener('click', function() {
    window.location.href = '/add'; // Mengarahkan ke halaman add.ejs
});


// Endpoint untuk menambahkan tugas baru
router.post('/', (req, res) => {
    const { nama_buku, genre, tahun_terbit } = req.body;

    if (!nama_buku || !genre || !tahun_terbit) {
        return res.status(400).send('Semua field harus diisi');
    }

    db.query('INSERT INTO todos (nama_buku, genre, tahun_terbit) VALUES (?, ?, ?)', [nama_buku, genre, tahun_terbit], (err, results) => {
        if (err) {
            console.error('Database Insert Error:', err);
            return res.status(500).send('Internal Server Error');
        }

        res.status(201).json({ id: results.insertId, nama_buku, genre, tahun_terbit });

    });
});

// PUT: Update a todo by ID
router.put('/:id', (req, res) => {
    const { nama_buku, genre, tahun_terbit } = req.body;

    db.query('UPDATE todos SET nama_buku = ?, genre = ?, tahun_terbit = ? WHERE id = ?', [nama_buku, genre, tahun_terbit, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Tugas tidak ditemukan');

        const updatedTodo = { id: req.params.id, nama_buku, genre, tahun_terbit };
        res.json(updatedTodo);
    });
});

// DELETE: Remove a todo by ID
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM todos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Tugas tidak ditemukan');

        res.status(204).send();
    });
});

module.exports = router;
