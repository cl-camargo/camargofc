/* Fichas dos atletas: números sempre lidos da base oficial. */
(function(){
"use strict";
function norm(s){return (s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9 ]/g," ").replace(/\s+/g," ").trim().toUpperCase();}
function init(){
var cards=[...document.querySelectorAll("#elencoGrid .jogador-card, #elenco .jogador-card-futsal")];
if(!cards.length)return;
var stats=window.CAMARGO_STATS||{},totals=stats.totais||[],records=stats.registros||[];
var dialog=document.createElement("dialog");dialog.className="cfc-player-dialog";dialog.setAttribute("aria-label","Ficha individual do atleta");
dialog.innerHTML='<button type="button" class="cfc-dialog-close" aria-label="Fechar ficha">×</button><div class="cfc-player-detail"></div>';
document.body.appendChild(dialog);
dialog.querySelector("button").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
function cell(label,value){var x=document.createElement("div");x.className="cfc-player-stat";var v=document.createElement("strong");v.textContent=value;var t=document.createElement("span");t.textContent=label;x.append(v,t);return x;}
cards.forEach(card=>{
var name=card.querySelector(".jogador-nome")?.textContent?.trim();if(!name)return;
var aliases={"ANDRE":"ANDRE NUNES PUGMIL","ANDRE NUNES":"ANDRE NUNES PUGMIL","CARLOS HENRIQUE":"CARLOS HENRIQUE ROCHA"};
var canonical=norm(name)==="CARLOS HENRIQUE"&&card.classList.contains("jogador-card-futsal")?"CARLOS HENRIQUE":(aliases[norm(name)]||norm(name));
var matches=totals.filter(x=>norm(x.jogador)===canonical);
card.setAttribute("tabindex","0");card.setAttribute("role","button");card.setAttribute("aria-label","Abrir ficha de "+name);
function open(){
var body=dialog.querySelector(".cfc-player-detail");body.replaceChildren();
var img=card.querySelector(".jogador-avatar img, img");
if(img){var photo=img.cloneNode(false);photo.className="cfc-player-photo";photo.removeAttribute("loading");body.appendChild(photo);}
var info=document.createElement("div");info.className="cfc-player-info";
var h=document.createElement("h2");h.textContent=name;info.appendChild(h);
var pos=document.createElement("p");pos.textContent=card.querySelector(".jogador-posicao")?.textContent?.trim()||"Atleta do Camargo FC";info.appendChild(pos);
var row=document.createElement("div");row.className="cfc-player-stats";
if(matches.length===1){
var player=matches[0];row.append(cell("Jogos oficiais — histórico",player.total.jogos),cell("Gols oficiais — histórico",player.total.gols));
var heading=document.createElement("h3");heading.textContent="Histórico por modalidade";info.append(row,heading);
var table=document.createElement("table");table.className="cfc-player-table";
table.innerHTML="<thead><tr><th>Modalidade</th><th>Jogos</th><th>Gols</th></tr></thead>";
var tbody=document.createElement("tbody");
(stats.modalidades||[]).filter(m=>m.id!=="todas").forEach(m=>{var s=player[m.id];if(!s||(!s.jogos&&!s.gols))return;var tr=document.createElement("tr");[m.nome,s.jogos,s.gols].forEach(v=>{var td=document.createElement("td");td.textContent=v;tr.appendChild(td);});tbody.appendChild(tr);});
table.appendChild(tbody);info.appendChild(table);
var years=records.filter(r=>norm(r.jogador)===norm(player.jogador)&&r.total?.jogos>0).sort((a,b)=>b.ano-a.ano);
if(years.length){var y=document.createElement("h3");y.textContent="Temporadas registradas";info.appendChild(y);var ul=document.createElement("ul");years.forEach(r=>{var li=document.createElement("li");li.textContent=r.ano+" — "+r.total.jogos+" jogos · "+r.total.gols+" gols";ul.appendChild(li);});info.appendChild(ul);}
}else{var note=document.createElement("p");note.className="cfc-player-note";note.textContent=matches.length>1?"Nome com mais de um registro oficial. Consulte a tabela para identificar o atleta.":"Não há correspondência exata com a base histórica; os números não foram atribuídos automaticamente.";info.appendChild(note);}
var foot=document.createElement("p");foot.className="cfc-player-source";foot.textContent="Atualizado até "+(stats.atualizadoAte||"data não informada")+".";info.appendChild(foot);
body.appendChild(info);dialog.showModal();
}
// A foto também possuía um listener do lightbox antigo em main.js.
 // Captura o clique antes dele: uma única ficha, um único botão de fechar.
 card.addEventListener("click",function(e){
   if(e.target.closest(".jogador-avatar img")){
     e.stopPropagation();
     open();
   }
 },true);
 card.addEventListener("click",function(e){
   if(e.target.closest(".jogador-avatar img"))return;
   open();
 });
 card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});
});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();