import { google } from '@ai-sdk/google';
import { streamText, stepCountIs } from 'ai';
import { tools } from '@/lib/ai/tools';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW = 60_000; // 1 minute
const MAX_MESSAGE_LENGTH = 500;
const MAX_MESSAGES = 30;

function getRateLimitKey(req: Request): string {
  return req.headers.get('x-forwarded-for')
    ?? req.headers.get('x-real-ip')
    ?? 'anonymous';
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: Request) {
  const ip = getRateLimitKey(req);
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: { messages?: unknown[]; usedTemplates?: string[] };
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { messages, usedTemplates = [] } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Messages required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Truncate to prevent abuse
  const trimmedMessages = messages.slice(-MAX_MESSAGES).map((m: any) => {
    if (m.role === 'user' && typeof m.content === 'string' && m.content.length > MAX_MESSAGE_LENGTH) {
      return { ...m, content: m.content.slice(0, MAX_MESSAGE_LENGTH) };
    }
    return m;
  });

  try {
    const result = streamText({
      model: google('gemini-2.5-flash-preview-05-20'),
      system: buildSystemPrompt(usedTemplates),
      messages: trimmedMessages,
      tools,
      stopWhen: stepCountIs(3),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred processing your request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
