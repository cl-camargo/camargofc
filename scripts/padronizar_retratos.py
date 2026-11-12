#!/usr/bin/env python3
"""Padroniza retratos históricos com detecção de rosto e recorte proporcional.
Uso: python scripts/padronizar_retratos.py
Não modifica as fotografias originais.
"""
from pathlib import Path
import re
import cv2
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "galeria.html"
OUT = ROOT / "retratos-padronizados"
OUT.mkdir(exist_ok=True)
html = HTML.read_text(encoding="utf-8")
begin = html.index('id="gal-atletas"')
end = html.index('<!-- Jogos -->', begin)
section = html[begin:end]
names = sorted(set(re.findall(r'src="([^"]+\.webp)"', section)))
face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
TARGET = (600, 750)

def render(path):
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    w, h = im.size
    small = im.copy()
    small.thumbnail((1000, 1000))
    gray = cv2.cvtColor(__import__("numpy").array(small), cv2.COLOR_RGB2GRAY)
    faces = face_detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(22,22))
    if len(faces):
        # Preferir rosto maior; não aplicar zoom além da resolução disponível.
        x,y,fw,fh = max(faces, key=lambda f:f[2]*f[3])
        scale_x,scale_y = w/small.width,h/small.height
        cx=(x+fw/2)*scale_x
        top=(y-0.9*fh)*scale_y
        crop_h=max(fh*scale_y*7.5, min(h, 560))
        crop_w=crop_h*TARGET[0]/TARGET[1]
        if crop_w>w:
            crop_w=w
            crop_h=crop_w*TARGET[1]/TARGET[0]
        crop_h=min(h,crop_h)
        left=max(0,min(w-crop_w,cx-crop_w/2))
        top=max(0,min(h-crop_h,top))
        im=im.crop((int(left),int(top),int(left+crop_w),int(top+crop_h)))
    # Contain + fundo neutro garante mesmo tamanho sem deformar, mesmo sem rosto.
    im.thumbnail(TARGET, Image.Resampling.LANCZOS)
    canvas=Image.new("RGB",TARGET,(21,21,21))
    canvas.paste(im,((TARGET[0]-im.width)//2,(TARGET[1]-im.height)//2))
    return canvas

for name in names:
    source=ROOT/name
    if not source.exists():
        print("PULANDO: fonte ausente",name)
        continue
    destination=OUT/name
    render(source).save(destination,"WEBP",quality=86,method=6)
    section=section.replace('src="'+name+'"','src="retratos-padronizados/'+name+'"')
    print("GERADO:",destination)
HTML.write_text(html[:begin]+section+html[end:],encoding="utf-8")
