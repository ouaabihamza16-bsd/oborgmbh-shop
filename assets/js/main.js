/* OBOR GmbH – mobile menu and smooth in-page scrolling (no external resources) */
(function () {
  'use strict';

  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  var desktopQuery = window.matchMedia('(min-width: 768px)');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Mobile menu ---------- */
  function setMenu(open, returnFocus) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    menu.hidden = !open;
    if (!open && returnFocus) toggle.focus();
  }

  function isOpen() {
    return toggle && toggle.getAttribute('aria-expanded') === 'true';
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(!isOpen(), false);
      if (isOpen()) {
        var first = menu.querySelector('a');
        if (first) first.focus();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) setMenu(false, true);
    });

    document.addEventListener('click', function (event) {
      if (isOpen() && !menu.contains(event.target) && !toggle.contains(event.target)) {
        setMenu(false, false);
      }
    });

    var onBreakpoint = function (event) {
      if (event.matches) setMenu(false, false);
    };
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', onBreakpoint);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(onBreakpoint);
    }
  }

  /* ---------- Smooth scrolling for in-page links ---------- */
  function focusTarget(target) {
    if (!target.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) {
      target.setAttribute('tabindex', '-1');
    }
    try {
      target.focus({ preventScroll: true });
    } catch (e) {
      target.focus();
    }
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
    if (!link) return;

    var hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    var target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;

    event.preventDefault();
    var behavior = reduceMotion.matches ? 'auto' : 'smooth';

    if (isOpen()) setMenu(false, false);

    if (hash === '#top') {
      window.scrollTo({ top: 0, behavior: behavior });
      var brand = document.querySelector('.site-header .brand');
      if (brand) focusTarget(brand);
    } else {
      target.scrollIntoView({ behavior: behavior, block: 'start' });
      focusTarget(target);
    }

    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', hash);
    }
  });
})();
