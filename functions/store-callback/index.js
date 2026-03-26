export async function onRequestPost(context) {
  const formData = await context.request.formData();
  
  const storeName = formData.get('CVSStoreName') || '';
  const storeAddr = formData.get('CVSAddress') || '';
  const storeId   = formData.get('CVSStoreID') || '';
  const extraData = formData.get('ExtraData') || '';

  // 單層 JSON.stringify，直接嵌入 JS 物件字面值
  const storeObj = JSON.stringify({ storeName, storeAddr, storeId, storeType: extraData });

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>跳轉中</title></head>
<body>
<p>跳轉中，請稍候...</p>
<script>
  try {
    sessionStorage.setItem('pendingStoreData', ${JSON.stringify(storeObj)});
    console.log('store saved:', sessionStorage.getItem('pendingStoreData'));
  } catch(e) {
    console.error('sessionStorage error:', e);
  }
  // 確保 sessionStorage 寫完再跳
  setTimeout(function() {
    window.location.replace('https://chyousport.pages.dev/');
  }, 100);
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
