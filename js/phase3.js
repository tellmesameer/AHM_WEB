function initPhase3(){
  // avoid double-initialization when includes and DOMContentLoaded both fire
  if(window.__phase3Inited) return;
  window.__phase3Inited = true;

  // --- Page fade transitions (enter/exit) ---
  (function setupPageTransitions(){
    try{
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(prefersReduced) return; // Respect reduced motion

      const body = document.body;
      // Enter animation: start hidden, then fade in
      body.classList.add('pt-enter');
      requestAnimationFrame(()=>{
        body.classList.add('pt-enter-active');
        // Clean up the enter class after transition
        setTimeout(()=>{
          body.classList.remove('pt-enter');
        }, 300);
      });

      const isInternal = (url)=>{
        try{
          const u = new URL(url, window.location.href);
          return u.origin === window.location.origin;
        }catch(_e){ return false; }
      };

      const shouldIntercept = (a)=>{
        if(!a) return false;
        const href = a.getAttribute('href');
        if(!href || href.startsWith('#')) return false;
        if(a.hasAttribute('download')) return false;
        if(a.target && a.target !== '' && a.target !== '_self') return false;
        return isInternal(href);
      };

      // Lightweight prefetch on hover for internal links
      const prefetchSet = new Set();
      const prefetch = (url)=>{
        try{
          const u = new URL(url, location.href);
          if(prefetchSet.has(u.href)) return;
          prefetchSet.add(u.href);
          const l = document.createElement('link');
          l.rel = 'prefetch';
          l.href = u.href;
          document.head.appendChild(l);
        }catch(_e){ /* ignore */ }
      };

      document.addEventListener('mouseover', function(e){
        const a = e.target.closest && e.target.closest('a');
        if(a && shouldIntercept(a)) prefetch(a.href);
      }, { passive: true });

      // Intercept clicks on internal links for exit fade
      document.addEventListener('click', function(e){
        const anchor = e.target.closest && e.target.closest('a');
        if(!anchor) return;
        if(!shouldIntercept(anchor)) return;
        e.preventDefault();
        const href = anchor.href;
        // Trigger exit fade then navigate
        body.classList.add('pt-exit');
        setTimeout(()=>{ window.location.href = href; }, 220);
      }, true);

      // Also handle non-click navigations (e.g., programmatic, back/forward)
      window.addEventListener('beforeunload', function(){
        body.classList.add('pt-exit');
      });
    }catch(_err){ /* no-op fallback */ }
  })();

  // mobile nav toggle behavior
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if(toggle && nav){
    toggle.addEventListener('click',function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      nav.style.display = expanded ? '' : 'block';
    });
  }

  // prevent double submit and add loading state
  const forms = document.querySelectorAll('form');
  forms.forEach(form=>{
    form.addEventListener('submit',function(e){
      const btn = form.querySelector('button[type=submit]');
      if(btn){
        btn.disabled = true;
        // preserve any loading text span if present
        const loading = btn.querySelector('.btn-loading');
        if(loading){
          loading.classList.remove('d-none');
          const text = btn.querySelector('.btn-text');
          if(text) text.classList.add('d-none');
        } else {
          btn.textContent = 'Submitting...';
        }
      }
    });
  });

  // header dock-on-scroll + hide-on-scroll-direction behavior
  const header = document.querySelector('.site-header');
  if(header){
    const dockThreshold = 80; // px scrolled before docking
    let lastScrollY = window.scrollY || window.pageYOffset;
    let ticking = false;
    const minDelta = 10; // minimum delta to consider direction change

    const updateHeaderState = function(scrollY){
      // dock logic
      if(scrollY > dockThreshold){
        if(!header.classList.contains('docked')){
          header.classList.add('docked');
          document.body.style.paddingTop = header.offsetHeight + 'px';
        }
      } else {
        if(header.classList.contains('docked')){
          header.classList.remove('docked');
          header.classList.remove('hidden');
          document.body.style.paddingTop = '';
        }
      }

      // hide-on-scroll-direction (only when docked)
      if(header.classList.contains('docked')){
        const delta = scrollY - lastScrollY;
        if(Math.abs(delta) > minDelta){
          if(delta > 0){
            // scrolling down -> hide header
            header.classList.add('hidden');
          } else {
            // scrolling up -> show header
            header.classList.remove('hidden');
          }
        }
      }
    };

    const onScroll = function(){
      lastScrollY = lastScrollY || 0;
      const scrollY = window.scrollY || window.pageYOffset;
      if(!ticking){
        window.requestAnimationFrame(function(){
          updateHeaderState(scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // keep padding correct if header height changes (responsive/resized screens)
    window.addEventListener('resize', function(){
      if(header.classList.contains('docked')){
        document.body.style.paddingTop = header.offsetHeight + 'px';
      }
    }, { passive: true });

    // initial check
    updateHeaderState(window.scrollY || window.pageYOffset);
  }

  // Back-to-top button behavior
  const backBtn = document.getElementById('back-to-top-btn');
  if(backBtn){
    const toggleVisibility = function(){
      const scrollY = window.scrollY || window.pageYOffset;
      if(scrollY > 300){
        backBtn.classList.add('show');
      } else {
        backBtn.classList.remove('show');
      }
    };
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    // Click -> smooth scroll
    backBtn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // initial check
    toggleVisibility();
  }
}

// initialize after includes are injected or on DOM ready
if(document.readyState === 'loading'){
  document.addEventListener('includes:loaded', initPhase3);
  document.addEventListener('DOMContentLoaded', initPhase3);
} else {
  // if includes may still load later, listen for includes too
  document.addEventListener('includes:loaded', initPhase3);
  initPhase3();
}
