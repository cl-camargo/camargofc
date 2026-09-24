
  function abrirGaleria(btn, tabId) {
    document.querySelectorAll('.galeria-tab').forEach(t => t.classList.remove('ativo'));
    document.querySelectorAll('.galeria-tab-content').forEach(c => c.classList.remove('ativo'));
    btn.classList.add('ativo');
    document.getElementById(tabId).classList.add('ativo');
  }

  function filtrar(btn, pos) {
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    document.querySelectorAll('.jogador-card').forEach(card => {
      if (pos === 'todos' || card.dataset.pos === pos) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function abrirTab(btn, tabId) {
    // kept for backward compat if any remnant exists
  }

  let resultadoFiltro = 'todos';

  function filtrarResultado(btn, res) {
    document.querySelectorAll('.res-btn').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    resultadoFiltro = res;
    filtrarJogos();
  }

  function filtrarJogos() {
    const busca = document.getElementById('jogosSearch') ? document.getElementById('jogosSearch').value.toLowerCase().trim() : '';
    const tabAtiva = document.querySelector('.jogos-tab-content.ativo');
    if (!tabAtiva) return;
    tabAtiva.querySelectorAll('tbody tr').forEach(tr => {
      const searchData = tr.dataset.search || '';
      const res = tr.dataset.res || '';
      const matchBusca = !busca || searchData.includes(busca);
      const matchRes = resultadoFiltro === 'todos' || res === resultadoFiltro;
      tr.style.display = (matchBusca && matchRes) ? '' : 'none';
    });
  }

  /* ===== ACCORDION JOGOS ===== */
  var accResFiltros = {};

  function toggleAcc(btn, accId) {
    var body = document.getElementById(accId);
    var isAberto = body.classList.contains('aberto');

    // Fecha todos
    document.querySelectorAll('.jogos-acc-header').forEach(function(h) { h.classList.remove('aberto'); h.setAttribute('aria-expanded', 'false'); });
    document.querySelectorAll('.jogos-acc-body').forEach(function(b) { b.classList.remove('aberto'); });

    if (!isAberto) {
      btn.classList.add('aberto');
      btn.setAttribute('aria-expanded', 'true');
      body.classList.add('aberto');
    }
  }

  function filtrarJogosAcc(input) {
    var accId = input.dataset.acc;
    var body = document.getElementById(accId);
    var busca = input.value.toLowerCase().trim();
    var resFiltro = accResFiltros[accId] || 'todos';
    body.querySelectorAll('tbody tr').forEach(function(tr) {
      var searchData = tr.dataset.search || '';
      var res = tr.dataset.res || '';
      var matchBusca = !busca || searchData.includes(busca);
      var matchRes = resFiltro === 'todos' || res === resFiltro;
      tr.style.display = (matchBusca && matchRes) ? '' : 'none';
    });
  }

  function filtrarResAcc(btn, res, accId) {
    var body = document.getElementById(accId);
    body.querySelectorAll('.res-btn').forEach(function(b) { b.classList.remove('ativo'); });
    btn.classList.add('ativo');
    accResFiltros[accId] = res;
    var searchInput = body.querySelector('.acc-search');
    var busca = searchInput ? searchInput.value.toLowerCase().trim() : '';
    body.querySelectorAll('tbody tr').forEach(function(tr) {
      var searchData = tr.dataset.search || '';
      var resVal = tr.dataset.res || '';
      var matchBusca = !busca || searchData.includes(busca);
      var matchRes = res === 'todos' || resVal === res;
      tr.style.display = (matchBusca && matchRes) ? '' : 'none';
    });
  }

  /* ===== CARROSSEL HERO ===== */
  (function() {
    var slides = [
      { legenda: 'Time Campeão de 2022', sub: 'Liga Paraíso de Futebol · 2ª Divisão' },
      { legenda: 'Campeão Liga Paraíso 2022', sub: 'Título histórico do Camargo FC' },
      { legenda: 'Campeão Torneio Nova Geração 2023', sub: 'Mais um título para a galeria' },
      { legenda: 'Kiley – Ídolo do Camargo FC', sub: 'Meia / Lateral · Campo: 19 jogos · 4 gols · 3 ass.' },
      { legenda: 'Chico – Capitão 2026', sub: 'Volante/Meia · 30 jogos · 1 gol · 2 ass.' },
      { legenda: 'Classificados para a semifinal', sub: 'Camargo FC 6 × 2 Nova Geração · Leia a notícia completa' }
    ];

    var carouselEl = document.getElementById('heroCarousel');
    var track = document.getElementById('carouselTrack');
    var legenda = document.getElementById('carouselLegenda');
    var sublinha = document.getElementById('carouselSublinha');
    var contador = document.getElementById('carouselContador');
    var dotsWrap = document.getElementById('carouselDots');
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');

    if (!track || !carouselEl) return;

    var atual = 0;
    var total = slides.length;
    var autoTimer;

    // Criar dots
    slides.forEach(function(_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' ativo' : '');
      dot.addEventListener('click', function() { irPara(i); });
      dotsWrap.appendChild(dot);
    });

    function atualizar() {
      var largura = carouselEl.offsetWidth;
      track.style.transform = 'translateX(-' + (atual * largura) + 'px)';
      legenda.textContent = slides[atual].legenda;
      sublinha.textContent = slides[atual].sub;
      contador.textContent = (atual + 1) + ' / ' + total;
      dotsWrap.querySelectorAll('.carousel-dot').forEach(function(d, i) {
        d.classList.toggle('ativo', i === atual);
      });
    }

    function irPara(idx) {
      atual = (idx + total) % total;
      atualizar();
      reiniciarAuto();
    }

    function reiniciarAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function() { irPara(atual + 1); }, 5000);
    }

    prevBtn.addEventListener('click', function() { irPara(atual - 1); });
    nextBtn.addEventListener('click', function() { irPara(atual + 1); });

    // Swipe touch
    var touchStartX = 0;
    track.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) irPara(atual + (dx < 0 ? 1 : -1));
    }, { passive: true });

    // Reajustar ao redimensionar
    window.addEventListener('resize', function() { atualizar(); });

    atualizar();
    reiniciarAuto();
  })();

  /* ===== LIGHTBOX ===== */
  (function () {
    const imagens = [];
    let indice = 0;

    const lb      = document.getElementById('lightbox');
    const lbImg   = document.getElementById('lb-img');
    const lbLeg   = document.getElementById('lb-legenda');
    const lbSub   = document.getElementById('lb-sub');
    const lbCont  = document.getElementById('lb-contador');

    // Algumas páginas não usam galeria. Nelas, encerra somente este módulo
    // para que os demais recursos (como compartilhamento) continuem ativos.
    if (!lb || !lbImg || !lbLeg || !lbSub || !lbCont) return;

    function abrir(idx) {
      indice = idx;
      renderizar();
      lb.classList.add('aberto');
      document.body.style.overflow = 'hidden';
    }

    function fechar() {
      lb.classList.remove('aberto');
      document.body.style.overflow = '';
    }

    function navegar(dir) {
      indice = (indice + dir + imagens.length) % imagens.length;
      renderizar();
    }

    function renderizar() {
      const item = imagens[indice];
      lbImg.src = item.src;
      lbImg.alt = item.titulo;
      // título: nó de texto antes do <span>
      lbLeg.firstChild.textContent = item.titulo;
      lbSub.textContent = item.sub || '';
      lbCont.textContent = (indice + 1) + ' / ' + imagens.length;
    }

    function registrar(img, titulo, sub) {
      // Captura o índice AGORA, antes do push, para que o closure use o valor correto
      const idx = imagens.length;
      imagens.push({ src: img.src, alt: img.alt, titulo: titulo, sub: sub });
      img.addEventListener('click', function () { abrir(idx); });
    }

    document.getElementById('lb-fechar').addEventListener('click', fechar);
    document.getElementById('lb-prev').addEventListener('click', function () { navegar(-1); });
    document.getElementById('lb-next').addEventListener('click', function () { navegar(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) fechar(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('aberto')) return;
      if (e.key === 'Escape')     fechar();
      if (e.key === 'ArrowLeft')  navegar(-1);
      if (e.key === 'ArrowRight') navegar(1);
    });

    // Swipe touch para mobile
    var touchStartX = 0;
    lb.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) navegar(dx < 0 ? 1 : -1);
    }, { passive: true });

    // Nó de texto para o título (antes do <span id="lb-sub">)
    lbLeg.insertBefore(document.createTextNode(''), lbSub);

    window.addEventListener('DOMContentLoaded', function () {
      // Galeria
      document.querySelectorAll('.galeria-card').forEach(function (card) {
        const img = card.querySelector('.galeria-card-img img');
        if (!img) return;
        const titulo = card.querySelector('.galeria-card-titulo') ? card.querySelector('.galeria-card-titulo').textContent.trim() : '';
        const desc   = card.querySelector('.galeria-card-desc')   ? card.querySelector('.galeria-card-desc').textContent.trim()   : '';
        registrar(img, titulo, desc);
      });

      // Fotos das notícias em destaque
      document.querySelectorAll('.noticia-galeria figure').forEach(function (figure) {
        const img = figure.querySelector('img');
        if (!img) return;
        const legenda = figure.querySelector('figcaption') ? figure.querySelector('figcaption').textContent.trim() : '';
        registrar(img, img.alt || 'Camargo FC', legenda);
      });

      // Elenco
      document.querySelectorAll('.jogador-card').forEach(function (card) {
        const img = card.querySelector('.jogador-avatar img');
        if (!img) return;
        const nome    = card.querySelector('.jogador-nome')     ? card.querySelector('.jogador-nome').textContent.trim()     : '';
        const posicao = card.querySelector('.jogador-posicao')  ? card.querySelector('.jogador-posicao').textContent.trim()  : '';
        const idade   = card.querySelector('.jogador-numero')   ? card.querySelector('.jogador-numero').textContent.trim()   : '';
        registrar(img, nome, [posicao, idade].filter(Boolean).join(' · '));
      });

      // Comissão Técnica
      document.querySelectorAll('.comissao-card').forEach(function (card) {
        const img = card.querySelector('.comissao-avatar img');
        if (!img) return;
        const nome  = card.querySelector('.comissao-nome')  ? card.querySelector('.comissao-nome').textContent.trim()  : '';
        const cargo = card.querySelector('.comissao-cargo') ? card.querySelector('.comissao-cargo').textContent.trim() : '';
        const idade = card.querySelector('.comissao-idade') ? card.querySelector('.comissao-idade').textContent.trim() : '';
        img.style.cursor = 'zoom-in';
        card.querySelector('.comissao-avatar').style.cursor = 'zoom-in';
        registrar(img, nome, [cargo, idade].filter(Boolean).join(' · '));
      });

      // Patrocinadores
      document.querySelectorAll('.patro-card').forEach(function (card) {
        const img = card.querySelector('img');
        if (!img) return;
        const nome = img.alt || 'Patrocinador';
        img.style.cursor = 'zoom-in';
        registrar(img, nome, 'Patrocinador & Apoio — Camargo FC');
      });
    });
  })();


  /* ===== COMPARTILHAMENTO UNIVERSAL ===== */
  (function () {
    var ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    function feedback(btn, mensagem) {
      if (!btn) return;
      var original = btn.getAttribute('data-share-original') || btn.innerHTML;
      btn.setAttribute('data-share-original', original);
      btn.classList.add('copiado');
      btn.innerHTML = ICON_CHECK + ' ' + mensagem;
      window.setTimeout(function () {
        btn.classList.remove('copiado');
        btn.innerHTML = original;
      }, 2000);
    }

    function abrirWhatsApp(btn, texto, url) {
      var mensagem = [texto, url].filter(Boolean).join('\n');
      var janela = window.open('https://wa.me/?text=' + encodeURIComponent(mensagem), '_blank', 'noopener,noreferrer');
      if (janela) {
        feedback(btn, 'Abrindo...');
      } else {
        window.prompt('Copie o link abaixo:', url);
      }
    }

    function copiarLink(btn, url, texto) {
      function copiarModoCompativel() {
        var campo = document.createElement('textarea');
        campo.value = url;
        campo.setAttribute('readonly', '');
        campo.style.position = 'fixed';
        campo.style.opacity = '0';
        document.body.appendChild(campo);
        campo.select();
        campo.setSelectionRange(0, campo.value.length);
        var copiou = false;
        try { copiou = document.execCommand('copy'); } catch (erro) {}
        document.body.removeChild(campo);
        if (copiou) {
          feedback(btn, 'Link copiado!');
        } else {
          abrirWhatsApp(btn, texto, url);
        }
      }

      if (window.isSecureContext && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          feedback(btn, 'Link copiado!');
        }).catch(copiarModoCompativel);
      } else {
        copiarModoCompativel();
      }
    }

    window.compartilharConteudo = function (btn, opcoes) {
      opcoes = opcoes || {};
      var titulo = opcoes.titulo || document.title;
      var texto = opcoes.texto || titulo;
      var url = opcoes.url || window.location.href;

      try {
        url = new URL(url, window.location.href).href;
      } catch (erro) {
        url = window.location.href;
      }

      var dados = { title: titulo, text: texto, url: url };
      if (typeof navigator.share === 'function') {
        if (typeof navigator.canShare === 'function' && !navigator.canShare(dados)) {
          copiarLink(btn, url, texto);
          return;
        }
        navigator.share(dados).catch(function (erro) {
          if (!erro || erro.name !== 'AbortError') {
            copiarLink(btn, url, texto);
          }
        });
        return;
      }

      copiarLink(btn, url, texto);
    };
  })();

  /* ===== COMPARTILHAR LINK (AGENDA E ELENCO) ===== */
  (function () {
    var ICON_SHARE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>';
    var ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    function feedbackOk(el, htmlOriginal, classeExtra) {
      el.classList.add('copiado');
      var conteudoAntigo = el.innerHTML;
      el.innerHTML = ICON_CHECK + (classeExtra ? ' Copiado!' : '');
      setTimeout(function () {
        el.classList.remove('copiado');
        el.innerHTML = conteudoAntigo;
      }, 1800);
    }

    function compartilhar(el, titulo, texto, url) {
      window.compartilharConteudo(el, {
        titulo: titulo,
        texto: texto,
        url: url
      });
    }

    function montarUrlComAncora(id) {
      return window.location.origin + window.location.pathname + '#' + id;
    }

    window.addEventListener('DOMContentLoaded', function () {
      // ---- AGENDA: botão de compartilhar em cada jogo ----
      document.querySelectorAll('#agenda .agenda-jogo').forEach(function (jogo, idx) {
        var nomes = jogo.querySelectorAll('.agenda-time-nome');
        var time1 = nomes[0] ? nomes[0].textContent.trim() : '';
        var time2 = nomes[1] ? nomes[1].textContent.trim() : '';
        var dataSpan = jogo.querySelector('.agenda-jogo-meta span:nth-child(2)');
        var dataTexto = dataSpan ? dataSpan.textContent.replace('📅', '').trim() : '';
        var localSpan = jogo.querySelector('.agenda-jogo-meta span:nth-child(1)');
        var localTexto = localSpan ? localSpan.textContent.replace('📍', '').trim() : '';

        var anchorId = 'jogo-' + idx;
        jogo.id = jogo.id || anchorId;

        var titulo = time1 && time2 ? (time1 + ' x ' + time2) : 'Camargo FC';
        var partesTexto = [titulo];
        if (dataTexto) partesTexto.push('📅 ' + dataTexto);
        if (localTexto) partesTexto.push('📍 ' + localTexto);
        var textoCompartilhar = partesTexto.join(' · ') + ' — Camargo Futebol Clube';

        var btn = document.createElement('button');
        btn.className = 'compartilhar-btn';
        btn.type = 'button';
        btn.innerHTML = ICON_SHARE + ' Compartilhar';
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          compartilhar(btn, titulo, textoCompartilhar, montarUrlComAncora(jogo.id));
        });
        jogo.appendChild(btn);
      });

    });
  })();

/* Menus retráteis de Jogos e Estatísticas — compatível com Safari/iOS */
(function () {
  document.querySelectorAll('.menu-retratil .jogos-menu-toggle').forEach(function (botao) {
    var painel = document.getElementById(botao.getAttribute('aria-controls'));
    if (!painel) return;
    botao.addEventListener('click', function () {
      var abrir = botao.getAttribute('aria-expanded') !== 'true';
      botao.setAttribute('aria-expanded', String(abrir));
      botao.closest('.menu-retratil').classList.toggle('aberto', abrir);
      painel.hidden = !abrir;
    });
  });
})();
