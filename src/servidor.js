const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

const API_KEY = process.env.OPENAI_API_KEY;

/* ROTA TESTE */
app.get("/api", (req, res) => {
  res.send("Servidor do chat Sodré funcionando");
});

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
            content: "Você é Júlia, assistente da Sodré Estofados. Seja simpática e ajude clientes a pedir orçamento de limpeza de estofados."
          },

          {
            role: "user",
            content: mensagem
          }

        ]

      })

    });

    const data = await resposta.json();

    console.log("Resposta da OpenAI:", data);

    if (!data.choices) {

      return res.json({
        reply: "Erro ao acessar a IA. Verifique a chave da API ou saldo da conta."
      });

    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (erro) {

    console.log("Erro:", erro);

    res.json({
      reply: "Erro no servidor."
    });

  }

});

/* PORTA DO RENDER */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
