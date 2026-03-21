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
    const { filename, base64, contentType } = await context.request.json();
    const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const res = await fetch(
      SUPABASE_URL + '/storage/v1/object/product-images/' + filename,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
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
