/* Galeria: fonte única de estatísticas, sem duplicação de números. */
(function(){
'use strict';
const data=window.CAMARGO_STATS;
const mods=[['society','Society'],['junior','Júnior'],['futsal','Futsal'],['campo','Futebol de Campo'],['areia','Futebol de Areia']];
const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;return n;};
const fmt=new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
for(const box of document.querySelectorAll('#gal-atletas .historico-dados[data-atleta]')){
 const name=box.dataset.atleta;
 const p=data?.totais?.find(x=>x.jogador===name);
 if(!p){box.textContent='Estatísticas indisponíveis no momento.';continue;}
 const g=(data.goleiros||[]).filter(x=>x.jogador===name);
 const jogosGol=g.reduce((s,x)=>s+(x.jogosNoGol||0),0), sofridos=g.reduce((s,x)=>s+(x.golsSofridos||0),0);
 const totals=el('div','historico-totais');
 const metric=(parent,value,label)=>{const m=el('div');m.append(el('strong','',value),el('span','',label));parent.append(m);};
 metric(totals,p.total.jogos,'Jogos');metric(totals,p.total.gols,'Gols marcados');
 const table=el('table','historico-modalidades'),head=el('thead'),hr=el('tr');
 ['Modalidade','Jogos','Gols'].forEach(v=>hr.append(el('th','',v)));head.append(hr);table.append(head);
 const body=el('tbody');
 for(const [key,label] of mods){const m=p[key];if(!m||(!m.jogos&&!m.gols))continue;const tr=el('tr');[label,m.jogos,m.gols].forEach(v=>tr.append(el('td','',v)));body.append(tr);}
 table.append(body);box.replaceChildren(totals,table);
 if(g.length){const gt=el('table','historico-modalidades'),gb=el('tbody');const row=(label,v)=>{const tr=el('tr');tr.append(el('td','',label),el('td','',v));gb.append(tr);};row('Jogos como goleiro',jogosGol);if(name==='GUTHIERRE (Gol)')row('Jogos como jogador de linha',p.total.jogos-jogosGol);row('Gols sofridos',sofridos);row('Média de gols sofridos',jogosGol?fmt.format(sofridos/jogosGol):'—');gt.append(gb);box.append(gt);}
}
})();
