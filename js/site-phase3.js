function initPhase3(){
  if(window.__phase3Inited) return;
  window.__phase3Inited = true;

  try{
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!prefersReduced){
      const target = document.querySelector('main') || document.body;
      target.classList.add('pt-enter');
      requestAnimationFrame(()=>{
        target.classList.add('pt-enter-active');
        setTimeout(()=> target.classList.remove('pt-enter'), 300);
      });
    }
  }catch(_e){}

  // Skeletons for cards
  try{
    const cards = document.querySelectorAll('.service-card, .solution-card, .testimonial-card');
    cards.forEach(card=> card.classList.add('skeleton'));
    const clear = ()=> cards.forEach(card=> card.classList.remove('skeleton'));
    document.addEventListener('includes:loaded', ()=> setTimeout(clear, 300), { once: true });
    setTimeout(clear, 2000);
  }catch(_e){}

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if(toggle && nav){
    toggle.addEventListener('click',function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open', !expanded);
      nav.setAttribute('aria-hidden', String(expanded));
    });
  }

  // Simple form submit protection
  try{
    document.querySelectorAll('form').forEach(form=>{
      form.addEventListener('submit',function(){
        const btn = form.querySelector('button[type=submit]');
        if(btn){ btn.disabled = true; const loading = btn.querySelector('.btn-loading'); if(loading) loading.classList.remove('d-none'); }
      });
    });
  }catch(_e){}

  // Header dock + back-to-top handled here
  try{
    const header = document.querySelector('.site-header');
    if(header){
      const dockThreshold = 80; let lastScrollY = window.scrollY || window.pageYOffset;
      const onScroll = ()=>{
        const scrollY = window.scrollY || window.pageYOffset;
        if(scrollY > dockThreshold && !header.classList.contains('docked')){ header.classList.add('docked'); document.body.style.paddingTop = header.offsetHeight + 'px'; }
        if(scrollY <= dockThreshold && header.classList.contains('docked')){ header.classList.remove('docked'); header.classList.remove('hidden'); document.body.style.paddingTop = ''; }
        const delta = scrollY - lastScrollY; if(Math.abs(delta) > 10){ header.classList.toggle('hidden', delta > 0); }
        lastScrollY = scrollY;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', ()=> { if(header.classList.contains('docked')) document.body.style.paddingTop = header.offsetHeight + 'px'; }, { passive: true });
      onScroll();
    }
  }catch(_e){}

  const backBtn = document.getElementById('back-to-top-btn');
  if(backBtn){
    const toggleVisibility = ()=> backBtn.classList.toggle('show', (window.scrollY || window.pageYOffset) > 300);
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    backBtn.addEventListener('click', ()=> window.scrollTo({ top: 0, behavior: 'smooth' }));
    toggleVisibility();
  }
}

if(document.readyState === 'loading'){
  document.addEventListener('includes:loaded', initPhase3);
  document.addEventListener('DOMContentLoaded', initPhase3);
} else {
  document.addEventListener('includes:loaded', initPhase3);
  initPhase3();
}
