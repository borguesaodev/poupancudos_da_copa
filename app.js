const express = require("express");
const app = express();

let aposta = [];

app.use(express.json());
// Rotas vão aqui entre o JSON e o static da pasta public
app.get("/aposta", (req, res) => {
   res.json(aposta);
});

app.post("/aposta", (req, res) => {
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


app.use(express.static('public'));

app.listen(3000);
