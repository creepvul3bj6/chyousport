const CORS = {
  'Access-Control-Allow-Origin': 'https://chyousport.pages.dev',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const ALLOWED = ['https://chyousport.pages.dev'];

function checkOrigin(request) {
  const origin = request.headers.get('Origin') || '';
  const referer = request.headers.get('Referer') || '';
  return ALLOWED.some(a => origin.startsWith(a) || referer.startsWith(a));
}

export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: CORS });
  }
  if (!checkOrigin(request)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: CORS });
  }

  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SUPABASE_KEY = context.env.SUPABASE_KEY;

  try {
    const { username, password } = await request.json();
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
