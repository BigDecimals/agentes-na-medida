# Resultados registrados — 2026-09-18

Doze execuções reais; **12/12 corretas**. Cada configuração tem três ensaios. Valores abaixo são **medianas por ensaio**, não estimativas nem resultados de fixtures.

## Fluxos — gpt-5.6-luna / low

- **generic**: 1782 tokens totais; intervalo 1781–1791; 3/3 corretas. Tempo mediano: 19.956 s.
- **tool**: 929 tokens totais; intervalo 923–929; 3/3 corretas. Tempo mediano: 12.035 s.
- **skill**: 1978 tokens totais; intervalo 1936–1978; 3/3 corretas. Tempo mediano: 11.913 s.

A mediana com ferramenta foi **47.9% menor** que a genérica nesta consulta. A skill **aumentou** o uso: ensinar um caminho que a ferramenta já deixava claro adicionou texto e uma chamada. Não ocultamos esse resultado; skill não é desconto automático.

## Modelos — mesma ferramenta / low

- **gpt-5.6-luna**: 929 tokens; 3/3 corretas; tempo mediano 12.035 s.
- **gpt-6-astra**: 891 tokens; 3/3 corretas; tempo mediano 12.160 s.

Luna resolveu a tarefa sem precisar de Astra. Mas **não** consumiu menos tokens que Astra aqui; tampouco medimos preço, franquia da assinatura ou capacidade geral. Não há base para um ranking ou significância estatística.

## Escopo e dados
- Campanha completa: 30 chamadas de modelo; 15825 tokens de input e 875 de output. Cache reportado: zero. Reasoning, quando reportado, já integra output.
- [Recibos individuais](results/runs.json), [resumos computados](results/summary.json), [smokes de preparação](results/setup-receipts.json).
- [Protocolo, ordem e limitações](methodology.md). Uma única consulta, doze registros sintéticos, três repetições por configuração; sem generalização para produção.
- Runner limitado usando autenticação Hermes; não o agente completo nem o Codex CLI. A conversa principal, preparação e probes ficam fora da comparação.
- A mediana do total é calculada por ensaio; não precisa ser igual à soma das medianas separadas de input e output.
- Não publicamos raciocínio, auth, conteúdo de outros projetos ou transcrições privadas.
