# Manutenção do Camargo FC

- Fonte oficial: branch main do repositório cl-camargo/camargofc.
- Preserve identidade rubro-negra, layouts desktop/mobile, fotos e navegação.
- Acervo histórico validado pela diretoria em 24/11/2026. Não altere nomes, jogos, gols, resultados ou conquistas sem autorização e evidência.
- Não sobrescreva arquivos com cópias antigas; revise o diff contra main.
- Agenda é a fonte dos confrontos da Home. Use data-inicio ISO 8601 com UTC-03:00 e selo Agendado; ao mudar estado, atualize data-status (agendado, em andamento, aguardando resultado, encerrado, adiado, cancelado). Não presuma resultado pelo relógio.
- Execute python3 scripts/atualizar-cache.py antes do commit quando possível. --check apenas verifica. Não habilite commits automáticos até validar publicação do Pages.
- Teste desktop/mobile e fichas dos atletas; informe explicitamente testes não realizados.
