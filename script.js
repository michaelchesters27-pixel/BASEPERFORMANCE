(function(){
  const els = document.querySelectorAll('.fade-in');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); }
    });
  }, {threshold:0.12});
  els.forEach(el=>obs.observe(el));

  const toggle = document.getElementById('mobileToggle');
  const drawerRoot = document.getElementById('mobileDrawer');
  const navLinks = document.querySelector('.nav-links');
  if(drawerRoot && navLinks && !drawerRoot.querySelector('.drawer')){
    const drawer = document.createElement('div');
    drawer.className = 'drawer';
    drawer.innerHTML = navLinks.innerHTML;
    drawerRoot.appendChild(drawer);
    drawer.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=> drawerRoot.classList.remove('open'));
    });
  }
  if(toggle && drawerRoot){
    toggle.addEventListener('click', ()=> drawerRoot.classList.toggle('open'));
  }

  
  // --- Mobile menu: close drawer when any menu link is selected (robust)
  if(drawerRoot){
    // event delegation (covers cloned links and any future additions)
    drawerRoot.addEventListener('click', (e)=>{
      const a = e.target.closest('a[href^="#"]');
      if(a){ drawerRoot.classList.remove('open'); }
    });
    // close after hash navigation as well (redundant safety)
    window.addEventListener('hashchange', ()=> drawerRoot.classList.remove('open'));
  }


  // Netlify form success state
  try{
    const url = new URL(window.location.href);
    if(url.searchParams.get('success') === '1'){
      const successEl = document.getElementById('formSuccess');
      if(successEl){ successEl.hidden = false; }
    }
  }catch(_e){}

  const lightbox = document.getElementById('lightbox');
  const lbClose = document.getElementById('lbClose');
  const lbMedia = document.getElementById('lbMedia');
  const lbCap = document.getElementById('lbCap');

  // Real gallery images (added by TBH)
  const galleryImages = {
    'Training floor': 'assets/gallery/training-floor.webp',
    'Small group session': 'assets/gallery/small-group-session.webp',
    'Community vibe': 'assets/gallery/community-vibe.webp',
    'Branding / merch': 'assets/gallery/branding-merch.webp'
  };

  function resolveGallerySrc(label){
    return galleryImages[label] || null;
  }

  // Simple inline SVG placeholders (keeps the site "complete" without needing stock photos)
  function svgData(label){
    const safe = (label || 'Gallery').replace(/[<>"']/g,'');
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#151922"/>
            <stop offset="1" stop-color="#0b0d10"/>
          </linearGradient>
          <radialGradient id="r" cx="20%" cy="15%" r="80%">
            <stop offset="0" stop-color="rgba(214,43,43,0.35)"/>
            <stop offset="1" stop-color="rgba(214,43,43,0)"/>
          </radialGradient>
        </defs>
        <rect width="1200" height="700" fill="url(#g)"/>
        <rect width="1200" height="700" fill="url(#r)"/>
        <g opacity="0.18">
          <circle cx="980" cy="130" r="160" fill="#ffffff"/>
          <circle cx="1080" cy="260" r="90" fill="#ffffff"/>
          <circle cx="220" cy="560" r="130" fill="#ffffff"/>
        </g>
        <g>
          <text x="70" y="110" fill="rgba(233,237,243,0.9)" font-family="Inter,system-ui,Arial" font-size="42" font-weight="800">B.A.S.E Performance</text>
          <text x="70" y="160" fill="rgba(233,237,243,0.75)" font-family="Inter,system-ui,Arial" font-size="26" font-weight="600">${safe}</text>
          <text x="70" y="620" fill="rgba(233,237,243,0.55)" font-family="Inter,system-ui,Arial" font-size="18" font-weight="700">Replace this tile with a real photo when ready.</text>
        </g>
      </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  // Dress the gallery tiles so they look like real image cards
  document.querySelectorAll('.gph').forEach(btn=>{
    const label = btn.getAttribute('data-placeholder') || btn.textContent;
    const realSrc = resolveGallerySrc(label);
    btn.style.backgroundImage = realSrc
      ? `url("${realSrc}")`
      : `url("${svgData(label)}")`;
    btn.style.backgroundSize = 'cover';
    btn.style.backgroundPosition = 'center';
    btn.setAttribute('aria-label', `Open image: ${label}`);
  });

  function openLb(label){
    if(!lightbox || !lbMedia) return;
    const cap = label || 'Gallery';
    if(lbCap) lbCap.textContent = cap;

    const realSrc = resolveGallerySrc(cap);
    lbMedia.innerHTML = realSrc
      ? `<img src="${realSrc}" alt="${cap}">`
      : `<img src="${svgData(cap)}" alt="${cap}">`;

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
  }
  function closeLb(){
    if(!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
  }

  document.querySelectorAll('.gph').forEach(btn=>{
    btn.addEventListener('click', ()=> openLb(btn.getAttribute('data-placeholder') || btn.textContent));
  });

  if(lbClose) lbClose.addEventListener('click', closeLb);
  if(lightbox) lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLb(); });
})();
