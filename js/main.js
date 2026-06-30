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

/* ===== Workshop Sites — live demo credit & promo badge =====
   Injected on every page of this demo to guide visitors to book a
   consult or return to workshopsites.com. Self-contained; no deps. */
(function () {
  if (window.__wsBadgeLoaded) return;
  window.__wsBadgeLoaded = true;

  var SLUG = 'hvac'; // utm_source for lead attribution
  var BASE = 'https://workshopsites.com/';
  var Q = '?utm_source=' + SLUG + '-demo&utm_medium=referral&utm_campaign=demo_badge';
  var HOME = BASE + Q;
  var BOOK = BASE + 'appointment.html' + Q;

  function init() {
    try { if (sessionStorage.getItem('wsBadgeDismissed') === '1') return; } catch (e) {}
    if (document.getElementById('ws-badge')) return;

    var style = document.createElement('style');
    style.textContent = [
      '#ws-badge{position:fixed;left:16px;bottom:16px;z-index:2147483000;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}',
      '#ws-badge *{box-sizing:border-box}',
      '#ws-badge .ws-pill{display:inline-flex;align-items:center;gap:8px;background:#0B1F33;color:#fff;border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:9px 14px;font-size:13px;font-weight:600;line-height:1;cursor:pointer;box-shadow:0 6px 22px rgba(0,0,0,.28);transition:transform .15s ease,background .2s ease}',
      '#ws-badge .ws-pill:hover{background:#11293f;transform:translateY(-1px)}',
      '#ws-badge .ws-pill .ws-bolt{color:#F48C06;font-size:14px;line-height:1}',
      '#ws-badge .ws-pop{position:absolute;left:0;bottom:calc(100% + 10px);width:266px;background:#0B1F33;color:#fff;border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:16px 16px 15px;box-shadow:0 16px 40px rgba(0,0,0,.42);opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .18s ease,transform .18s ease,visibility .18s ease}',
      '#ws-badge.ws-open .ws-pop{opacity:1;visibility:visible;transform:translateY(0)}',
      '#ws-badge .ws-pop h4{margin:0 0 6px;font-size:14px;font-weight:700;color:#fff}',
      '#ws-badge .ws-pop p{margin:0 0 13px;font-size:12.5px;line-height:1.55;color:rgba(255,255,255,.72)}',
      '#ws-badge .ws-cta{display:block;text-align:center;text-decoration:none;border-radius:9px;padding:10px 12px;font-size:13px;font-weight:700;letter-spacing:.2px}',
      '#ws-badge .ws-cta--book{background:#E85D04;color:#fff;margin-bottom:8px}',
      '#ws-badge .ws-cta--book:hover{background:#F48C06}',
      '#ws-badge .ws-cta--home{background:transparent;color:#cfe0f2;border:1px solid rgba(255,255,255,.18)}',
      '#ws-badge .ws-cta--home:hover{border-color:rgba(255,255,255,.4);color:#fff}',
      '#ws-badge .ws-x{position:absolute;top:7px;right:9px;background:none;border:none;color:rgba(255,255,255,.5);font-size:17px;line-height:1;cursor:pointer;padding:3px}',
      '#ws-badge .ws-x:hover{color:#fff}',
      '@media(max-width:520px){#ws-badge .ws-txt{display:none}#ws-badge .ws-pop{width:244px}}',
      '@media(prefers-reduced-motion:reduce){#ws-badge .ws-pill,#ws-badge .ws-pop{transition:none}}'
    ].join('');
    document.head.appendChild(style);

    var wrap = document.createElement('div');
    wrap.id = 'ws-badge';
    wrap.innerHTML =
      '<div class="ws-pop" role="dialog" aria-label="Built by Workshop Sites">' +
        '<button class="ws-x" type="button" aria-label="Dismiss">×</button>' +
        '<h4>Like this demo?</h4>' +
        '<p>This is a live demo by Workshop Sites &mdash; we build lead-generating websites for contractors &amp; local businesses.</p>' +
        '<a class="ws-cta ws-cta--book" href="' + BOOK + '" target="_blank" rel="noopener">Book a free consult &rarr;</a>' +
        '<a class="ws-cta ws-cta--home" href="' + HOME + '" target="_blank" rel="noopener">Visit WorkshopSites.com</a>' +
      '</div>' +
      '<button class="ws-pill" type="button" aria-haspopup="dialog" aria-expanded="false">' +
        '<span class="ws-bolt">⚡</span><span class="ws-txt">Built by Workshop Sites</span>' +
      '</button>';
    document.body.appendChild(wrap);

    var pill = wrap.querySelector('.ws-pill');
    var closeX = wrap.querySelector('.ws-x');
    function open() { wrap.classList.add('ws-open'); pill.setAttribute('aria-expanded', 'true'); }
    function close() { wrap.classList.remove('ws-open'); pill.setAttribute('aria-expanded', 'false'); }
    pill.addEventListener('click', function (e) {
      e.stopPropagation();
      wrap.classList.contains('ws-open') ? close() : open();
    });
    wrap.addEventListener('mouseenter', open);
    wrap.addEventListener('mouseleave', close);
    closeX.addEventListener('click', function (e) {
      e.stopPropagation();
      wrap.style.display = 'none';
      try { sessionStorage.setItem('wsBadgeDismissed', '1'); } catch (err) {}
    });
    document.addEventListener('click', close);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
