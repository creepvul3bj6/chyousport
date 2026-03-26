export async function onRequestPost(context) {
  const formData = await context.request.formData();
  
  const storeName = formData.get('CVSStoreName') || '';
  const storeAddr = formData.get('CVSAddress') || '';
  const storeId   = formData.get('CVSStoreID') || '';
  const extraData = formData.get('ExtraData') || '';

  // 用 JSON.stringify 雙重編碼，避免中文或特殊字元破壞 JS 字串
  const storeDataJson = JSON.stringify(
    JSON.stringify({ storeName, storeAddr, storeId, storeType: extraData })
  );

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>跳轉中</title></head>
<body>
<p>跳轉中，請稍候...</p>
<script>
  try {
    var data = ${storeDataJson};
    sessionStorage.setItem('pendingStoreData', data);
  } catch(e) {
    console.error('sessionStorage error:', e);
  }
  window.location.replace('https://chyousport.pages.dev/');
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}

export async function onRequestGet(context) {
  return new Response('Method Not Allowed', { status: 405 });
}
