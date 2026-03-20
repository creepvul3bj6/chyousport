// netlify/functions/supabase-proxy.js
// 前端所有 Supabase 操作都走這支 Function
// Supabase Key 只存在 Netlify 環境變數，不會出現在開源程式碼裡

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE',
      },
      body: '',
    };
  }

  try {
    const { path, method = 'GET', body, prefer } = JSON.parse(event.body || '{}');

    if (!path) return { statusCode: 400, body: JSON.stringify({ error: 'Missing path' }) };

    const headers = {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
    };
    if (prefer) headers['Prefer'] = prefer;

    const fetchOptions = { method, headers };
    if (body) fetchOptions.body = JSON.stringify(body);

    const res = await fetch(SUPABASE_URL + '/rest/v1/' + path, fetchOptions);
    const text = await res.text();

    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: text || '[]',
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
