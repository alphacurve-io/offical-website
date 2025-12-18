// worker.js
export default {
  async fetch(request, env) {
    const cache = caches.default;
    const url = new URL(request.url);
    
    // 只快取首頁 HTML
    if (url.pathname === '/') {
      // 嘗試從快取取得
      let response = await cache.match(request);
      
      if (!response) {
        // 快取沒有，向 origin 請求
        response = await fetch(request);
        
        // 只快取成功的回應
        if (response.ok) {
          // 複製回應以便修改 headers
          response = new Response(response.body, response);
          response.headers.set('Cache-Control', 'public, max-age=3600');
          
          // 存入快取
          await cache.put(request, response.clone());
        }
      }
      
      return response;
    }
    
    // 其他請求直接轉發
    return fetch(request);
  }
};
