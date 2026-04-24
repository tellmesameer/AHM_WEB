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

  console.log('[DEBUG] SITE_BASE:', window.SITE_BASE);

  function normalizePath(path){
    let value = String(path || '').trim();
    // Remove common authoring prefixes so result is relative to the AHM_Website root
    value = value.replace(/^\/?site\//i, '');
    value = value.replace(/^\/?AHM_WEB\//i, '');
    value = value.replace(/^\/?AHM_Website\//i, '');
    // Strip any leading slashes left-over
    return value.replace(/^\/+/, '');
  }

  console.log('[DEBUG] normalizePath:', normalizePath.toString());

  // Expose a small helper to prefix paths with SITE_BASE
  window.withBase = function(path){
    if(!path) return path;
    const normalizedBase = String(window.SITE_BASE || './').replace(/\/+$/,'') + '/';
    const clean = normalizePath(path);
    return normalizedBase + clean;
  };

  // On DOM ready, normalize common attributes that were authored with absolute 
  // "/AHM_WEB/", "/AHM_Website/", or "site/" paths so they work under dynamic base.
  function rewriteAttributes(){
    const elements = document.querySelectorAll('[href],[src],[data-include]');
    elements.forEach(el=>{
      console.log('[DEBUG] Processing element:', el);
      ['href','src','data-include'].forEach(attr => {
        if(!el.hasAttribute(attr)) return;
        const value = el.getAttribute(attr);
        if(!value) return;
        console.log('[DEBUG] Attribute:', attr, 'Value:', el.getAttribute(attr));
        if(/^(?:\/?(?:AHM_WEB|AHM_Website|site)\/)/i.test(value)){
          el.setAttribute(attr, window.withBase(value));
        }
      });
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
