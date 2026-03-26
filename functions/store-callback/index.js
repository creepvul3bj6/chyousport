export async function onRequestPost(context) {
  const formData = await context.request.formData();
  
  const storeName = formData.get('CVSStoreName') || '';
  const storeAddr = formData.get('CVSAddress') || '';
  const storeId   = formData.get('CVSStoreID') || '';
  const extraData = formData.get('ExtraData') || '';

  // 用 JS 寫入 sessionStorage 再跳回首頁，避免 URL 參數丟失
  const storeData = JSON.stringify({ storeName, storeAddr, storeId, storeType: extraData });

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<script>
  sessionStorage.setItem('pendingStoreData', '${storeData.replace(/'/g, "\\'")}');
  window.location.replace('https://chyousport.pages.dev/');
</script>
跳轉中...
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}

export async function onRequestGet(context) {
  return new Response('Method Not Allowed', { status: 405 });
}
