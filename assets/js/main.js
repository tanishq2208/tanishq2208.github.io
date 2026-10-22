/* Progressive enhancement only: the page is fully readable without this file. */
(function () {
  'use strict';

  /* Current year in the footer. */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Highlight the nav link for the section currently in view. */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.navbar__links a'));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var visible = new Set();

    var setCurrent = function () {
      var active = sections.filter(function (section) {
        return visible.has(section.id);
      })[0];
      navLinks.forEach(function (link) {
        var isCurrent = Boolean(active) && link.getAttribute('href') === '#' + active.id;
        if (isCurrent) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        });
        setCurrent();
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* Copy-link button in the footer. */
  var toast = document.querySelector('.share__toast');
  var toastTimer;

  var showToast = function (message) {
    if (!toast) return;
    toast.textContent = message;
    toast.setAttribute('data-visible', 'true');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.removeAttribute('data-visible');
    }, 2000);
  };

  document.querySelectorAll('[data-share="copy"]').forEach(function (el) {
    el.addEventListener('click', function () {
      var href = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(href).then(
          function () {
            showToast('Link copied');
          },
          function () {
            showToast('Copy failed');
          }
        );
      } else {
        showToast(href);
      }
    });
  });
})();
