/* Busca local nos títulos/legendas da galeria. Nunca altera fotos ou ordem. */
(function () {
  "use strict";
  function setup() {
    ["gal-jogos", "gal-bastidores"].forEach(function (id) {
      var pane = document.getElementById(id);
      var grid = pane && pane.querySelector(".galeria-grid");
      if (!grid) return;
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".galeria-card"));
      if (!cards.length) return;
      var tools = document.createElement("div"); tools.className = "cfc-gallery-tools";
      var label = document.createElement("label"); label.htmlFor = "cfc-busca-" + id;
      label.textContent = id === "gal-jogos" ? "Pesquisar times históricos" : "Pesquisar bastidores";
      var input = document.createElement("input"); input.type = "search"; input.id = label.htmlFor;
      input.placeholder = "Busque por ano, torneio ou nome"; input.autocomplete = "off";
      var clear = document.createElement("button"); clear.type = "button"; clear.textContent = "Limpar";
      var count = document.createElement("span"); count.className = "cfc-gallery-count"; count.setAttribute("aria-live", "polite");
      var empty = document.createElement("p"); empty.className = "cfc-gallery-empty"; empty.hidden = true;
      empty.textContent = "Nenhuma fotografia encontrada. Tente outro termo.";
      tools.appendChild(label); tools.appendChild(input); tools.appendChild(clear); tools.appendChild(count);
      grid.parentNode.insertBefore(tools, grid); grid.parentNode.insertBefore(empty, grid.nextSibling);
      function normalize(s) { return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
      function filter() {
        var q = normalize(input.value.trim()); var visible = 0;
        cards.forEach(function (card) {
          var img = card.querySelector("img");
          var hay = normalize(card.textContent + " " + (img ? img.alt : ""));
          card.hidden = !!q && !hay.includes(q);
          if (!card.hidden) visible++;
        });
        count.textContent = visible + " de " + cards.length + " registros";
        empty.hidden = visible !== 0;
      }
      input.addEventListener("input", filter);
      clear.addEventListener("click", function () { input.value = ""; filter(); input.focus(); });
      filter();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup); else setup();
})();
