import { NextRequest, NextResponse } from 'next/server';
import { callGroq } from '@/lib/ai/groq-client';
import { LIFESTYLE_PROMPT } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const { message, language = 'en', context = '' } = await req.json();
    const systemPrompt = LIFESTYLE_PROMPT + (context ? `\n\nPATIENT CONTEXT:\n${context}` : '');
    const userMsg = language === 'hi'
      ? `Language: Hindi. Patient asks: ${message}`
      : `Language: English. Patient asks: ${message}`;
    const response = await callGroq(systemPrompt, userMsg);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Lifestyle advice error:', error);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 });
  }
}
