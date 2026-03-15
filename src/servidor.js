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
content: `
Você é Júlia, assistente da empresa Sodré Estofados e Higienização.

Fale como uma atendente real de WhatsApp.

REGRAS IMPORTANTES:

• Responda sempre de forma curta (máximo 2 frases).
• Faça apenas uma pergunta por vez.
• Seja simpática mas direta.
• Evite textos longos.
• A conversa deve parecer natural.

Tabela de valores base:

Sofá 1 lugar: 120
Sofá 2 lugares: 150
Sofá 3 lugares: 200 a 250

Colchão solteiro: 120  
Colchão casal: 150  
Colchão berço: 100  

Carrinho bebê: 60 a 70  

Travesseiro: 45  
Almofada: 30  

Lavagem interna automotiva: a partir de 350.

Sempre pergunte:
• quantos lugares tem o sofá
• estado da sujeira
• cidade do cliente

A empresa atende apenas Itaquirai.

Quando o cliente quiser fechar serviço envie:

https://w.app/dlnbrp

Fale sempre de forma curta e natural.
`

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
