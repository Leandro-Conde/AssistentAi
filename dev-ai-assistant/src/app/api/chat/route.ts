import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `Você é um assistente de programação. Responda de forma clara:\n${message}`,
    });

    return Response.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error("ERRO REAL:", error);
  
    return Response.json(
      { error: String(error) },
      { status: 500 }
    );
  }/
}