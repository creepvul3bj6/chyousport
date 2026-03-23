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
  if (!checkOrigin(request)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: CORS });
  }

  // 驗證 token
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    return new Response(JSON.stringify({ error: '未授權' }), { status: 401, headers: CORS });
  }

  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SERVICE_KEY = context.env.SERVICE_KEY;
  const ANON_KEY = context.env.SUPABASE_KEY;

  const valid = await verifyToken(token, SUPABASE_URL, ANON_KEY);
  if (!valid) {
    return new Response(JSON.stringify({ error: 'Token 無效或已過期' }), { status: 401, headers: CORS });
  }

  try {
    const { filename, base64, contentType } = await request.json();
    const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const res = await fetch(
      SUPABASE_URL + '/storage/v1/object/product-images/' + filename,
      {
        method: 'POST',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': 'Bearer ' + SERVICE_KEY,
          'Content-Type': contentType,
          'Cache-Control': '3600',
        },
        body: binary,
      }
    );
    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: 500, headers: CORS });
    }
    const url = SUPABASE_URL + '/storage/v1/object/public/product-images/' + filename;
    return new Response(JSON.stringify({ url }), { headers: CORS });
  } catch(e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: CORS });
  }
}
