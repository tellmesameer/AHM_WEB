// Central site configuration
// Dynamically detects the site's base path so links work on GitHub Pages and locally
(function(){
  if(typeof window === 'undefined') return;

  // If a value was pre-set (e.g., inline before this script), honor it.
  if(window.SITE_BASE){
    window.SITE_BASE = String(window.SITE_BASE).replace(/\/+$/,'') + '/';
    return;
  }

  try{
    const {protocol, pathname} = window.location;

    // file:// — use relative current folder
    if(protocol === 'file:'){
      window.SITE_BASE = './';
      return;
    }

    // http(s):// — infer from path segments
    const segments = pathname.split('/').filter(Boolean);
    // Try to anchor to the repo folder if present anywhere in the path
    const anchorIndex = segments.findIndex(seg => seg.toLowerCase() === 'ahm_web');
    let base = '/';
    if(anchorIndex >= 0){
      base = '/' + segments.slice(0, anchorIndex + 1).join('/') + '/';
    }else{
      // Otherwise assume site is served from root
      base = '/';
    }

    window.SITE_BASE = base.replace(/\/+$/,'') + '/';
  }catch(_e){
    // Safe fallback: relative
    window.SITE_BASE = './';
  }

  // Remove leading project folder when authored as "/AHM_WEB/..."
  function stripProjectPrefix(path){
    return String(path).replace(/^\/?AHM_WEB\//i, '');
  }

  // Expose a small helper to prefix paths with SITE_BASE
  window.withBase = function(path){
    if(!path) return path;
    const normalizedBase = String(window.SITE_BASE || './').replace(/\/+$/,'') + '/';
    const withoutProj = stripProjectPrefix(path);
    const clean = String(withoutProj).replace(/^\/+/, '');
    return normalizedBase + clean;
  };

  // On DOM ready, normalize common attributes that were authored with absolute 
  // "/AHM_WEB/" paths so they work under dynamic base as well.
  function rewriteAttributes(){
    const selector = [
      'a[href^="/AHM_WEB/"]',
      'link[href^="/AHM_WEB/"]',
      'script[src^="/AHM_WEB/"]',
      'img[src^="/AHM_WEB/"]',
      '[data-include^="/AHM_WEB/"]'
    ].join(',');
    document.querySelectorAll(selector).forEach(el=>{
      if(el.hasAttribute('href')){
        const v = el.getAttribute('href');
        el.setAttribute('href', window.withBase(v));
      }
      if(el.hasAttribute('src')){
        const v = el.getAttribute('src');
        el.setAttribute('src', window.withBase(v));
      }
      if(el.hasAttribute('data-include')){
        const v = el.getAttribute('data-include');
        el.setAttribute('data-include', window.withBase(v));
      }
    });

    // Normalize <base href> if present and static
    const baseEl = document.querySelector('base[href]');
    if(baseEl){
      const href = baseEl.getAttribute('href') || '';
      if(/^\//.test(href)){
        baseEl.setAttribute('href', window.SITE_BASE);
      }
    }
  }

  // Observe DOM additions and attribute changes early to prevent initial 404s
  try{
    const observer = new MutationObserver((mutations)=>{
      let needsRewrite = false;
      for(const m of mutations){
        if(m.type === 'childList' && (m.addedNodes && m.addedNodes.length)){
          needsRewrite = true; break;
        }
        if(m.type === 'attributes'){
          const name = m.attributeName || '';
          if(name === 'href' || name === 'src' || name === 'data-include'){
            needsRewrite = true; break;
          }
        }
      }
      if(needsRewrite) rewriteAttributes();
    });
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['href','src','data-include']
    });
  }catch(_e){}

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', rewriteAttributes, {once:true});
  }else{
    rewriteAttributes();
  }

  // Re-run rewriting after async includes are injected
  document.addEventListener('includes:loaded', rewriteAttributes);
})();
