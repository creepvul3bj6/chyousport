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
    const { filename: rawFilename, base64, contentType } = await request.json();

    // ── 1. 圖片類型限制 ──
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_TYPES.includes(contentType)) {
      return new Response(JSON.stringify({ error: '只允許上傳 JPG、PNG、WEBP、GIF 圖片' }), { status: 400, headers: CORS });
    }

    // ── 2. 檔案大小限制（5MB）──
    const MAX_SIZE = 5 * 1024 * 1024;
    const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    if (binary.length > MAX_SIZE) {
      return new Response(JSON.stringify({ error: '圖片不可超過 5MB' }), { status: 400, headers: CORS });
    }

    // ── 3. filename 消毒（移除路徑穿越、特殊字元）──
    const sanitized = rawFilename.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.{2,}/g, '_');

    // ── 4. path 白名單（只允許寫入 product-images/）──
    const ALLOWED_PREFIX = 'product-images/';
    const filename = ALLOWED_PREFIX + sanitized.replace(/^.*[\/]/, ''); // 強制去除任何路徑前綴

    const res = await fetch(
      SUPABASE_URL + '/storage/v1/object/' + filename,
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
    const url = SUPABASE_URL + '/storage/v1/object/public/' + filename;
    return new Response(JSON.stringify({ url }), { headers: CORS });
  } catch(e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: CORS });
  }
}
