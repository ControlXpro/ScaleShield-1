/* ScaleShield shared interaction + animation engine.
   Loaded by every marketing page. Adding an animation here applies site-wide. */
(function(){
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* ---- scroll progress bar ---- */
  var prog = document.createElement("div");
  prog.className = "scroll-prog";
  document.body.appendChild(prog);

  /* ---- cursor spotlight (desktop only) ---- */
  if(!reduce && matchMedia("(pointer:fine)").matches){
    var spot = document.createElement("div");
    spot.className = "spotlight";
    document.body.appendChild(spot);
    addEventListener("mousemove", function(e){
      spot.style.left = e.clientX + "px";
      spot.style.top = e.clientY + "px";
    }, {passive:true});
  }

  /* ---- nav scroll hide/scrolled + progress ---- */
  var nav = document.getElementById("nav");
  var lastY = 0;
  addEventListener("scroll", function(){
    var y = scrollY;
    var h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (h>0 ? (y/h*100) : 0) + "%";
    if(nav){
      nav.classList.toggle("scrolled", y>40);
      if(y>lastY && y>400) nav.classList.add("hidden"); else nav.classList.remove("hidden");
    }
    lastY = y;
  }, {passive:true});

  /* ---- mobile drawer ---- */
  var drawer = document.getElementById("drawer");
  var burger = document.getElementById("burger");
  var dclose = document.getElementById("drawerClose");
  if(burger && drawer) burger.onclick = function(){ drawer.classList.add("open"); };
  if(dclose && drawer) dclose.onclick = function(){ drawer.classList.remove("open"); };
  if(drawer) drawer.querySelectorAll("a").forEach(function(a){ a.onclick = function(){ drawer.classList.remove("open"); }; });

  /* ---- reveal on scroll (all variants + stagger) ---- */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.12, rootMargin:"0px 0px -8% 0px"});
  document.querySelectorAll(".reveal,.reveal-l,.reveal-r,.reveal-sc,.stagger").forEach(function(el){ io.observe(el); });

  /* ---- animated counters ---- */
  function fmt(n){ return n.toLocaleString("en-US"); }
  function animateCount(el){
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || "";
    var prefix = el.dataset.prefix || "";
    var dec = parseInt(el.dataset.dec || "0", 10);
    var dur = 1600, start = performance.now();
    function tick(now){
      var p = Math.min((now-start)/dur, 1);
      var eased = 1 - Math.pow(1-p, 3);
      var val = target * eased;
      var shown = dec>0 ? val.toFixed(dec) : fmt(Math.round(val));
      el.textContent = prefix + shown + suffix;
      if(p<1) requestAnimationFrame(tick);
      else el.textContent = prefix + (dec>0 ? target.toFixed(dec) : fmt(Math.round(target))) + suffix;
    }
    requestAnimationFrame(tick);
  }
  var cio = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ animateCount(e.target); cio.unobserve(e.target); } });
  }, {threshold:.5});
  document.querySelectorAll("[data-count]").forEach(function(el){ cio.observe(el); });

  /* ---- magnetic buttons ---- */
  if(!reduce) document.querySelectorAll(".magnetic").forEach(function(btn){
    btn.addEventListener("mousemove", function(e){
      var r = btn.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width/2) * .25;
      var y = (e.clientY - r.top - r.height/2) * .35;
      btn.style.transform = "translate(" + x + "px," + y + "px) translateY(-3px)";
    });
    btn.addEventListener("mouseleave", function(){ btn.style.transform = ""; });
  });

  /* ---- 3D tilt cards ---- */
  if(!reduce) document.querySelectorAll(".tilt").forEach(function(card){
    card.addEventListener("mousemove", function(e){
      var r = card.getBoundingClientRect();
      var rx = ((e.clientY - r.top)/r.height - .5) * -6;
      var ry = ((e.clientX - r.left)/r.width - .5) * 6;
      card.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-8px)";
    });
    card.addEventListener("mouseleave", function(){ card.style.transform = ""; });
  });

  /* ---- gold-burst hover position ---- */
  document.querySelectorAll(".burst").forEach(function(el){
    el.addEventListener("mousemove", function(e){
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---- button ripple on click ---- */
  document.querySelectorAll(".btn").forEach(function(b){
    b.addEventListener("click", function(e){
      var r = b.getBoundingClientRect();
      var rip = document.createElement("span");
      rip.className = "rip";
      rip.style.left = (e.clientX - r.left) + "px";
      rip.style.top = (e.clientY - r.top) + "px";
      b.appendChild(rip);
      setTimeout(function(){ rip.remove(); }, 600);
    });
  });

  /* ---- hero parallax (any [data-parallax] img) ---- */
  var plx = document.querySelectorAll("[data-parallax]");
  if(!reduce && plx.length) addEventListener("scroll", function(){
    var y = scrollY;
    if(y < 900) plx.forEach(function(el){
      var sp = parseFloat(el.dataset.parallax) || .18;
      el.style.transform = "translateY(" + (y*sp) + "px) scale(1.06)";
    });
  }, {passive:true});

  /* ---- text scramble on [data-scramble] (runs once on load) ---- */
  function scramble(el){
    var final = el.dataset.scramble;
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&";
    var frame = 0, out, done;
    var queue = final.split("").map(function(c,i){ return {c:c, start:Math.floor(i*1.5), end:Math.floor(i*1.5)+10}; });
    function run(){
      out = ""; done = 0;
      queue.forEach(function(q){
        if(frame >= q.end){ out += q.c; done++; }
        else if(frame >= q.start){ out += "<span style='color:var(--gold2);opacity:.7'>" + chars[Math.floor(Math.random()*chars.length)] + "</span>"; }
        else out += "";
      });
      el.innerHTML = out;
      if(done < queue.length){ frame++; requestAnimationFrame(run); }
      else el.textContent = final;
    }
    run();
  }
  if(!reduce) document.querySelectorAll("[data-scramble]").forEach(function(el){
    var once = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ scramble(el); once.unobserve(el); } });
    }, {threshold:.6});
    once.observe(el);
  });

  /* ---- live-number ticker (demo dashboards) — increments [data-live] ---- */
  if(!reduce) document.querySelectorAll("[data-live]").forEach(function(el){
    var base = parseFloat(el.dataset.live);
    setInterval(function(){
      base += Math.random() * (parseFloat(el.dataset.step) || 40);
      el.textContent = "$" + Math.round(base).toLocaleString("en-US");
    }, 2200);
  });

  /* ---- smooth in-page anchor offset for fixed nav ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener("click", function(e){
      var id = a.getAttribute("href");
      if(id.length>1){
        var t = document.querySelector(id);
        if(t){ e.preventDefault(); var top = t.getBoundingClientRect().top + scrollY - 96; scrollTo({top:top, behavior:"smooth"}); }
      }
    });
  });

  /* ---- inject floating WhatsApp button on every page (sits above Telegram) ---- */
  var WA_ICON = '<svg viewBox="0 0 32 32"><path d="M16.04 4C9.96 4 5.02 8.94 5.02 15.02c0 2.12.62 4.1 1.68 5.78L5 27l6.36-1.66c1.6.88 3.44 1.38 5.4 1.38h.01c6.07 0 11.01-4.94 11.01-11.02C28.79 8.94 22.12 4 16.04 4zm6.45 15.6c-.27.76-1.58 1.46-2.18 1.5-.58.05-1.06.27-3.58-.75-3.02-1.22-4.94-4.3-5.1-4.5-.15-.2-1.22-1.62-1.22-3.1 0-1.47.77-2.2 1.04-2.5.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.18.01.44-.07.68.52.27.66.92 2.27.99 2.43.07.16.12.35.02.55-.1.2-.15.32-.3.5-.15.18-.32.4-.46.53-.15.15-.3.3-.13.6.17.3.76 1.25 1.63 2.03 1.12.99 2.06 1.3 2.36 1.45.3.15.47.12.64-.07.17-.2.74-.86.94-1.16.2-.3.4-.25.66-.15.27.1 1.7.8 2 .95.3.15.5.22.57.34.07.12.07.7-.2 1.46z"/></svg>';
  var TG_ICON = '<svg viewBox="0 0 24 24"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>';
  var TG_URL = "https://t.me/scaleshieldsupport", WA_URL = "https://wa.me/447412860721";
  if(!document.querySelector(".float-wa")){
    var wa = document.createElement("a");
    wa.className = "float-wa"; wa.href = WA_URL;
    wa.target = "_blank"; wa.rel = "noopener"; wa.setAttribute("aria-label", "WhatsApp");
    wa.innerHTML = WA_ICON;
    document.body.appendChild(wa);
  }

  /* ---- contact-choice modal: any GENERIC contact CTA opens "WhatsApp or Telegram?" ----
     Explicit channel buttons (labelled "Telegram"/"WhatsApp", the floating buttons,
     and the labelled contact cards) pass straight through. */
  if(!document.querySelector(".cmodal")){
    var m = document.createElement("div");
    m.className = "cmodal";
    m.innerHTML =
      '<div class="cmodal-card">'+
        '<div class="cmodal-ey"><span style="width:6px;height:6px;border-radius:50%;background:var(--gold2);display:inline-block"></span> Talk to ScaleShield</div>'+
        '<h3>How do you want to reach us?</h3>'+
        '<p class="sub">Real operators, 24/7. We reply fast on both — pick whichever you prefer.</p>'+
        '<div class="cmodal-opts">'+
          '<a class="cmodal-opt tg" href="'+TG_URL+'" target="_blank" rel="noopener">'+TG_ICON+'<span>Telegram <small>@scaleshieldsupport · fastest reply</small></span><span class="arr">→</span></a>'+
          '<a class="cmodal-opt wa" href="'+WA_URL+'" target="_blank" rel="noopener">'+WA_ICON+'<span>WhatsApp <small>Message our team directly</small></span><span class="arr">→</span></a>'+
        '</div>'+
        '<button class="cmodal-close" type="button">Maybe later</button>'+
      '</div>';
    document.body.appendChild(m);
    function closeC(){ m.classList.remove("open"); }
    m.addEventListener("click", function(e){ if(e.target===m) closeC(); });
    m.querySelector(".cmodal-close").onclick = closeC;
    m.querySelectorAll(".cmodal-opt").forEach(function(a){ a.addEventListener("click", closeC); });
    document.addEventListener("keydown", function(e){ if(e.key==="Escape") closeC(); });

    document.querySelectorAll('a[href*="t.me/scaleshieldsupport"],a[href*="wa.me/447412860721"]').forEach(function(a){
      var label = (a.textContent||"").trim().toLowerCase();
      var explicit = label==="telegram" || label==="whatsapp"
        || a.classList.contains("float-tg") || a.classList.contains("float-wa")
        || a.classList.contains("cc") || a.classList.contains("cmodal-opt")
        || a.hasAttribute("data-direct");
      if(explicit) return;
      a.addEventListener("click", function(e){ e.preventDefault(); m.classList.add("open"); });
    });
  }

  /* ---- site-wide language switcher: English <-> Brazilian Portuguese (pt-BR) ----
     Auto-translates every page via Google Translate, persisted across all pages
     with the `googtrans` cookie. Google's own banner/gadget is hidden (ss.css) and
     we expose a clean on-brand EN | PT toggle in the nav + mobile drawer. */
  (function(){
    function readLang(){ return /googtrans=\/en\/[\w-]+/.test(document.cookie) ? "pt" : "en"; }
    function setLang(lang){
      var host = location.hostname;
      var kill = "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
      document.cookie = kill;
      document.cookie = kill + "domain=" + host + ";";
      document.cookie = kill + "domain=." + host + ";";
      if(lang === "pt"){
        var v = "googtrans=/en/pt;path=/;";
        document.cookie = v;
        document.cookie = v + "domain=" + host + ";";
        document.cookie = v + "domain=." + host + ";";
      }
      location.reload();
    }
    var cur = readLang();
    function makePill(extra){
      var w = document.createElement("div");
      w.className = "lang-sw" + (extra ? " " + extra : "");
      w.setAttribute("role", "group");
      w.setAttribute("aria-label", "Language");
      w.innerHTML = '<span class="lang-globe" aria-hidden="true">🌐</span>' +
                    '<button type="button" data-l="en">EN</button>' +
                    '<button type="button" data-l="pt">PT</button>';
      w.querySelectorAll("button").forEach(function(b){
        if(b.dataset.l === cur) b.classList.add("on");
        b.addEventListener("click", function(){ if(b.dataset.l !== cur) setLang(b.dataset.l); });
      });
      return w;
    }
    var navCta = document.querySelector(".nav-cta");
    if(navCta && !navCta.querySelector(".lang-sw")) navCta.insertBefore(makePill(), navCta.firstChild);
    if(drawer && !drawer.querySelector(".lang-sw")) drawer.appendChild(makePill("lang-sw-drawer"));

    /* hidden Google Translate mount + loader (once) — translation is driven by the
       googtrans cookie above, so the gadget UI itself stays off-screen/hidden */
    if(!document.getElementById("google_translate_element")){
      var mount = document.createElement("div");
      mount.id = "google_translate_element";
      mount.setAttribute("aria-hidden", "true");
      document.body.appendChild(mount);
      window.googleTranslateElementInit = function(){
        try{ new google.translate.TranslateElement({ pageLanguage:"en", includedLanguages:"en,pt", autoDisplay:false }, "google_translate_element"); }catch(e){}
      };
      var gs = document.createElement("script");
      gs.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      gs.async = true;
      document.body.appendChild(gs);
    }
  })();
})();
