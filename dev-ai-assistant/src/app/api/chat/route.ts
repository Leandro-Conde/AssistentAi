export async function POST(req: Request) {
  try {
    // pega mensagem e histórico enviados pelo frontend
    const { history } = await req.json();

    // transforma histórico em texto compreensível pra IA
    const conversationHistory = history
      .map(
        (msg: any) =>
          `${msg.role === 'user' ? 'Usuário' : 'Anna'}: ${msg.content}`
      )
      .join('\n');

    console.log("Histórico recebido:");
    console.log(conversationHistory);

    // chama o Ollama
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        model: 'phi3',

        prompt: `
Você é Anna, uma assistente de programação.

PERSONALIDADE:
- inteligente
- casual
- levemente sarcástica
- confiante
- divertida às vezes
- experiente em tecnologia

COMPORTAMENTO:
- fale como uma pessoa normal da internet
- use português brasileiro natural
- evite respostas robóticas
- evite formalidade
- responda de forma curta
- não faça textos gigantes
- às vezes provoque o usuário levemente
- explique programação de forma clara

REGRAS:
- nunca responda em outro idioma
- nunca invente histórias
- nunca crie diálogos falsos
- nunca continue conversa sozinho
- responda apenas ao que foi perguntado

Histórico da conversa:
${conversationHistory}

Anna:
`,

        stream: false,
      }),
    });

    // transforma resposta em JSON
    const data = await res.json();

    console.log("Resposta da IA:");
    console.log(data);

    // devolve resposta pro frontend
    return Response.json({
      reply: data.response,
    });

  } catch (error) {
    console.error("ERRO:", error);

    return Response.json(
      {
        error: 'Erro ao chamar IA local',
      },
      {
        status: 500,
      }
    );
  }
}