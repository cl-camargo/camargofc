(function () {
  var placeholder = document.getElementById('site-menu');
  if (!placeholder) return;

  fetch('menu.html')
    .then(function (resp) {
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      return resp.text();
    })
    .then(function (html) {
      placeholder.innerHTML = html;
      ativarMenu();
    })
    .catch(function (err) {
      console.error('Não foi possível carregar menu.html:', err);
    });

  function ativarMenu() {
    // Marca o link da página atual como ativo
    var pagina = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a[data-page]').forEach(function (link) {
      if (link.dataset.page === pagina) {
        link.classList.add('nav-ativo');
      }
    });

    // Menu hamburguer mobile
    var btn    = document.getElementById('navHamburger');
    var drawer = document.getElementById('navDrawer');
    if (!btn || !drawer) return;

    function toggleMenu() {
      var aberto = drawer.classList.toggle('aberto');
      btn.classList.toggle('aberto', aberto);
      btn.setAttribute('aria-expanded', String(aberto));
      btn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      drawer.setAttribute('aria-hidden', String(!aberto));
      document.body.style.overflow = aberto ? 'hidden' : '';
    }

    function fecharMenu() {
      drawer.classList.remove('aberto');
      btn.classList.remove('aberto');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir menu');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', toggleMenu);

    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', fecharMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && drawer.classList.contains('aberto')) {
        fecharMenu();
        btn.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1100) fecharMenu();
    });
  }
})();
