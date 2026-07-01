const express = require("express");
const app = express();

// Simulação de Banco de Dados na memória
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
app.use(express.json());
// Rotas vão aqui entre o JSON e o static da pasta public
app.get("/aposta", (req, res) => {
   res.json(aposta);
});

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

   const palpite = {
      id: aposta.length + 1,
      jogo: req.body.jogo,
      time1: req.body.time1,
      time2: req.body.time2,
      golsTime1: req.body.golsTime1,
      golsTime2: req.body.golsTime2
   };

   aposta.push(palpite);

   res.json(palpite);
});


app.use(express.static('public'));

app.listen(3000);
