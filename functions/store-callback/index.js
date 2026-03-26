export async function onRequestPost(context) {
  const formData = await context.request.formData();

  const storeName = formData.get('CVSStoreName') || '';
  const storeAddr = formData.get('CVSAddress')   || '';
  const storeId   = formData.get('CVSStoreID')   || '';
  const storeType = formData.get('ExtraData')    || '';

  // 用 query string 把門市資料帶回前端，不靠 sessionStorage
  const params = new URLSearchParams({ storeName, storeAddr, storeId, storeType });
  return Response.redirect(`https://chyousport.pages.dev/?${params.toString()}`, 302);
}

export async function onRequestGet(context) {
  return new Response('Method Not Allowed', { status: 405 });
}
