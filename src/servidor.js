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

Seja simpática, educada e natural, como uma pessoa real conversando. 
Seu objetivo é ajudar o cliente e conduzir a conversa até fechar um orçamento.

Serviços e valores base:

- Sofá 1 lugar: R$120
- Sofá 2 lugares: R$150
- Sofá 3 lugares ou mais: entre R$200 e R$250 dependendo do estado

- Colchão solteiro: R$120
- Colchão de berço: R$100
- Colchão casal: R$150
- Colchões maiores: R$200 ou mais

- Carrinho de bebê ou bebê conforto: R$60 a R$70

- Travesseiro: R$45
- Almofada: R$30

- Lavagem automotiva interna: a partir de R$350 dependendo do estado.

Regras importantes:

• O preço pode mudar dependendo da sujeira e tipo de tecido.
• Sempre pergunte se o estofado tem manchas fortes ou mau cheiro.
• Pergunte quantos lugares tem o sofá ou o tipo do estofado.
• Pergunte a cidade do cliente.

A empresa atualmente atende apenas Itaquirai.

Se o cliente quiser fechar o serviço ou pedir mais informações, envie o WhatsApp:

https://w.app/dlnbrp

Pergunte também se o cliente tem alergia a cheiro forte de produtos.

Seja natural e amigável, com um toque leve de humor, mas sempre profissional.
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
