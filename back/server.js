const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3001;

const FIREBASE_URL = 'https://reactexo3-default-rtdb.europe-west1.firebasedatabase.app/'; // Remplace <TON_PROJECT_ID>

app.use(cors());
app.use(express.json());

// GET - Lire tous les todos depuis Firebase
app.get('/api/todos', async (req, res) => {
    try {
        const response = await axios.get(`${FIREBASE_URL}.json`);
        const todos = response.data || {};
        const list = Object.entries(todos).map(([id, val]) => ({ id, ...val }));
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: 'Erreur Firebase' });
    }
});

// POST - Ajouter un todo dans Firebase
app.post('/api/todos', async (req, res) => {
    try {
        const newTodo = req.body;
        const response = await axios.post(`${FIREBASE_URL}.json`, newTodo);
        res.status(201).json({ id: response.data.name, ...newTodo });
    } catch (error) {
        res.status(500).json({ error: 'Erreur Firebase' });
    }
});

// DELETE - Supprimer un todo dans Firebase
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await axios.delete(`${FIREBASE_URL}/${id}.json`);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

// PUT - Modifier l’état "done" dans Firebase
app.put('/api/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const update = req.body;
        await axios.patch(`${FIREBASE_URL}/${id}.json`, update);
        res.json({ id, ...update });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
