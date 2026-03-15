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

REGRAS:

• Respostas curtas (máximo 2 frases)
• Faça apenas uma pergunta por vez
• Não repita perguntas que o cliente já respondeu
• Use as informações que o cliente já deu
• Seja simpática mas direta

SERVIÇOS:

Sofá 1 lugar: R$120  
Sofá 2 lugares: R$150  
Sofá 3 lugares: R$200 a R$250

Sofás maiores devem ser calculados proporcionalmente.

Exemplo:
Sofá 6 lugares = dois de 3 lugares.

Outros serviços:

Colchão solteiro: R$120  
Colchão casal: R$150  
Colchão berço: R$100  

Carrinho bebê: R$60 a R$70  

Travesseiro: R$45  
Almofada: R$30  

Lavagem automotiva interna: a partir de R$350

Sempre considere:

• quantidade de lugares
• estado da sujeira
• manchas
• cidade

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
