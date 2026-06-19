import Groq from 'groq-sdk';

export const GROQ_MODEL = 'llama-3.3-70b-versatile';

function getGroqClient() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

export async function callGroq(systemPrompt: string, userMessage: string): Promise<string> {
  const client = getGroqClient();
  const completion = await client.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.3,
    max_tokens: 2048,
  });
  return completion.choices[0]?.message?.content ?? '';
}

export async function callGroqJSON(systemPrompt: string, userMessage: string): Promise<Record<string, unknown>> {
  const raw = await callGroq(systemPrompt, userMessage);
  const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned);
}
