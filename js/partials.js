// Lightweight client-side include loader
// Finds elements with `data-include` and fetches the given path, injecting HTML.
// After all includes are loaded, dispatches a custom `includes:loaded` event on document.
(function(){
  const _cache = new Map(); // path -> {html, ts, etag, lastModified}
  const TTL = 1000 * 60 * 5; // 5 minutes

  async function fetchWithCache(path){
    const cached = _cache.get(path);
    const headers = {};
    if(cached){
      // attempt conditional GET
      if(cached.etag) headers['If-None-Match'] = cached.etag;
      if(cached.lastModified) headers['If-Modified-Since'] = cached.lastModified;
    }
    try{
      const res = await fetch(path, {cache:'no-cache', headers});
      if(res.status === 304 && cached){
        cached.ts = Date.now();
        return cached.html;
      }
      if(!res.ok) throw new Error(path + ' -> ' + res.status);
      const html = await res.text();
      const etag = res.headers.get('ETag');
      const lastModified = res.headers.get('Last-Modified');
      _cache.set(path, {html, ts: Date.now(), etag, lastModified});
      return html;
    }catch(err){
      // if cache still valid and within TTL, return it as fallback
      if(cached && (Date.now() - cached.ts) < TTL) return cached.html;
      throw err;
    }
  }

  async function loadIncludes(){
    const els = Array.from(document.querySelectorAll('[data-include]'));
    if(!els.length){
      document.dispatchEvent(new CustomEvent('includes:loaded'));
      return;
    }
    await Promise.all(els.map(async el=>{
      const originalPath = el.getAttribute('data-include');
      // Resolve against document.baseURI first so pages with a <base> tag work
      let resolvedHref = null;
      try{
        // new URL will respect <base href="..."> when resolving
        resolvedHref = new URL(originalPath, document.baseURI).href;
      }catch(e){
        // ignore
      }
      const attempts = resolvedHref
        ? [resolvedHref, originalPath, '/' + originalPath, './' + originalPath]
        : [originalPath, '/' + originalPath, './' + originalPath];
      let loaded = false;
      for(const path of attempts){
        try{
          console.debug('[includes] trying', path);
          const html = await fetchWithCache(path);
          el.innerHTML = html;
          loaded = true;
          console.debug('[includes] loaded (cache ok)', path);
          break;
        }catch(err){
          console.warn('[includes] failed', path, err && err.message ? err.message : err);
        }
      }
      if(!loaded){
        el.innerHTML = '<!-- include failed: ' + originalPath + ' -->';
        console.error('[includes] all attempts failed for', originalPath);
      }
    }));

    document.dispatchEvent(new CustomEvent('includes:loaded'));
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', loadIncludes);
  }else{
    loadIncludes();
  }
})();
