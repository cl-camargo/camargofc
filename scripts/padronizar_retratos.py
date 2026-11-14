#!/usr/bin/env python3
"""Retratos padronizados do Camargo FC a partir de fotos-originais.
Recorte acima do quadril, rosto próximo da borda superior, sem zoom CSS.
Preserva os originais e só altera as referências após gerar todas as imagens.
"""
from pathlib import Path
import re
import cv2
import numpy as np
from PIL import Image, ImageOps, ImageEnhance

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/"fotos-originais"
DEST=ROOT/"retratos-novos"
HTML=ROOT/"galeria.html"
DEST.mkdir(exist_ok=True)
MAPPING={
 "Fabiano.jpeg":"fabiano","Chico.jpeg":"chico","Ariostocly.jpeg":"ariostocly",
 "Gabiel_Antonio.jpg":"gabriel-antonio","Kiley.jpg":"kiley","Diogo.jpeg":"diogo",
 "Daniel_Lucena.jpg":"daniel-lucena","Markinhos.jpg":"markinhos",
 "Guthierre.jpeg":"guthierre","Juninho.jpg":"juninho","Ranyel.jpeg":"ranyel",
 "Pablo_Santos.jpeg":"pablo-santos","Victor_Vasco.jpg":"victor-vasco",
 "Ilvane_Bicon.jpg":"ilvane-bicon","LucasF.jpg":"lucas-fabao",
 "Valder Jr.jpg":"valder-jr","TonyJr.jpeg":"tony-jr",
 "Paulo_Henrique.jpg":"paulo-henrique","Robinho.jpeg":"robinho",
 "Walisson.jpeg":"walisson","Carlos_Leandro.jpeg":"carlos-leandro",
 "Caio_Rodrigo.jpg":"caio-rodrigo","Huan_Gomes.jpg":"huan-gomes",
}
face=cv2.CascadeClassifier(cv2.data.haarcascades+"haarcascade_frontalface_default.xml")
if face.empty():
 raise RuntimeError("Detector facial não carregou")
for filename,slug in MAPPING.items():
 path=SOURCE/filename
 if not path.is_file(): raise FileNotFoundError(path)
 im=ImageOps.exif_transpose(Image.open(path)).convert("RGB")
 w,h=im.size
 gray=cv2.cvtColor(np.array(im),cv2.COLOR_RGB2GRAY)
 faces=face.detectMultiScale(gray,scaleFactor=1.08,minNeighbors=4,minSize=(18,18))
 if len(faces):
  x,y,fw,fh=max(faces,key=lambda v:v[2]*v[3])
  cx=x+fw/2
  crop_w=min(w,max(fw*3.5,w*.53))
  crop_h=crop_w*1.25
  if crop_h>h:
   crop_h=h;crop_w=crop_h*.8
  left=max(0,min(w-crop_w,cx-crop_w/2))
  top=max(0,min(h-crop_h,y-.10*crop_h))
 else:
  crop_w=min(w,h*.8);crop_h=crop_w*1.25
  left=(w-crop_w)/2;top=max(0,(h-crop_h)*.15)
 crop=im.crop((round(left),round(top),round(left+crop_w),round(top+crop_h)))
 crop=ImageOps.fit(crop,(600,750),Image.Resampling.LANCZOS)
 crop=ImageEnhance.Contrast(crop).enhance(1.045)
 crop=ImageEnhance.Sharpness(crop).enhance(1.12)
 crop.save(DEST/(slug+".webp"),"WEBP",quality=89,method=6)
 print("GERADO",slug,im.size,"faces",len(faces),flush=True)
html=HTML.read_text(encoding="utf-8")
start=html.index('id="gal-atletas"')
end=html.index('<!-- Jogos -->',start)
section=html[start:end]
old={
 "historico-fabiano":"fabiano","historico-chico":"chico",
 "historico-ariostocly":"ariostocly","historico-gabriel-antonio":"gabriel-antonio",
 "Kiley-jpg":"kiley","historico-diogo":"diogo",
 "historico-daniel-lucena":"daniel-lucena","historico-markinhos":"markinhos",
 "historico-guthierre":"guthierre","historico-manoel-junior":"juninho",
 "historico-ranyel":"ranyel","historico-pablo-santos":"pablo-santos",
 "historico-victor-vasco":"victor-vasco","historico-ilvane-bicon":"ilvane-bicon",
 "historico-lucas-fabao":"lucas-fabao","historico-valder-jr":"valder-jr",
 "historico-tony-jr":"tony-jr","historico-paulo-henrique":"paulo-henrique",
 "historico-robinho":"robinho","historico-walisson":"walisson",
 "historico-carlos-leandro":"carlos-leandro",
}
def rewrite(m):
 tag=m.group(0)
 src=re.search(r'src="([^"]+)"',tag)
 if not src:return tag
 basename=Path(src.group(1)).stem
 slug=old.get(basename)
 if not slug:return tag
 tag=tag.replace(src.group(0),'src="retratos-novos/'+slug+'.webp"')
 tag=re.sub(r'\sstyle="[^"]*"','',tag)
 tag=re.sub(r'\swidth="\d+"','',tag)
 tag=re.sub(r'\sheight="\d+"','',tag)
 return tag
section=re.sub(r'<img\b[^>]*>',rewrite,section)
HTML.write_text(html[:start]+section+html[end:],encoding="utf-8")
print("GALERIA ATUALIZADA",flush=True)
