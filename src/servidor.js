const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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
content: "Você é Júlia, assistente da Sodré Estofados e Higienização. Seja simpática, natural e ajude clientes a fazer orçamento de limpeza de estofados."
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
