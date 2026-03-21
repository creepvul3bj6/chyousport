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
  const { SUPABASE_URL, SUPABASE_KEY } = context.env;
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
