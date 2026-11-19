/* Navegação acessível para as categorias da Galeria. Não modifica imagens nem legendas. */
(function () {
  "use strict";
  function init() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".galeria-tabs .galeria-tab"));
    if (!tabs.length) return;
    function sync() {
      tabs.forEach(function (tab) {
        var active = tab.classList.contains("ativo");
        tab.setAttribute("aria-selected", String(active));
        tab.setAttribute("tabindex", active ? "0" : "-1");
        var panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (panel) {
          panel.setAttribute("aria-labelledby", tab.id);
          panel.setAttribute("aria-hidden", String(!active));
        }
      });
    }
    tabs.forEach(function (tab, i) {
      tab.id = "cfc-gallery-tab-" + (i + 1);
      tab.setAttribute("role", "tab");
      tab.addEventListener("click", sync);
      tab.addEventListener("keydown", function (event) {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        var next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (i + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        tabs[next].click();
        tabs[next].focus();
      });
    });
    sync();
    window.addEventListener("hashchange", function () { requestAnimationFrame(sync); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
