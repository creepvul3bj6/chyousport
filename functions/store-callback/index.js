export async function onRequestPost(context) {
  const formData = await context.request.formData();
  
  const storeName = formData.get('CVSStoreName') || '';
  const storeAddr = formData.get('CVSAddress') || '';
  const storeId   = formData.get('CVSStoreID') || '';
  const extraData = formData.get('ExtraData') || '';

  const params = new URLSearchParams({ storeName, storeAddr, storeId, storeType: extraData });
  const redirectURL = `https://chyousport.pages.dev/?${params.toString()}`;

  // 用 HTML 自動跳轉，避免 Cloudflare 截掉 query string
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=${redirectURL}">
  <script>window.location.replace('${redirectURL}');</script>
</head>
<body>跳轉中...</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}

export async function onRequestGet(context) {
  return new Response('Method Not Allowed', { status: 405 });
}
