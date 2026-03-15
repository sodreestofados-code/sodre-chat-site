const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor do chat Sodré Estofados está funcionando!");
});

const API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {

  const mensagem = req.body.message;

  const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é Júlia, assistente da Sodré Estofados e Higienização. Seja simpática e ajude clientes com orçamento de limpeza de estofados."
        },
        {
          role: "user",
          content: mensagem
        }
      ]
    })
  });

  const data = await resposta.json();

  res.json({
    reply: data.choices[0].message.content
  });

});

app.listen(3000, () => {
  console.log("Servidor rodando");
});
