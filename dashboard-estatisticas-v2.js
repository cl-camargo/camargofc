/* Camargo FC — rankings derivados exclusivamente do arquivo estatisticas-data.js. */
(function () {
  "use strict";
  function init() {
    var root = document.getElementById("stats-dashboard-v2");
    var data = window.CAMARGO_STATS;
    if (!root || !data || !Array.isArray(data.totais)) return;
    var players = data.totais.filter(function (p) { return p && p.total && typeof p.total.jogos === "number" && typeof p.total.gols === "number"; });
    var mostGames = players.slice().sort(function (a,b) { return b.total.jogos - a.total.jogos || a.jogador.localeCompare(b.jogador, "pt-BR"); }).slice(0,5);
    var mostGoals = players.slice().sort(function (a,b) { return b.total.gols - a.total.gols || a.jogador.localeCompare(b.jogador, "pt-BR"); }).slice(0,5);
    var title = document.createElement("div"); title.className = "v2-dashboard-heading";
    title.innerHTML = '<p class="section-eyebrow">Destaques do histórico geral</p><h2>Ranking de atletas</h2><p>Dados oficiais registrados até <strong></strong>. Para filtrar por ano ou modalidade, utilize as tabelas abaixo.</p>';
    title.querySelector("strong").textContent = data.atualizadoAte || "a última atualização";
    root.appendChild(title);
    [["Mais jogos", mostGames, "jogos"], ["Mais gols", mostGoals, "gols"]].forEach(function (group) {
      var card = document.createElement("section"); card.className = "v2-ranking-card";
      var h = document.createElement("h3"); h.textContent = group[0]; card.appendChild(h);
      var ol = document.createElement("ol");
      group[1].forEach(function (player) {
        var li = document.createElement("li");
        var name = document.createElement("span"); name.textContent = player.jogador;
        var value = document.createElement("strong"); value.textContent = player.total[group[2]] + " " + group[2];
        li.appendChild(name); li.appendChild(value); ol.appendChild(li);
      });
      card.appendChild(ol); root.appendChild(card);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
