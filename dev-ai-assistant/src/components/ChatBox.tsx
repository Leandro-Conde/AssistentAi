'use client';

import { useState } from 'react';

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
  { role: string; content: string }[]
>([]);

async function handleSend() {
  if (!input) return;

  const userMessage = {
    role: 'user',
    content: input,
  };

  setMessages((prev) => [...prev, userMessage]);

  const currentInput = input;

  setInput('');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: currentInput,
        history: [...messages, userMessage],
      }),
    });

    if (!res.ok) {
      throw new Error('Erro na requisição');
    }

    const data = await res.json();

    const aiMessage = {
      role: 'assistant',
      content: data.reply,
    };

    setMessages((prev) => [...prev, aiMessage]);

  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: 'Erro ao se comunicar com a IA.',
      },
    ]);
  }
}

  return (
    <div className="flex flex-col gap-4 w-full max-w-xl">
      <div className="border p-4 min-h-[150px] rounded">
      {messages.map((msg, index) => (
  <p key={index}>
    <strong>
      {msg.role === 'user' ? 'Você' : 'Anna'}:
    </strong>{' '}
    {msg.content}
  </p>
))}
      </div>

      <textarea
        className="border p-2 rounded"
        placeholder="Digite sua dúvida..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Enviar
      </button>
    </div>
  );
}