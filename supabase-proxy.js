const CORS = {
  'Access-Control-Allow-Origin': 'https://chyousport.pages.dev',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

const ALLOWED = ['https://chyousport.pages.dev'];

function checkOrigin(request) {
  const origin = request.headers.get('Origin') || '';
  const referer = request.headers.get('Referer') || '';
  return ALLOWED.some(a => origin.startsWith(a) || referer.startsWith(a));
}

async function verifyToken(token, supabaseUrl, anonKey) {
  const res = await fetch(supabaseUrl + '/auth/v1/user', {
    headers: {
      'apikey': anonKey,
      'Authorization': 'Bearer ' + token,
    },
  });
  return res.ok;
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
  const ANON_KEY = context.env.SUPABASE_KEY;
  const SERVICE_KEY = context.env.SERVICE_KEY;

  try {
    const { path, method, body, prefer } = await request.json();

    const isWrite = method && ['POST','PATCH','PUT','DELETE'].includes(method.toUpperCase());

    // 寫入操作必須驗證 token
    if (isWrite) {
      const auth = request.headers.get('Authorization') || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      if (!token) {
        return new Response(JSON.stringify({ error: '未授權' }), { status: 401, headers: CORS });
      }
      const valid = await verifyToken(token, SUPABASE_URL, ANON_KEY);
      if (!valid) {
        return new Response(JSON.stringify({ error: 'Token 無效或已過期' }), { status: 401, headers: CORS });
      }
    }

    const useKey = isWrite ? SERVICE_KEY : ANON_KEY;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path.replace(/^\//, '')}`, {
      method: method || 'GET',
      headers: {
        'apikey': useKey,
        'Authorization': `Bearer ${useKey}`,
        'Content-Type': 'application/json',
        'Prefer': prefer || 'return=representation',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    return new Response(text, { status: res.status, headers: CORS });
  } catch(e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: CORS });
  }
}
