/* Fichas de partidas: apresenta somente informações existentes na Agenda. */
(function(){
"use strict";
function init(){
var games=[...document.querySelectorAll("#agenda .agenda-jogo")];if(!games.length)return;
var dialog=document.createElement("dialog");dialog.className="cfc-match-dialog";dialog.setAttribute("aria-label","Detalhes da partida");
dialog.innerHTML='<button type="button" class="cfc-dialog-close" aria-label="Fechar detalhes">×</button><div class="cfc-match-detail"></div>';
document.body.appendChild(dialog);dialog.querySelector("button").addEventListener("click",()=>dialog.close());dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
games.forEach((game,i)=>{
var button=document.createElement("button");button.type="button";button.className="cfc-match-open";button.textContent="Ficha da partida";button.setAttribute("aria-label","Ver detalhes da partida "+(i+1));
game.appendChild(button);
button.addEventListener("click",()=>{
var target=dialog.querySelector(".cfc-match-detail");target.replaceChildren();
var heading=document.createElement("h2");heading.textContent="Ficha da partida";target.appendChild(heading);
var badge=game.querySelector(".agenda-badge-proximo, .agenda-badge-encerrado");if(badge){var p=document.createElement("p");p.textContent=badge.textContent.trim();target.appendChild(p);}
var teams=game.querySelector(".agenda-jogo-times");if(teams){var clone=teams.cloneNode(true);target.appendChild(clone);}
var meta=game.querySelector(".agenda-jogo-meta");if(meta){var list=document.createElement("ul");[...meta.querySelectorAll("span")].forEach(item=>{var li=document.createElement("li");li.textContent=item.textContent.trim();list.appendChild(li);});target.appendChild(list);}
var details=game.querySelectorAll("a[href]");if(details.length){var links=document.createElement("div");links.className="cfc-match-links";details.forEach(a=>{var link=a.cloneNode(true);links.appendChild(link);});target.appendChild(links);}
var note=document.createElement("p");note.className="cfc-player-source";note.textContent="Dados extraídos do registro da Agenda. Escalações, gols e assistências só aparecem quando registrados e vinculados à partida.";target.appendChild(note);
dialog.showModal();
});
});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();