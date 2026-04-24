// Lightweight client-side include loader (cleaned)
// Finds elements with `data-include` and fetches the given path, injecting HTML.
// Dispatches `includes:loaded` after all includes are processed.
(function(){
  const _cache = new Map();
  const TTL = 1000 * 60 * 5; // 5 minutes

  async function fetchWithCache(path){
      const cached = _cache.get(path);
      if(cached && (Date.now() - cached.ts) < TTL) return cached.html;

      const headers = {};
      if(cached){
          if(cached.etag) headers['If-None-Match'] = cached.etag;
          if(cached.lastModified) headers['If-Modified-Since'] = cached.lastModified;
      }
      const res = await fetch(path, {cache:'no-cache', headers});
      if(res.status === 304 && cached){ cached.ts = Date.now(); return cached.html; }
      if(!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const html = await res.text();
      _cache.set(path, {html, ts: Date.now(), etag: res.headers.get('ETag'), lastModified: res.headers.get('Last-Modified')});
      return html;
  }

  async function loadIncludes(){
    const els = Array.from(document.querySelectorAll('[data-include]'));
    if(!els.length){ document.dispatchEvent(new CustomEvent('includes:loaded')); return; }

    await Promise.all(els.map(async el=>{
      const originalPath = el.getAttribute('data-include') || '';
      // Strip legacy prefixes so path is relative to /AHM_Website/
      const sanitized = String(originalPath)
        .replace(/^\/?AHM_WEB\//i, '')
        .replace(/^\/?AHM_Website\//i, '')
        .replace(/^\/?site\//i, '')
        .replace(/^\.\//, '')
        .replace(/^\/+/, '');

      const primary = (typeof window !== 'undefined' && typeof window.withBase === 'function')
        ? window.withBase(sanitized)
        : '/' + sanitized;

      const candidates = [primary, '/' + sanitized, './' + sanitized, sanitized].filter(Boolean);
      const attempts = Array.from(new Set(candidates));

      let loaded = false;
      for(const path of attempts){
        try{
          const html = await fetchWithCache(path);
          el.innerHTML = html;
          loaded = true;
          document.dispatchEvent(new CustomEvent('include:loaded', { detail: { original: originalPath, chosen: path } }));
          break;
        }catch(_e){ /* try next */ }
      }
      if(!loaded){ el.innerHTML = '<!-- Failed to load component: ' + originalPath + ' -->'; }
      // Update attribute to sanitized relative so subsequent logic sees normalized values
      el.setAttribute('data-include', sanitized);
    }));

    document.dispatchEvent(new CustomEvent('includes:loaded'));
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadIncludes);
  else loadIncludes();
})();
