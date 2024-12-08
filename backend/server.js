require('dotenv').config ();
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
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

// Ajouter un livre
app.post('/books', async (req, res) => {
    try {
        const { title, author, publish_date, is_available, category } = req.body;

        // Validation des données
        if (!title || !author || !publish_date || typeof is_available !== 'boolean' || !category) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Données manquantes ou invalides'
                }
            });
        }

        if (title.length < 3 || title.length > 255) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Le titre doit contenir entre 3 et 255 caractères.'
                }
            });
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(publish_date)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Format de la date invalide, doit être YYYY-MM-DD'
                }
            });
        }

        // Vérification des doublons
        const duplicateCheck = await pool.query(
            'SELECT * FROM books WHERE title = $1 AND author = $2',
            [title, author]
        );
        if (duplicateCheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'DUPLICATE_ERROR',
                    message: 'Ce livre existe déjà.'
                }
            });
        }

        // Insertion dans la base de données
        const result = await pool.query(
            'INSERT INTO books (title, author, publish_date, is_available, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, author, publish_date, is_available, category]
        );
        res.status(201).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'UNIQUE_CONSTRAINT',
                    message: 'Un livre avec ce titre existe déjà.'
                }
            });
        }
        console.error(error);
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Erreur serveur'
            }
        });
    }
});


// Mettre à jour un livre
app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, publish_date, is_available, category } = req.body;

    try {
        // Vérifier si le livre existe avant de mettre à jour
        const checkBook = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        if (checkBook.rows.length === 0) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        const result = await pool.query(
            `UPDATE books SET title = $1, author = $2, publish_date = $3, is_available = $4, category = $5 WHERE id = $6 RETURNING *`,
            [title, author, publish_date, is_available, category, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

// Supprimer un livre
app.delete('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID invalide' });
        }

        const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        res.status(204).json({ message: 'Livre supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});