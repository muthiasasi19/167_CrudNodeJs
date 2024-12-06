const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua tugas
router.get('/', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });

});

// Endpoint untuk mendapatkan tugas berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM todos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Tugas tidak ditemukan');
        res.json(results[0]);
    });
});

// Create new book
router.post('/', (req, res) => {
    const { nama_buku, genre, tahun_terbit } = req.body;
    const sql = 'INSERT INTO todos (nama_buku, genre, tahun_terbit) VALUES (?, ?, ?)';
    db.query(sql, [nama_buku, genre, tahun_terbit], (err, result) => {
        if (err) return res.status(500).send('Error inserting data');
        res.status(201).json({ message: 'Book added successfully', id: result.insertId });
    });
});

// Update book
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nama_buku, genre, tahun_terbit } = req.body;
    const sql = 'UPDATE todos SET nama_buku = ?, genre = ?, tahun_terbit = ? WHERE id = ?';
    db.query(sql, [nama_buku, genre, tahun_terbit, id], (err) => {
        if (err) return res.status(500).send('Error updating data');
        res.status(200).json({ message: 'Book updated successfully' });
    });
});

// Delete book
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM todos WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).send('Error deleting data');
        res.status(200).json({ message: 'Book deleted successfully' });
    });
});


module.exports = router;