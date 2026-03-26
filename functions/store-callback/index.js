// Cloudflare Pages Function - debug 版
export async function onRequestPost(context) {
  const formData = await context.request.formData();
  
  // 把所有收到的參數顯示出來
  const allParams = {};
  for (const [key, value] of formData.entries()) {
    allParams[key] = value;
  }

  const storeName = formData.get('CVSStoreName') || '';
  const storeAddr = formData.get('CVSAddress') || '';
  const storeId   = formData.get('CVSStoreID') || '';
  const extraData = formData.get('ExtraData') || '';

  // 暫時顯示所有參數，方便 debug
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Store Callback Debug</title></head>
<body style="font-family:monospace;padding:2rem;">
<h2>收到的參數：</h2>
<pre>${JSON.stringify(allParams, null, 2)}</pre>
<h3>解析結果：</h3>
<p>storeName: ${storeName}</p>
<p>storeAddr: ${storeAddr}</p>
<p>storeId: ${storeId}</p>
<p>extraData: ${extraData}</p>
<br>
<a href="https://chyousport.pages.dev/">回首頁</a>
</body></html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}

export async function onRequestGet(context) {
  return new Response('Method Not Allowed', { status: 405 });
}
