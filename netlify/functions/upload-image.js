// netlify/functions/upload-image.js
// 圖片上傳到 Supabase Storage，Key 藏在環境變數

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { filename, base64, contentType } = JSON.parse(event.body);

    // base64 → binary
    const buffer = Buffer.from(base64, 'base64');

    const res = await fetch(
      SUPABASE_URL + '/storage/v1/object/product-images/' + filename,
      {
        method: 'POST',
        headers: {
          'Content-Type': contentType || 'image/jpeg',
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
        },
        body: buffer,
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: err }) };
    }

    const publicUrl = SUPABASE_URL + '/storage/v1/object/public/product-images/' + filename;
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: publicUrl }),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
