exports.handler = async (event) => {
  // 只接受 POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { username, password } = JSON.parse(event.body);

    // 從 Netlify 環境變數讀取（不會出現在程式碼裡）
    const correctUser = process.env.ADMIN_USERNAME;
    const correctPass = process.env.ADMIN_PASSWORD;

    if (username === correctUser && password === correctPass) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true }),
      };
    } else {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, message: '帳號或密碼錯誤' }),
      };
    }
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, message: '請求格式錯誤' }),
    };
  }
};
