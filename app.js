const express = require("express");
const app = express();

// Simulação de Banco de Dados na memória
// Cada item representa uma APOSTA feita por um participante em um jogo
let apostas = [
   { id: 1, participante: 'João Silva', jogo: 'Oitavas - Jogo 1', palpite: 'Alemanha 3 x 2 Bélgica' },
   { id: 2, participante: 'Maria Souza', jogo: 'Oitavas - Jogo 6', palpite: 'Brasil 1 x 0 Estados Unidos' }
];

// Contador auxiliar para gerar IDs sempre únicos, mesmo após exclusões
let proximoId = apostas.length > 0
   ? Math.max(...apostas.map(a => a.id)) + 1
   : 1;

// Middleware que permite ler JSON enviado no corpo (body) das requisições
app.use(express.json());

// GET /aposta
// Retorna a lista completa de apostas cadastradas
app.get("/aposta", (req, res) => {
   res.json(apostas);
});

// POST /aposta
// Cria uma nova aposta a partir dos dados enviados no body
// O front-end (script.js) envia: { jogo, participante, palpite }
app.post("/aposta", (req, res) => {
   const { jogo, participante, palpite } = req.body;

   // Validação dos campos obrigatórios
   const campos = { jogo, participante, palpite };
   for (const campo in campos) {
      if (campos[campo] === undefined || campos[campo] === null || campos[campo] === "") {
         return res.status(400).json({
            mensagem: `Informe o campo ${campo}`
         });
      }
   }

   // Monta a nova aposta com um id sempre único
   const novaAposta = {
      id: proximoId++,
      jogo,
      participante,
      palpite
   };

   apostas.push(novaAposta);
   res.status(201).json(novaAposta);
});

// PUT /aposta/:id
// Atualiza uma aposta existente (jogo, participante e/ou palpite)
app.put("/aposta/:id", (req, res) => {
   const idAposta = parseInt(req.params.id);
   const aposta = apostas.find(a => a.id === idAposta);

   if (!aposta) {
      return res.status(404).json({ mensagem: "Aposta não encontrada." });
   }

   const { jogo, participante, palpite } = req.body;

   // Atualiza apenas os campos enviados, mantendo os demais
   if (jogo !== undefined) aposta.jogo = jogo;
   if (participante !== undefined) aposta.participante = participante;
   if (palpite !== undefined) aposta.palpite = palpite;

   res.json({
      mensagem: "Aposta atualizada com sucesso.",
      aposta
   });
});

// DELETE /aposta/:id
// Remove uma aposta com base no id enviado na URL
app.delete("/aposta/:id", (req, res) => {
   const idAposta = parseInt(req.params.id);
   const index = apostas.findIndex(a => a.id === idAposta);

   if (index === -1) {
      return res.status(404).json({ mensagem: "Aposta não encontrada." });
   }

   const removida = apostas.splice(index, 1)[0];
   res.json({
      mensagem: "Aposta removida com sucesso.",
      removida
   });
});

// Serve arquivos estáticos (html, css, js do front-end) que estiverem na pasta "public"
app.use(express.static('public'));

// Inicia o servidor na porta 3000
app.listen(3000, () => {
   console.log("Servidor rodando em http://localhost:3000");
});