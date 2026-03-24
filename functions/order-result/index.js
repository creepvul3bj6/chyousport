export async function onRequestPost(context) {
  const formData = await context.request.formData();
  const params = {};
  for (const [key, value] of formData.entries()) {
    params[key] = value;
  }
  
  const rtnCode = params.RtnCode || '';
  const tradeNo = params.MerchantTradeNo || '';
  const amt = params.TradeAmt || '';
  const msg = params.RtnMsg || '';

  const success = rtnCode === '1';

  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>付款結果 — 球友體育用品社</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'DM Sans', 'Noto Sans TC', sans-serif;
      background: #f5f5f5;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .card {
      background: #fff;
      border-radius: 16px;
      padding: 2.5rem 2rem;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .icon { font-size: 3.5rem; margin-bottom: 1rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: .5rem; }
    .sub { color: #666; font-size: .95rem; margin-bottom: 1.5rem; line-height: 1.6; }
    .info-box {
      background: #f9f9f9;
      border-radius: 10px;
      padding: 1rem 1.2rem;
      margin-bottom: 1.5rem;
      text-align: left;
      font-size: .88rem;
      color: #444;
      line-height: 2;
    }
    .info-box span { color: #111; font-weight: 600; }
    .btn {
      display: inline-block;
      background: #c0392b;
      color: #fff;
      padding: .75rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: .95rem;
    }
    .btn.secondary {
      background: #eee;
      color: #333;
      margin-left: .5rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${success ? '✅' : '❌'}</div>
    <h1>${success ? '付款成功！' : '付款失敗'}</h1>
    <p class="sub">${success ? '感謝您的訂購，我們將盡快為您安排出貨。' : (msg || '付款未完成，請重新嘗試或聯繫我們。')}</p>
    ${success && tradeNo ? `<div class="info-box">
      訂單編號：<span>${tradeNo}</span><br>
      付款金額：<span>NT$ ${amt}</span>
    </div>` : ''}
    <a href="/" class="btn">回首頁</a>
    ${!success ? '<a href="javascript:history.back()" class="btn secondary">重試</a>' : ''}
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}

export async function onRequestGet(context) {
  return new Response(`<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>付款結果 — 球友體育用品社</title>
  <style>
    body { font-family: sans-serif; background:#f5f5f5; min-height:100vh; display:flex; align-items:center; justify-content:center; }
    .card { background:#fff; border-radius:16px; padding:2.5rem 2rem; max-width:480px; width:100%; text-align:center; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
    .icon { font-size:3.5rem; margin-bottom:1rem; }
    h1 { font-size:1.5rem; font-weight:700; margin-bottom:.5rem; }
    .sub { color:#666; margin-bottom:1.5rem; }
    .btn { display:inline-block; background:#c0392b; color:#fff; padding:.75rem 2rem; border-radius:8px; text-decoration:none; font-weight:600; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🛍️</div>
    <h1>球友體育用品社</h1>
    <p class="sub">感謝您的光臨！</p>
    <a href="/" class="btn">前往購物</a>
  </div>
</body>
</html>`, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}
