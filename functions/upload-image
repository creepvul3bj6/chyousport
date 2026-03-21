export async function onRequestPost(context) {
  const { SUPABASE_URL, SUPABASE_KEY } = context.env;
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
    return new Response(JSON.stringify({ error: err }), { status: 500 });
  }

  const url = SUPABASE_URL + '/storage/v1/object/public/product-images/' + filename;
  return new Response(JSON.stringify({ url }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
