import { NextRequest, NextResponse } from 'next/server';
import { callGroqJSON } from '@/lib/ai/groq-client';
import { RISK_ASSESSMENT_PROMPT } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await callGroqJSON(RISK_ASSESSMENT_PROMPT, `Provide treatment suggestions: ${JSON.stringify(body)}`);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 500 });
  }
}
