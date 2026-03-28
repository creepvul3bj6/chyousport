export async function onRequestPost(context) {
  const formData = await context.request.formData();

  const storeName = formData.get('CVSStoreName') || '';
  const storeAddr = formData.get('CVSAddress')   || '';
  const storeId   = formData.get('CVSStoreID')   || '';
  const storeType = formData.get('ExtraData')    || '';

  const storeData = JSON.stringify({ storeName, storeAddr, storeId, storeType });

  // 用 HTML 寫入 sessionStorage 再跳回首頁，URL 完全乾淨
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body>
<script>
  try {
    sessionStorage.setItem('pendingStoreData', ${JSON.stringify(storeData)});
  } catch(e) {}
  window.location.replace('https://chyousport.pages.dev/');
</script>
</body></html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}

export async function onRequestGet(context) {
  return new Response('Method Not Allowed', { status: 405 });
}
