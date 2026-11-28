(function () {
  var placeholder = document.getElementById('site-menu');
  if (!placeholder) return;

  // Menu embutido no HTML: funciona sem fetch e permanece acessível sem JavaScript.
  if (placeholder.querySelector('nav')) {
    ativarMenu();
  } else {
    // Compatibilidade com páginas antigas ainda não atualizadas.
    fetch('menu.html?v=20261128-brand')
      .then(function (resp) { if (!resp.ok) throw new Error('HTTP ' + resp.status); return resp.text(); })
      .then(function (html) { placeholder.innerHTML = html; ativarMenu(); })
      .catch(function (err) { console.error('Não foi possível carregar menu.html:', err); });
  }

  function ativarMenu() {
    var nav = placeholder.querySelector('nav');
    var links = nav && nav.querySelector('.nav-links');
    if (links && !nav.querySelector('.nav-social')) {
      var sponsor = links.querySelector('a[data-page="patrocinadores.html"]');
      var group = document.createElement('div');
      group.className = 'nav-social';
      var svg = function(body) { return '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+body+'</svg>'; };
      var items = [
        ['Instagram','https://instagram.com/camargofc.pso','<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>'],
        ['Jogos gravados','galeria.html#gal-gravados','<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/>'],
        ['WhatsApp','https://wa.me/5563992994110','<path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.5L3 21l1.6-4.8A8.5 8.5 0 1 1 20.5 11.8Z"/><path d="M9 8c-2 1 1 6 4 7 2 1 3-1 2-2 1-1-1-2Z"/>']
      ];
      items.forEach(function(item) { var a=document.createElement('a'); a.href=item[1]; a.title=item[0]; a.setAttribute('aria-label',item[0]); if(item[1].indexOf('https:')===0){a.target='_blank';a.rel='noopener noreferrer';} a.innerHTML=svg(item[2]);group.appendChild(a); });
      if(sponsor){sponsor.title='Patrocinadores';sponsor.setAttribute('aria-label','Patrocinadores');sponsor.innerHTML=svg('<path d="m2 8 4-4 5 3 2-1 5-2 4 4-4 8-3 3-3-1-2-2-2-1-3-3zM7 10l4-3 5 5M10 16l2-2M12 18l2-2"/>');group.appendChild(sponsor);}
      nav.insertBefore(group,nav.querySelector('.nav-hamburger'));
      var drawer = placeholder.querySelector('.nav-drawer');
      if(drawer){var mobile=group.cloneNode(true);mobile.className='nav-social-mobile';drawer.appendChild(mobile);}
      var style=document.createElement('style');
      style.textContent='#site-menu > nav .nav-social{display:none}#site-menu .nav-social-mobile{display:flex;justify-content:center;gap:12px;padding:16px}#site-menu .nav-social-mobile a,#site-menu > nav .nav-social a{display:inline-flex!important;align-items:center;justify-content:center;width:36px;height:36px;padding:0!important;color:#eee!important;border:1px solid #555;border-radius:4px;flex:none}#site-menu .nav-social-mobile a:hover,#site-menu > nav .nav-social a:hover,#site-menu > nav .nav-social a.nav-ativo{color:#ff5265!important;border-color:#e52b40}@media(min-width:1101px){body #site-menu > nav{display:flex!important;justify-content:flex-start!important;gap:clamp(10px,1.5vw,28px)!important;padding-inline:clamp(12px,2vw,40px)!important}body #site-menu > nav .nav-logo{flex:0 0 auto!important;margin-right:0!important}body #site-menu > nav .nav-links{display:flex!important;flex:0 1 auto!important;justify-content:flex-start!important;gap:0!important;margin:0!important}body #site-menu > nav .nav-links a{padding-inline:clamp(7px,0.85vw,16px)!important;font-size:clamp(12px,1vw,16px)!important;white-space:nowrap}body #site-menu > nav .nav-social{display:flex!important;align-items:center;gap:8px;margin-left:auto;flex-shrink:0;border-left:1px solid #444;padding-left:12px}}';
      document.head.appendChild(style);
    }
    // Marca o link da página atual como ativo
    var pagina = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-social a[data-page], .nav-social-mobile a[data-page], .nav-links a[data-page], .nav-links a[data-pages], .nav-drawer a[data-page], .nav-drawer a[data-pages]').forEach(function (link) {
      var paginas = (link.dataset.pages || link.dataset.page || '').split(/\s+/);
      if (paginas.indexOf(pagina) !== -1 || (pagina.indexOf('noticia-') === 0 && paginas.indexOf('noticias.html') !== -1)) {
        link.classList.add('nav-ativo');
        link.setAttribute('aria-current', 'page');
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
