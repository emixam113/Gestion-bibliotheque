require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

// Récupérer tous les livres
app.get('/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books');
        res.json(result.rows); // Retourne tous les livres
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

// Récupérer un livre par son ID
app.get('/books/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }
        res.json(result.rows[0]); // Retourne le livre trouvé
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

// Ajouter un livre
app.post('/books', async (req, res) => {
    try {
        const { title, author, published_date, is_available, category } = req.body;

        if (!title || !author || !published_date || typeof is_available !== 'boolean' || !category) {
            return res.status(400).json({ message: 'Données manquantes ou invalides' });
        }

        const result = await pool.query(
            'INSERT INTO books (title, author, published_date, is_available, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, author, published_date, is_available, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

// Mettre à jour un livre
app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, published_date, is_available, category } = req.body;

    try {
        const checkBook = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        if (checkBook.rows.length === 0) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        const result = await pool.query(
            `UPDATE books SET title = $1, author = $2, published_date = $3, is_available = $4, category = $5 WHERE id = $6 RETURNING *`,
            [title, author, published_date, is_available, category, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

// Supprimer un livre par ID
app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const checkBook = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        if (checkBook.rows.length === 0) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        await pool.query('DELETE FROM books WHERE id = $1', [id]);
        res.status(200).json({ message: 'Livre supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
