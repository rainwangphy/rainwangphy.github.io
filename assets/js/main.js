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
