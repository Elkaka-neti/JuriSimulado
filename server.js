const express = require("express");
const Websocket = require("ws");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

let votos = { aFavor: 0, contra: 0 };

var server = app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


const wss = new Websocket.Server({ server });


const broadcast = () => {
  const data = JSON.stringify(votos);
  console.log(data)
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
};


app.post("/apoiar", (req, res) => {
  console.log("aceitou")
  votos.aFavor++;
  broadcast(); 
  res.json(votos);
});

app.post("/negar", (req, res) => {
  console.log("negou")
  votos.contra++;
  broadcast();
  res.json(votos);
});


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


app.get("/apoiar", (req, res) => {
  res.sendFile(__dirname + "/votacao.html");
});

app.get("/negar", (req, res) => {
  res.sendFile(__dirname + "/votacao.html");
});


  
