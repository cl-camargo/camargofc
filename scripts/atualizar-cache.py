#!/usr/bin/env python3
"""Atualiza versões de assets locais. Use --check para verificar sem gravar."""
import hashlib
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
check = '--check' in sys.argv
changes = {}
def digest(data):
    return hashlib.sha256(data).hexdigest()[:8]
def read(p):
    return changes.get(p, p.read_bytes())
def stage(p, data):
    if data != p.read_bytes():
        changes[p] = data
menu = root / 'menu.html'
if menu.is_file():
    version = digest(menu.read_bytes())
    for p in root.glob('*.js'):
        stage(p, re.sub(rb'(menu\.html)\?v=[\w-]+', lambda m: m[1]+b'?v='+version.encode(), p.read_bytes()))
ref = re.compile(rb'((?:href|src)=")(?!https?:|//|data:)([^"?#]+\.(?:css|js))(?:\?v=[^"#]*)?(")')
for p in root.glob('*.html'):
    def replace(m):
        asset = (p.parent / m[2].decode('utf-8')).resolve()
        if not asset.is_relative_to(root) or not asset.is_file():
            return m[0]
        return m[1]+m[2]+b'?v='+digest(read(asset)).encode()+m[3]
    stage(p, ref.sub(replace,p.read_bytes()))
for p,data in changes.items():
    print(p.relative_to(root))
    if not check:
        p.write_bytes(data)
sys.exit(1 if check and changes else 0)
