const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

const API_KEY = process.env.OPENAI_API_KEY;

/* MEMÓRIA SIMPLES DA CONVERSA */
let historico = [];

/* ROTA TESTE */

app.get("/api", (req, res) => {
  res.send("Servidor do chat Sodré funcionando");
});

/* ROTA CHAT */

app.post("/chat", async (req, res) => {

  try {

    const mensagem = req.body.message;

    historico.push({
      role: "user",
      content: mensagem
    });

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
Você é Júlia, atendente da Sodré Estofados e Higienização.

Fale como uma atendente de WhatsApp.
Responda curto (máximo 2 frases) e faça apenas uma pergunta por vez.

REGRAS DE ORÇAMENTO DE SOFÁ:

• Sofá 1 lugar: R$120
• Sofá 2 lugares: R$150
• Sofá 3 lugares: R$200

Para sofás maiores:

• Cada lugar adicional custa +R$50.

Exemplos:

4 lugares = R$250  
5 lugares = R$300  
6 lugares = R$350  
7 lugares = R$400  

Sempre calcule o valor corretamente baseado na quantidade de lugares.

Nunca diga que não lavamos sofás grandes.

OUTROS SERVIÇOS:

Colchão solteiro: R$120  
Colchão casal: R$150  
Colchão berço: R$100  

Carrinho bebê: R$60 a R$70  

Travesseiro: R$45  
Almofada: R$30  

Lavagem interna automotiva: a partir de R$350.

Sempre pergunte:

• estado da sujeira
• se tem manchas
• cidade do cliente

A empresa atende Itaquirai.

Quando o cliente quiser fechar serviço envie:

https://w.app/dlnbrp
`
          },

          ...historico

        ]

      })

    });

    const data = await resposta.json();

    if (!data.choices) {

      console.log(data);

      return res.json({
        reply: "Erro ao acessar a IA."
      });

    }

    const respostaIA = data.choices[0].message.content;

    historico.push({
      role: "assistant",
      content: respostaIA
    });

    res.json({
      reply: respostaIA
    });

  } catch (erro) {

    console.log(erro);

    res.json({
      reply: "Erro no servidor."
    });

  }

});

/* PORTA */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
