const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simulação de Banco de Dados na memória
let apostas = [
    { id: 1, jogo: 'Quartas - Jogo 1', participante: 'Carlos Silva', palpite: 'Brasil 3 x 1 França' },
    { id: 2, jogo: 'Quartas - Jogo 2', participante: 'Ana Oliveira', palpite: 'Argentina 1 x 2 Holanda' }
];
let nextId = 3;

// READ ALL
app.get('/api/apostas', (req, res) => {
    res.json(apostas);
});

// CREATE
app.post('/api/apostas', (req, res) => {
    const { jogo, participante, palpite } = req.body;
    if (!jogo || !participante || !palpite) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }
    const novaAposta = { id: nextId++, jogo, participante, palpite };
    apostas.push(novaAposta);
    res.status(201).json(novaAposta);
});

// UPDATE
app.put('/api/apostas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { jogo, participante, palpite } = req.body;
    
    const index = apostas.findIndex(a => a.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Aposta não encontrada.' });
    }
    
    apostas[index] = { ...apostas[index], jogo, participante, palpite };
    res.json(apostas[index]);
});

// DELETE
app.delete('/api/apostas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = apostas.findIndex(a => a.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Aposta não encontrada.' });
    }
    apostas.splice(index, 1);
    res.status(204).send();
});

app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
