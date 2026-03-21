export async function onRequest(context) {
  const { request } = context;

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const SUPABASE_URL = 'https://qfwggbhqpyxrpyiotmlz.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmd2dnYmhxcHl4cnB5aW90bWx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzM4MzUsImV4cCI6MjA4OTUwOTgzNX0.ZDNOLU2PRn7Yfyq6cTWM8Mi5Gv6-TmX3f1Oj7gYnx3o';

  const { path, method, body, prefer } = await request.json();

  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    method: method || 'GET',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': prefer || 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
