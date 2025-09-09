function initPhase3(){
  // avoid double-initialization when includes and DOMContentLoaded both fire
  if(window.__phase3Inited) return;
  window.__phase3Inited = true;

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
