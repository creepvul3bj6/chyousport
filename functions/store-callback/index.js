export async function onRequestPost(context) {
  const formData = await context.request.formData();
  
  const storeName = formData.get('CVSStoreName') || '';
  const storeAddr = formData.get('CVSAddress') || '';
  const storeId   = formData.get('CVSStoreID') || '';
  const extraData = formData.get('ExtraData') || '';

  const params = new URLSearchParams({
    storeName,
    storeAddr,
    storeId,
    storeType: extraData,
  });

  const redirectURL = `https://chyousport.pages.dev/?${params.toString()}`;
  
  return Response.redirect(redirectURL, 302);
}

export async function onRequestGet(context) {
  return new Response('Method Not Allowed', { status: 405 });
}
