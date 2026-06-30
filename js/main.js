/* =========================================================
   Atlas Air & Heat — Interactions
   ========================================================= */
(function () {
  'use strict';

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dec = (target % 1 !== 0) ? 1 : 0;
        var start = null, dur = 1400;
        function tick(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(dec) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target.toFixed(dec) + suffix;
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- Gallery filtering ---- */
  var filterBtns = document.querySelectorAll('.gallery-filters button');
  var galItems = document.querySelectorAll('.gal-item');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-filter');
        galItems.forEach(function (item) {
          var show = cat === 'all' || item.getAttribute('data-cat') === cat;
          item.classList.toggle('hide', !show);
        });
      });
    });
  }

  /* ---- Lightbox ---- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox && galItems.length) {
    var lbImg = lightbox.querySelector('img');
    var visible = function () {
      return Array.prototype.filter.call(galItems, function (i) { return !i.classList.contains('hide'); });
    };
    var current = 0;
    function openAt(items, idx) {
      current = idx;
      var img = items[idx].querySelector('img');
      lbImg.src = img.getAttribute('data-full') || img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    galItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var items = visible();
        openAt(items, items.indexOf(item));
      });
    });
    function close() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
    function step(d) { var items = visible(); openAt(items, (current + d + items.length) % items.length); }
    lightbox.querySelector('.lb-close').addEventListener('click', close);
    lightbox.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    lightbox.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); step(1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ---- Contact form (demo, no backend) ---- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var success = document.getElementById('form-success');
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  }

  /* ---- Pricing toggle (monthly / annual) ---- */
  var planToggle = document.getElementById('plan-toggle');
  if (planToggle) {
    planToggle.addEventListener('change', function () {
      var annual = planToggle.checked;
      document.querySelectorAll('[data-monthly]').forEach(function (el) {
        el.dataset.show = annual ? el.dataset.annual : el.dataset.monthly;
        el.firstChild.textContent = annual ? el.dataset.annual : el.dataset.monthly;
      });
    });
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();

/* ===== Workshop Sites — live demo promo bar =====
   Always-visible sticky bottom CTA shown on every page of this demo. Guides
   visitors straight to booking a consult, with a link back to workshopsites.com.
   Self-contained, dismissible per session; nudges existing corner buttons up. */
(function () {
  if (window.__wsBarLoaded) return;
  window.__wsBarLoaded = true;

  var SLUG = 'hvac'; // utm_source for lead attribution
  var BASE = 'https://workshopsites.com/';
  var Q = '?utm_source=' + SLUG + '-demo&utm_medium=referral&utm_campaign=demo_bar';
  var HOME = BASE + Q;
  var BOOK = BASE + 'appointment.html' + Q;

  function init() {
    try { if (sessionStorage.getItem('wsBarDismissed') === '1') return; } catch (e) {}
    if (document.getElementById('ws-bar')) return;

    var style = document.createElement('style');
    style.textContent = [
      '#ws-bar{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:#0B1F33;border-top:3px solid #E85D04;box-shadow:0 -6px 24px rgba(0,0,0,.3);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;transform:translateY(110%);animation:wsBarUp .55s cubic-bezier(.2,.7,.2,1) .6s forwards}',
      '@keyframes wsBarUp{to{transform:translateY(0)}}',
      '#ws-bar *{box-sizing:border-box}',
      '#ws-bar .ws-in{max-width:1180px;margin:0 auto;display:flex;align-items:center;gap:16px;padding:11px 18px;color:#fff}',
      '#ws-bar .ws-msg{flex:1;min-width:0;font-size:14px;line-height:1.4}',
      '#ws-bar .ws-msg .ws-bolt{color:#F48C06}',
      '#ws-bar .ws-msg b{color:#fff;font-weight:700}',
      '#ws-bar .ws-sub{color:rgba(255,255,255,.66);font-weight:400}',
      '#ws-bar .ws-actions{display:flex;align-items:center;gap:12px;flex-shrink:0}',
      '#ws-bar .ws-visit{color:#cfe0f2;text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}',
      '#ws-bar .ws-visit:hover{color:#fff;text-decoration:underline}',
      '#ws-bar .ws-book{display:inline-flex;align-items:center;gap:6px;background:#E85D04;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:10px 20px;border-radius:8px;white-space:nowrap;box-shadow:0 4px 14px rgba(232,93,4,.4);transition:background .2s ease,transform .15s ease}',
      '#ws-bar .ws-book:hover{background:#F48C06;transform:translateY(-1px)}',
      '#ws-bar .ws-close{background:none;border:none;color:rgba(255,255,255,.55);font-size:20px;line-height:1;cursor:pointer;padding:4px 4px;flex-shrink:0}',
      '#ws-bar .ws-close:hover{color:#fff}',
      // make room + lift any existing bottom-corner buttons above the bar
      'html.ws-bar-on body{padding-bottom:66px}',
      'html.ws-bar-on .float-call,html.ws-bar-on .scroll-top,html.ws-bar-on #scrollTop,html.ws-bar-on [class*="scroll-top"],html.ws-bar-on [class*="scrolltop"],html.ws-bar-on [class*="back-to-top"],html.ws-bar-on [class*="backtotop"]{bottom:80px !important}',
      '@media(max-width:720px){#ws-bar .ws-sub{display:none}#ws-bar .ws-visit{display:none}#ws-bar .ws-in{gap:10px;padding:9px 12px}#ws-bar .ws-book{padding:9px 15px;font-size:13px}html.ws-bar-on body{padding-bottom:60px}}',
      '@media(prefers-reduced-motion:reduce){#ws-bar{animation:none;transform:none}}'
    ].join('');
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.id = 'ws-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Workshop Sites — get a site like this');
    bar.innerHTML =
      '<div class="ws-in">' +
        '<div class="ws-msg"><span class="ws-bolt">⚡</span> <b>Like this demo?</b> ' +
          '<span class="ws-sub">Workshop Sites builds lead-generating websites like this for contractors &amp; local businesses.</span></div>' +
        '<div class="ws-actions">' +
          '<a class="ws-visit" href="' + HOME + '" target="_blank" rel="noopener">Visit WorkshopSites.com</a>' +
          '<a class="ws-book" href="' + BOOK + '" target="_blank" rel="noopener">Book an appointment →</a>' +
          '<button class="ws-close" type="button" aria-label="Dismiss">×</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(bar);
    document.documentElement.classList.add('ws-bar-on');

    bar.querySelector('.ws-close').addEventListener('click', function () {
      bar.remove();
      document.documentElement.classList.remove('ws-bar-on');
      try { sessionStorage.setItem('wsBarDismissed', '1'); } catch (e) {}
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
