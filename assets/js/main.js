// Theme toggle (persisted), mobile nav, and "show more" lists.
(function () {
  var root = document.documentElement;

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    var icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = t === 'dark' ? '☀' : '☾';
  }

  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  applyTheme(saved || (window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem('theme', next); } catch (e) {}
      });
    }

    var navBtn = document.getElementById('nav-toggle');
    var navLinks = document.getElementById('nav-links');
    if (navBtn && navLinks) {
      navBtn.addEventListener('click', function () {
        navLinks.classList.toggle('is-open');
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-expands]'), function (btn) {
      var target = document.getElementById(btn.getAttribute('data-expands'));
      if (!target) return;
      btn.addEventListener('click', function () {
        var open = target.classList.toggle('is-open');
        btn.textContent = open ? btn.getAttribute('data-less') : btn.getAttribute('data-more');
      });
    });
  });
})();

// Language switch (English / 中文).
// A page opts in by putting data-bilingual on <html>; blocks are marked with
// lang="en" / lang="zh" and hidden by CSS, so it works before/without JS too.
(function () {
  var root = document.documentElement;
  var LANGS = ['en', 'zh'];

  function fromHash() {
    var h = (location.hash || '').replace('#', '').toLowerCase();
    return LANGS.indexOf(h) >= 0 ? h : null;
  }

  function preferred() {
    var saved = null;
    try { saved = localStorage.getItem('lang'); } catch (e) {}
    if (LANGS.indexOf(saved) >= 0) return saved;
    var nav = (navigator.language || 'en').toLowerCase();
    return nav.indexOf('zh') === 0 ? 'zh' : 'en';
  }

  // Swap texts of elements carrying a data-t-zh translation (e.g. <title>).
  function swapTexts(lang) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-t-zh]'), function (el) {
      if (!el.hasAttribute('data-t-en')) el.setAttribute('data-t-en', el.textContent);
      el.textContent = el.getAttribute(lang === 'zh' ? 'data-t-zh' : 'data-t-en');
    });
  }

  function applyLang(lang, withDom) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang === 'zh' ? 'zh-Hans' : 'en');
    if (withDom) {
      swapTexts(lang);
      Array.prototype.forEach.call(document.querySelectorAll('[data-set-lang]'), function (btn) {
        btn.setAttribute('aria-pressed', btn.getAttribute('data-set-lang') === lang);
      });
    }
  }

  function choose(lang) {
    applyLang(lang, true);
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  applyLang(fromHash() || preferred(), false);

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(root.getAttribute('data-lang'), true);
    Array.prototype.forEach.call(document.querySelectorAll('[data-set-lang]'), function (btn) {
      btn.addEventListener('click', function () { choose(btn.getAttribute('data-set-lang')); });
    });
  });

  window.addEventListener('hashchange', function () {
    var h = fromHash();
    if (h) choose(h);
  });
})();
