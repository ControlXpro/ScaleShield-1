/* ScaleShield v3 — shared interactions */
(function(){
  var $ = function(s,c){return (c||document).querySelector(s)};
  var $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  /* nav scrolled state */
  var nav = $('#nav');
  function onScroll(){ if(nav) nav.classList.toggle('scrolled', window.scrollY > 12); }
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  /* mobile drawer */
  var drawer=$('#drawer'), scrim=$('#scrim'), burger=$('#burger'), close=$('#drawerClose');
  function openD(){ if(drawer){drawer.classList.add('open'); scrim&&scrim.classList.add('open'); document.body.style.overflow='hidden';} }
  function closeD(){ if(drawer){drawer.classList.remove('open'); scrim&&scrim.classList.remove('open'); document.body.style.overflow='';} }
  burger&&burger.addEventListener('click',openD);
  close&&close.addEventListener('click',closeD);
  scrim&&scrim.addEventListener('click',closeD);
  $$('.drawer a').forEach(function(a){a.addEventListener('click',closeD)});

  /* reveal on scroll + counters */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('in');
        $$('[data-count]', e.target).forEach(count);
        if(e.target.hasAttribute('data-count')) count(e.target);
        io.unobserve(e.target);
      }
    });
  },{threshold:.16, rootMargin:'0px 0px -8% 0px'});
  $$('.reveal,.stagger').forEach(function(el){io.observe(el)});
  $$('[data-count]').forEach(function(el){ if(!el.closest('.reveal,.stagger')) io.observe(el); });

  function count(el){
    if(el._done) return; el._done=true;
    var target=parseFloat(el.getAttribute('data-count'))||0;
    var pre=el.getAttribute('data-prefix')||'', suf=el.getAttribute('data-suffix')||'';
    var dur=1300, t0=null;
    function step(ts){
      if(!t0)t0=ts; var p=Math.min((ts-t0)/dur,1);
      var e=1-Math.pow(1-p,3);
      var v=target*e;
      var disp = target%1!==0 ? v.toFixed(1) : Math.round(v).toLocaleString();
      el.textContent=pre+disp+suf;
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* footer year */
  var y=$('#year'); if(y) y.textContent=new Date().getFullYear();
})();

/* ---- Contact chooser: contact CTAs offer WhatsApp + Telegram ---- */
(function(){
  var WA='https://wa.me/447412860721', TG='https://t.me/scaleshieldsupport', modal;
  function build(){
    modal=document.createElement('div'); modal.className='contact-ov';
    modal.innerHTML='<div class="contact-box"><button class="contact-x" aria-label="Close">×</button>'
      +'<div class="contact-h">Contact <span class="grad">ScaleShield</span></div>'
      +'<p class="contact-p">Pick how you’d like to reach us — an operator replies fast on both, 24/7.</p>'
      +'<a class="contact-opt" href="'+WA+'" target="_blank" rel="noopener"><span class="ci wa">💬</span><span class="ct"><b>WhatsApp</b><small>Chat on WhatsApp</small></span><span class="cg">→</span></a>'
      +'<a class="contact-opt" href="'+TG+'" target="_blank" rel="noopener"><span class="ci tg">✈️</span><span class="ct"><b>Telegram</b><small>Message @scaleshieldsupport</small></span><span class="cg">→</span></a>'
      +'</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click',function(e){ if(e.target===modal||e.target.closest('.contact-x')) closeC(); });
  }
  function openC(){ if(!modal) build(); modal.classList.add('show'); document.body.style.overflow='hidden'; }
  function closeC(){ if(modal){ modal.classList.remove('show'); document.body.style.overflow=''; } }
  window.openContact=openC;
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href*="t.me/scaleshieldsupport"], a[href*="wa.me/447412860721"]');
    if(a && !a.classList.contains('float-tg') && !a.classList.contains('btn-wa') && !a.closest('.drawer') && !a.closest('.nav')){ e.preventDefault(); openC(); }
  });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeC(); });
})();
