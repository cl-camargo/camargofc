/* Memorial: índice baseado nos títulos e fotografias já catalogados na Galeria. */
(function(){
"use strict";
function init(){
var root=document.getElementById("cfc-memorial-v3");if(!root)return;
var gallery=document.querySelector("#gal-titulos");if(!gallery)return;
var entries=[...gallery.querySelectorAll(".titulos-grid .titulo-card")];
if(!entries.length)return;
var h=document.createElement("h2");h.textContent="Memorial de conquistas";root.appendChild(h);
var p=document.createElement("p");p.textContent="Campanhas registradas no acervo do clube. Cada conquista mantém seu nome, ano e vínculo original com a Galeria.";root.appendChild(p);
var grid=document.createElement("div");grid.className="cfc-memorial-grid";
entries.forEach(entry=>{
var card=document.createElement("article");card.className="cfc-memorial-card";
var name=document.createElement("h3");name.textContent=entry.querySelector(".titulo-nome")?.textContent?.trim()||"Conquista registrada";card.appendChild(name);
var year=entry.querySelector(".titulo-anos")?.textContent?.trim();if(year){var y=document.createElement("p");y.textContent=year;card.appendChild(y);}
var quantity=entry.querySelector(".titulo-qtd")?.textContent?.trim();if(quantity){var q=document.createElement("span");q.textContent="Conquistas registradas: "+quantity;card.appendChild(q);}
var a=document.createElement("a");a.href=entry.matches("a[href]")?entry.getAttribute("href"):"#gal-titulos";a.textContent=entry.matches("a[href]")?"Ver reportagem da conquista":"Ver acervo da Galeria";card.appendChild(a);
grid.appendChild(card);
});
root.appendChild(grid);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();