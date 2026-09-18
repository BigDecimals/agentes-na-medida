# Reproduzir as medidas

Leia [a metodologia](methodology.md) e [os resultados](RESULTS.md). A campanha publicada usa a autenticação existente do Hermes — **não precisa de login no Codex CLI**.

## Runner usado na campanha

Requisitos: Linux, Docker, Python do ambiente Hermes com `hermes_cli`, `agent.codex_headers` e o SDK `openai`; provedor `openai-codex` já autenticado. O runner resolve credenciais em memória pelo runtime oficial; não imprima nem copie arquivos de autenticação. Não altera configurações ou cria proxy.

```sh
./scripts/java-lab.sh build
python3 scripts/test_benchmark.py
python3 scripts/record-hermes.py --model gpt-5.6-luna --arm tool --campaign smoke
```

A partir da mesma revisão, execute três rodadas. Use `--campaign measured-v1 --trial N` em cada comando; braços Luna em ordem `generic/tool/skill`, `tool/skill/generic`, `skill/generic/tool`. Após cada rodada, execute `gpt-6-astra --arm tool` com o mesmo N. O esforço padrão é `low`. Verifique primeiro o catálogo disponível na sua conta: disponibilidade e resultados podem mudar.

Os recibos saneados ficam em `.runs/hermes-benchmark/` (até 40 arquivos, sem logs brutos). Uma campanha nova deve usar outro nome para não misturar observações. Não repetir silenciosamente uma tentativa que falhou. Para exportar a campanha completa:

```sh
python3 scripts/export-benchmark.py --campaign measured-v1
npm test
npm run test:browser
```

O exportador desta experiência exige as doze combinações planejadas, sem duplicatas, usage completo e condições consistentes. Recalcula os resumos; recusa campanha parcial. Revise os arquivos gerados antes de publicar. Os recibos públicos existentes são evidência histórica, não promessa de resultado reproduzível bit a bit.

## Alternativa: Codex CLI

`scripts/record-codex.mjs` é um coletor separado, ainda experimental e sem campanha autenticada validada. Requer CLI autenticado, JDK 21+ local e JAR pré-compilado. Seus braços usam um workspace temporário/sandbox e têm outro contexto/runtime; **não misturar suas medidas com as do runner Responses**.

```sh
node scripts/record-codex.mjs MODELO generic medium
```

A indisponibilidade de login nesse CLI não impede o runner Hermes acima nem assistir à apresentação estática.
