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
