const express = require("express");
const app = express();

// Simulação de Banco de Dados na memória
// Cada item representa um jogo da Copa de 94 (oitavas de final) com o placar real
let aposta = [
   { id: 1, jogo: 'Oitavas - Jogo 1', time1: 'Alemanha', time2: 'Bélgica', golsTime1: 3, golsTime2: 2 },
   { id: 2, jogo: 'Oitavas - Jogo 2', time1: 'Espanha', time2: 'Suíça', golsTime1: 3, golsTime2: 0 },
   { id: 3, jogo: 'Oitavas - Jogo 3', time1: 'Arábia Saudita', time2: 'Suécia', golsTime1: 1, golsTime2: 3 },
   { id: 4, jogo: 'Oitavas - Jogo 4', time1: 'Romênia', time2: 'Argentina', golsTime1: 3, golsTime2: 2 },
   { id: 5, jogo: 'Oitavas - Jogo 5', time1: 'Holanda', time2: 'Irlanda', golsTime1: 2, golsTime2: 0 },
   { id: 6, jogo: 'Oitavas - Jogo 6', time1: 'Brasil', time2: 'Estados Unidos', golsTime1: 1, golsTime2: 0 },
   { id: 7, jogo: 'Oitavas - Jogo 7', time1: 'Itália', time2: 'Nigéria', golsTime1: 2, golsTime2: 1 },
   { id: 8, jogo: 'Oitavas - Jogo 8', time1: 'México', time2: 'Bulgária', golsTime1: 1, golsTime2: 1 }
];

// Middleware que permite ler JSON enviado no corpo (body) das requisições
app.use(express.json());

// Rotas vão aqui entre o JSON e o static da pasta public

// GET /aposta
// Retorna a lista completa de jogos/apostas cadastrados
app.get("/aposta", (req, res) => {
   res.json(aposta);
});

// POST /aposta
// Cria um novo jogo/aposta a partir dos dados enviados no body
app.post("/aposta", (req, res) => {
   // Lista dos campos obrigatórios que devem vir no body da requisição
   const campos = ["jogo", "time1", "time2", "golsTime1", "golsTime2"];
   // validação dos capos 
   for (const campo of campos) {
      // Verifica se o campo está vazio, não enviado ou nulo
      // IMPORTANTE: não bloqueia 0 (zero), porque zero é válido para gols
      if (req.body[campo] === undefined || req.body[campo] === null || req.body[campo] === "") {
         // Retorna mensagem de erro e encerra a requisição
         return res.json({
            mensagem: `Informe o campo ${campo}`
         });
      }
   }
   // Monta o novo objeto de aposta com um id sequencial simples
   const palpite = {
      id: aposta.length + 1,
      jogo: req.body.jogo,
      time1: req.body.time1,
      time2: req.body.time2,
      golsTime1: req.body.golsTime1,
      golsTime2: req.body.golsTime2
   };
   // Adiciona a nova aposta na "base de dados" em memória
   aposta.push(palpite);
   // Devolve a aposta recém-criada como confirmação
   res.json(palpite);
});

// POST /aposta/:id
// Atualiza o placar (golsTime1 e golsTime2) de um jogo já existente
// e verifica quais outros jogos têm o mesmo placar enviado (acertos)
app.post("/aposta/:id", (req, res) => {
   // req.params.id sempre chega como string, então convertemos para número
   const idJogo = parseInt(req.params.id);
   // Extrai do body o placar informado pelo usuário
   const { golsTime1, golsTime2 } = req.body
   // Procura o jogo correspondente ao id da URL
   const jogo = aposta.find(
      a => a.id === idJogo
   );
   if (!jogo) {
      // Se não encontrar o jogo, retorna erro 404 (não encontrado)
      return res.status(404).send("Não encontrado aposta. ");
   }
   // Atualiza o placar do jogo encontrado com os valores enviados
   jogo.golsTime1 = golsTime1;
   jogo.golsTime2 = golsTime2;

   // Percorre todos os jogos e verifica quais têm o mesmo placar do palpite enviado (acertos)
   const resultado = [];
   for(let i = 0; i < aposta.length; i++){
      // Compara o placar de cada jogo com o placar enviado no body
      if (aposta[i].golsTime1 === golsTime1 && aposta[i].golsTime2 === golsTime2) {
         // Se bateu certinho, adiciona esse jogo na lista de acertos
         resultado.push(aposta[i]);
      }
   }

   // Retorna o jogo atualizado junto com a lista de jogos que bateram esse placar
   res.json({
      mensagem: "Placar atualizado com sucesso.",
      jogo: jogo,
      acertos: resultado
   });
});

// PUT /aposta/:id
// Atualiza (aumenta/altera) o placar (golsTime1 e golsTime2) de um jogo já existente
// e verifica quais outros jogos têm o mesmo placar enviado (acertos)
app.put("/aposta/:id", (req, res) => {
   // req.params.id sempre chega como string, então convertemos para número
   const idJogo = parseInt(req.params.id);
   // Extrai do body o placar informado pelo usuário
   const { golsTime1, golsTime2 } = req.body
   // Procura o jogo correspondente ao id da URL
   const jogo = aposta.find(
      a => a.id === idJogo
   );
   if (!jogo) {
      // Se não encontrar o jogo, retorna erro 404 (não encontrado)
      return res.status(404).send("Não encontrado aposta. ");
   }
   // Atualiza o placar do jogo encontrado com os valores enviados
   jogo.golsTime1 = golsTime1;
   jogo.golsTime2 = golsTime2;

   // Percorre todos os jogos e verifica quais têm o mesmo placar do palpite enviado (acertos)
   const resultado = [];
   for(let i = 0; i < aposta.length; i++){
      // Compara o placar de cada jogo com o placar enviado no body
      if (aposta[i].golsTime1 === golsTime1 && aposta[i].golsTime2 === golsTime2) {
         // Se bateu certinho, adiciona esse jogo na lista de acertos
         resultado.push(aposta[i]);
      }
   }

   // Retorna o jogo atualizado junto com a lista de jogos que bateram esse placar
   res.json({
      mensagem: "Placar atualizado com sucesso.",
      jogo: jogo,
      acertos: resultado
   });
});

// DELETE /aposta/:id
// Remove um jogo/aposta da lista com base no id enviado na URL
// Obs: apenas apaga o registro, não há reembolso/estorno de nada
app.delete("/aposta/:id", (req, res) => {
   // Converte o id da URL (string) para número
   const idJogo = parseInt(req.params.id);
   // Procura a posição (índice) do jogo dentro do array
   const index = aposta.findIndex(
      a => a.id === idJogo
   );
   if (index === -1) {
      // Se não encontrar o jogo, retorna erro 404 (não encontrado)
      return res.status(404).send("Não encontrado aposta. ");
   }
   // Remove 1 item do array a partir da posição encontrada
   // splice retorna um array com o(s) item(ns) removido(s), por isso o [0]
   const removida = aposta.splice(index, 1)[0];
   // Confirma a remoção devolvendo o item que foi excluído
   res.json({
      mensagem: "Aposta removida com sucesso.",
      removida: removida
   });
});

// Serve arquivos estáticos (html, css, js do front-end) que estiverem na pasta "public"
app.use(express.static('public'));

// Inicia o servidor na porta 3000
app.listen(3000);