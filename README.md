camargofc

Site oficial: https://camargofc.com.br

## Manutenção
Consulte AGENTS.md, CLAUDE.md e CHANGELOG.md.

## Cache
Execute `python3 scripts/atualizar-cache.py` para atualizar referências por hash; `--check` verifica sem gravar. O workflow de commits automáticos permanece desativado.

## Agenda e Home
A Home lê agenda.html. Cada confronto deve ter data-inicio ISO 8601 com fuso -03:00 e estado explícito (ver AGENTS.md). Jogos encerrados, adiados ou cancelados não aparecem como próximos. Horário passado não significa partida encerrada.
