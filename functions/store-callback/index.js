// Cloudflare Pages Function
// 接收綠界電子地圖選店後的 POST 回傳，轉成 GET redirect 回首頁

export async function onRequestPost(context) {
  const formData = await context.request.formData();
  
  const storeName = formData.get('CVSStoreName') || '';
  const storeAddr = formData.get('CVSAddress') || '';
  const storeId   = formData.get('CVSStoreID') || '';
  const extraData = formData.get('ExtraData') || ''; // '711' or 'family'

  // redirect 回首頁，帶門市資訊在 URL 參數
  const params = new URLSearchParams({
    storeName,
    storeAddr,
    storeId,
    storeType: extraData,
  });

  return Response.redirect(`https://chyousport.pages.dev/?${params.toString()}`, 302);
}

export async function onRequestGet(context) {
  return new Response('Method Not Allowed', { status: 405 });
}
