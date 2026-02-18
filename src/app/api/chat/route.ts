import { google } from '@ai-sdk/google';
import { streamText, stepCountIs, convertToModelMessages, type UIMessage } from 'ai';
import { tools } from '@/lib/ai/tools';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';

// Best-effort in-memory rate limit (per warm instance).
// Serverless cold starts reset the map, but it still guards against
// burst abuse within a single instance's lifetime.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW = 60_000; // 1 minute
const MAX_MAP_SIZE = 500; // prevent unbounded memory growth
const MAX_MESSAGES = 30;

function getRateLimitKey(req: Request): string {
  return req.headers.get('x-forwarded-for')
    ?? req.headers.get('x-real-ip')
    ?? 'anonymous';
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();

  // Evict stale entries to bound memory usage
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    for (const [k, v] of rateLimitMap) {
      if (now > v.resetAt) rateLimitMap.delete(k);
    }
    // If still too large after cleanup, clear entirely
    if (rateLimitMap.size > MAX_MAP_SIZE) rateLimitMap.clear();
  }

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

  // Limit message count
  const trimmedMessages = messages.slice(-MAX_MESSAGES);

  try {
    // Convert UIMessage[] (parts-based) to ModelMessage[] (content-based)
    const modelMessages = await convertToModelMessages(trimmedMessages as UIMessage[], { tools });

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: buildSystemPrompt(usedTemplates),
      messages: modelMessages,
      tools,
      stopWhen: stepCountIs(3),
      maxRetries: 0,
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
