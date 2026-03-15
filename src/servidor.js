const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ROTA INICIAL (TESTE DO SERVIDOR) */
app.get("/", (req, res) => {
  res.send("Servidor do chat Sodré Estofados está online!");
});

/* CHAVE DA OPENAI */
const API_KEY = process.env.OPENAI_API_KEY;

/* ROTA DO CHAT */
app.post("/chat", async (req, res) => {

  try {

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
            content: "Você é Júlia, assistente da Sodré Estofados e Higienização. Seja simpática, natural e ajude clientes a pedir orçamento de limpeza de estofados."
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

  } catch (erro) {

    console.error(erro);

    res.status(500).json({
      reply: "Desculpe, ocorreu um erro no servidor."
    });

  }

});

/* PORTA CORRETA PARA O RENDER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
