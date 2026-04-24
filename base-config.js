// Central base path for the site. Edit this file to change paths globally.
(function(){
  try{
    // Set the base path to the served AHM_Website folder under workspace root
    window.SITE_BASE = '/AHM_Website/';
    // Ensure trailing slash
    window.SITE_BASE = String(window.SITE_BASE).replace(/\/+$/,'') + '/';
    console.info('[base-config] SITE_BASE set to', window.SITE_BASE);
  }catch(e){
    console.error('[base-config] error setting SITE_BASE', e);
  }
})();
