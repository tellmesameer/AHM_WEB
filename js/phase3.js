function initPhase3(){
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
