(function () {
  // Smooth scroll for back-to-top links
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#top"]');
    if (!a) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

(function () {
  // Auto-update copyright year
  var y = new Date().getFullYear();
  document.querySelectorAll('.copyright-year').forEach(function(el) { el.textContent = y; });
})();

(function () {
  // Auto-sync thumbnail tags from project spec pages
  var links = document.querySelectorAll('.projects__link[href]');
  if (!links.length) return;
  links.forEach(function (link) {
    var tagEl = link.querySelector('.tag .text-small');
    if (!tagEl) return;
    var href = link.getAttribute('href');
    fetch(href)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        var addr = tmp.querySelector('.project__address .text-large');
        if (addr && addr.textContent.trim()) {
          tagEl.textContent = addr.textContent.trim();
        }
      })
      .catch(function () {});
  });
})();

(function () {
  // Custom cursor — skip if already present (index.html has its own)
  if (document.querySelector('.cursor-wrapper')) return;

  var style = document.createElement('style');
  style.textContent = [
    'body,*{cursor:none!important}',
    '.cursor,.cursor-follower{position:fixed;border-radius:100%;pointer-events:none;opacity:0;transition:opacity .3s;}',
    '.cursor{width:2em;height:2em;background:#00000033;transform:translate(-50%,-50%);transition:opacity .3s,transform .15s;}',
    '.cursor-follower{width:.4em;height:.4em;background:#333333;transform:translate(-50%,-50%);transition:opacity .3s,left .1s ease-out,top .1s ease-out;}',
    'body:hover .cursor,body:hover .cursor-follower{opacity:1;}',
    '.cursor.active{transform:translate(-50%,-50%) scale(1.6);}',
    '@media(max-width:768px){.cursor,.cursor-follower{display:none;}body,*{cursor:auto!important}}'
  ].join('');
  document.head.appendChild(style);

  var cursor = document.createElement('div');
  cursor.className = 'cursor';
  var follower = document.createElement('div');
  follower.className = 'cursor-follower';
  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  document.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
  });

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest('a, button')) cursor.classList.add('active');
  });
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget || !e.relatedTarget.closest('a, button')) {
      cursor.classList.remove('active');
    }
  });
})();

(function () {
  // Mark active footer category button
  var currentDir = window.location.pathname.split('/').slice(0, -1).join('/');
  document.querySelectorAll('.footer__nav-link[data-hover-img]').forEach(function (link) {
    try {
      var linkDir = new URL(link.getAttribute('href'), window.location.href).pathname.split('/').slice(0, -1).join('/');
      if (currentDir && currentDir === linkDir) {
        link.classList.add('is-active');
      }
    } catch (e) {}
  });
})();

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

  // Fade in: reveal the incoming page (double rAF for paint timing)
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.style.opacity = '0';
    });
  });

  // bfcache restore (browser back/forward) — overlay stuck at opacity:1, force fade out
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      overlay.style.transition = 'none';
      overlay.style.opacity = '1';
      requestAnimationFrame(function () {
        overlay.style.transition = 'opacity 0.9s ease';
        requestAnimationFrame(function () {
          overlay.style.opacity = '0';
        });
      });
    }
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
