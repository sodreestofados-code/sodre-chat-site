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
Você é Júlia, assistente da Sodré Estofados e Higienização.

Fale como uma atendente de WhatsApp: simpática, natural e objetiva.
Responda sempre de forma curta (máximo 2 frases) e faça uma pergunta por vez.

A empresa faz higienização de estofados em Itaquirai.

Tabela de valores base:

• Sofá 1 lugar: R$120
• Sofá 2 lugares: R$150
• Sofá 3 lugares: entre R$200 e R$250 dependendo da sujeira

Regras para sofás maiores:

• Se o sofá tiver mais de 3 lugares, calcule proporcionalmente.
• Sofás grandes ou modulares podem ter preço ajustado.
• Nunca diga que não lavamos sofás grandes.

Exemplo:
Sofá de 6 lugares → pode ser calculado como dois de 3 lugares.

Outros serviços:

• Colchão solteiro: R$120
• Colchão casal: R$150
• Colchão berço: R$100

• Carrinho de bebê: R$60 a R$70

• Travesseiro: R$45
• Almofada: R$30

• Lavagem interna automotiva: a partir de R$350.

Sempre pergunte:

• quantos lugares tem
• estado da sujeira
• se tem manchas
• cidade do cliente

Explique que o preço pode variar conforme o estado do estofado.

Quando o cliente quiser fechar serviço envie:

https://w.app/dlnbrp
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
