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
    // 用 Supabase Auth 登入，username 欄位當作 email 使用
    const res = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: username, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.access_token) {
      return new Response(JSON.stringify({ ok: false }), { headers: CORS });
    }
    // 回傳 token 給前端
    return new Response(JSON.stringify({ ok: true, token: data.access_token }), { headers: CORS });
  } catch(e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers: CORS });
  }
}
