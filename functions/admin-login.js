const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};
export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: CORS });
  }
  const SUPABASE_URL = 'https://qfwggbhqpyxrpyiotmlz.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmd2dnYmhxcHl4cnB5aW90bWx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzM4MzUsImV4cCI6MjA4OTUwOTgzNX0.ZDNOLU2PRn7Yfyq6cTWM8Mi5Gv6-TmX3f1Oj7gYnx3o';
  try {
    const { username, password } = await context.request.json();
    const res = await fetch(
      SUPABASE_URL + '/rest/v1/admin_users?select=id&username=eq.' +
      encodeURIComponent(username) + '&password=eq.' + encodeURIComponent(password),
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
        },
      }
    );
    const data = await res.json();
    const ok = Array.isArray(data) && data.length > 0;
    return new Response(JSON.stringify({ ok }), { headers: CORS });
  } catch(e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers: CORS });
  }
}
