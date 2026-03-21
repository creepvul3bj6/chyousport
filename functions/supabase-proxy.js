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
  const { SUPABASE_URL, SUPABASE_KEY } = context.env;
  try {
    const { path, method, body, prefer } = await context.request.json();
    const res = await fetch(SUPABASE_URL + '/rest/v1/' + path, {
      method: method || 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
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
