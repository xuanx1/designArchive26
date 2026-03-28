(function () {
  // Inject overlay
  var overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed',
    'inset:0',
    'background:#fff',
    'z-index:99999',
    'pointer-events:none',
    'opacity:1',
    'transition:opacity 0.9s ease'
  ].join(';');
  document.documentElement.appendChild(overlay);

  // Fade in: reveal the incoming page
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.style.opacity = '0';
    });
  });

  // Fade out: cover on link click, then navigate
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      link.target === '_blank' ||
      link.target === '_top'
    ) return;
    try {
      var url = new URL(href, window.location.href);
      if (url.hostname !== window.location.hostname) return;
    } catch (err) { return; }

    e.preventDefault();
    overlay.style.opacity = '1';
    setTimeout(function () {
      window.location.href = href;
    }, 950);
  });
})();
