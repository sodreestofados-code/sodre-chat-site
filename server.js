import express from "express";
import cors from "cors";

const app = express();

/* ESSENCIAL — faz o site funcionar */
app.use(express.static(".")); 

app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;

/* CHAT */

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

Fale como WhatsApp:
• Respostas curtas (máx 2 frases)
• Natural, simpática e objetiva

REGRAS DE SOFÁ:

1 lugar = 120  
2 lugares = 150  
3 lugares = 200  

Acima de 3:
+50 por lugar

Ex:
4 lugares = 250  
5 lugares = 300  
6 lugares = 350  

Nunca diga que não fazemos.

OUTROS SERVIÇOS:

Colchão solteiro: 120  
Colchão casal: 150  
Berço: 100  

Carrinho bebê: 60 a 70  

Travesseiro: 45  
Almofada: 30  

Automotiva interna: a partir de 350

Sempre pergunte:
• sujeira
• manchas
• cidade

Atendemos Itaquirai.

Se quiser fechar:
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

/* segurança contra erro */
if(!data.choices){
return res.json({ reply: "Deu um erro aqui 😅, pode tentar novamente?" });
}

res.json({
reply: data.choices[0].message.content
});

} catch (erro) {

console.log("ERRO:", erro);

res.json({
reply: "Tive um probleminha aqui 😅 tenta de novo pra mim?"
});

}

});

/* PORTA */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("Servidor rodando na porta " + PORT);
});
