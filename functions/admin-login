export async function onRequestPost(context) {
  const { SUPABASE_URL, SUPABASE_KEY } = context.env;
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
  return new Response(JSON.stringify({ ok }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
