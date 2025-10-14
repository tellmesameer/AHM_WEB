// Lightweight client-side include loader
// Finds elements with `data-include` and fetches the given path, injecting HTML.
// After all includes are loaded, dispatches a custom `includes:loaded` event on document.
(function(){
  const _cache = new Map(); // path -> {html, ts, etag, lastModified}
  const TTL = 1000 * 60 * 5; // 5 minutes

  async function fetchWithCache(path){
      const cached = _cache.get(path);

      // if cache still valid and within TTL, return it
      if(cached && (Date.now() - cached.ts) < TTL) {
          console.debug('[includes] using cache', path);
          return cached.html;
      }

      const headers = {};
      if(cached){// attempt conditional GET
          if(cached.etag) headers['If-None-Match'] = cached.etag;
          if(cached.lastModified) headers['If-Modified-Since'] = cached.lastModified;
      }
      try{
          const res = await fetch(path, {cache:'no-cache', headers});
          if(res.status === 304 && cached){
              cached.ts = Date.now(); // Update timestamp
              console.debug('[includes] using 304 cache', path);
              return cached.html;
          }
          if(!res.ok) throw new Error(path + ' -> ' + res.status);
          const html = await res.text();
          const etag = res.headers.get('ETag');
          const lastModified = res.headers.get('Last-Modified');
          _cache.set(path, {html, ts: Date.now(), etag, lastModified});
          console.debug('[includes] fetched and cached', path);
          return html;
      }catch(err){
          console.error('[includes] fetch error for', path, err);
          // If there was a previously cached version (even if expired), return it as a fallback, otherwise propagate the error
          if (cached) {
              console.warn('[includes] returning expired cache for', path, 'due to fetch error:', err.message);
              return cached.html; // Return expired cache as fallback
          }
          // If no cache and fetch failed, re-throw the error
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
      // Strip hardcoded project prefix when present
      const sanitizedPath = String(originalPath).replace(/^\/?AHM_WEB\//i, '');
      // Resolve against document.baseURI first so pages with a <base> tag work
      let resolvedHref = null;
      try{
          // new URL will respect <base href="..."> when resolving
          resolvedHref = new URL(sanitizedPath, document.baseURI).href;
      }catch(e){// ignore
          console.debug('[includes] Could not resolve against baseURI', sanitizedPath, e);
      }

      // Use central SITE_BASE (inserted via js/site-config.js)
      const SITE_BASE = (typeof window !== 'undefined' && window.SITE_BASE) ? window.SITE_BASE : './';
      // Ensure SITE_BASE ends with a single slash
      const normalizedBase = SITE_BASE.replace(/\/+$/,'') + '/';

      // Construct the path using SITE_BASE + sanitizedPath (without leading slash)
      const basePathed = normalizedBase + sanitizedPath.replace(/^\/+/, '');

      // Fallback paths (less reliable)
      const fallbacks = [ sanitizedPath, '/' + sanitizedPath, './' + sanitizedPath ];

      // Try the SITE_BASE prefixed path first, then fallback paths
      // Prioritize resolvedHref if available, but prefer basePathed (SITE_BASE)
      const attempts = resolvedHref ? [resolvedHref, basePathed, ...fallbacks] : [basePathed, ...fallbacks];

      let loaded = false;
      for(const path of attempts){
          try{
              console.debug('[includes] trying', path);
              const html = await fetchWithCache(path);
              el.innerHTML = html;
              loaded = true;
              console.debug('[includes] loaded (cache ok)', path);
              try{
                console.info('[includes] final-resolved-path', {original: originalPath, chosen: path});
              }catch(e){
                console.error('[includes] error logging final-resolved-path', e);
              }
              break; // Exit loop on success
          }catch(err){
              console.warn('[includes] failed', path, err?.message ?? err);
              // Continue to next attempt
          }
      }
      if (!loaded) {
          console.error('[includes] ALL attempts failed for', originalPath, 'Element will remain empty or with original content.');
          // Optionally, add a visual error indicator
          el.innerHTML = '<!-- Failed to load component: ' + originalPath + ' -->';
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
