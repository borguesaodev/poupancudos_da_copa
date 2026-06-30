const express = require("express");
const app = express();

let aposta = [];

app.use(express.json());
// Rotas vão aqui entre o JSON e o static da pasta public

// Rota 1: Ver os jogos
app.get("/aposta", (req, res) => {
   res.json(aposta);
});

// Rota 2: Enviar um palpite
app.post("/aposta", (req, res) => {
   let campos = ["time1", "time2", "golstime1", "golstime2"]
   if(!req.body.time1) {
      return res.json({mensagem: "Informe o Time 1"});
   }

   const palpite = {
       id: aposta.length + 1,
       time1: req.body.time1,
       time2: req.body.time2,
       golstime1: req.body.golstime1,
       golstime2: req.body.golstime2
   };

   aposta.push(palpite);

   res.json(palpite);
});

// Rota 3: Atualizar o placar real do jogo e calcular pontos
app.put("/usuarios/:id", (req, res) => {
   const usuario = usuarios.find(
       u => u.id == req.params.id
   );

   usuario.nome = req.body.nome;

   res.json(usuario);
});



app.use(express.static('public'));

app.listen(3000);
