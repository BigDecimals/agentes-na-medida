# Validação da primeira versão

Evidência local em Linux ARM64, registrada em 2026-09-18. Testes do aplicativo e medições de modelos são descritos separadamente.

## Aplicação Java

- `./scripts/java-lab.sh test`: **24 testes**, zero falhas/erros/ignorados.
- Teste focal `OrderCliTest#searchReturnsTopFiveAwaitingShipmentWithDescendingIdTieBreak`: **1 teste**, zero falhas/erros/ignorados; também executado com Maven `-q`.
- `python3 examples/order-service/test_wrapper.py`: **2 testes**, incluindo build e JAR real via Docker, schema/list/search e rejeição de limite inválido.
- IDs esperados na busca: `[1004, 1002, 1009, 1007, 1001]`, com valores e desempate conferidos na suíte.
- Toolchain fixado por digest. [Detalhes](examples/order-service/VALIDATION.md).

## Helpers e apresentação

- `npm test`: **23 testes Node** para recibos saneados, contagens Surefire, métricas, sincronização do trecho Java e planejamento de duração.
- `npm run test:browser`: **8 testes Chromium/Playwright** para navegação, reveals, ausência de requests externos/erros JS, status honesto do benchmark, seletor de tarefas, leitura/mobile, movimento reduzido, impressão e dimensões dos slides.
- `npm audit`: zero vulnerabilidades reportadas nas dependências npm dessa versão. Isso não substitui auditoria de todas as dependências Java ou análise de segurança do sistema.
- Inspeção visual por screenshots: capa, trechos Java, comandos e escolha de modelo. Corrigidos contraste do fundo e overflow do slide de skill.
- Impressão com fragmentos consolidados: **15 páginas/15 slides**.
- Planejamento: **845 segundos de conteúdo + 55 segundos de margem**. A duração real depende do ensaio.

`node scripts/test-summary.mjs OrderCliTest#searchReturnsTopFiveAwaitingShipmentWithDescendingIdTieBreak` devolveu `passed`, exit code 0 e 1 teste executado. `node scripts/test-summary.mjs MissingTest` devolveu `failed_or_incomplete`, exit code 1, sem reutilizar relatório antigo. Os logs privados e artefatos de build não são publicados.

Regressões reproduzidas antes das correções: recibos não podem reutilizar uma resposta de turno anterior, aceitar um turno incompleto, eventos desconhecidos ou delegação; a sincronização não pode certificar fontes alterados com um relatório antigo. `sync-snippets.mjs` executou uma compilação limpa com 24 testes aprovados. O seletor abreviado `OrderCliTest#searchReturnsTopFive*` também foi executado com sucesso.

## Coleta real pelo runtime Hermes

`python3 scripts/test_benchmark.py`: quatro testes de validação de usage, argumentos, ciclo de ferramentas e reconstrução do streaming. Campanha direta: **12/12 ensaios corretos**, três repetições por configuração, usando a autenticação já existente do Hermes. Recibos e estatísticas estão em [benchmarks/RESULTS.md](benchmarks/RESULTS.md); não representam o agente completo. Os testes Node recomputam medianas e verificam hashes do runner, prompt, skill e dataset.

## Coletor Codex CLI opcional: limite explícito

`node scripts/record-codex.mjs gpt-5.4-mini generic medium` encerrou no preflight com exit code 2: autenticação do CLI ausente. **Nenhuma chamada de modelo foi feita.** Esse identificador foi somente argumento do teste de preflight, não evidência de modelo disponível ou utilizado.

O parser foi validado com fixtures sintéticas de protocolo, que não aparecem nos slides como medições. O caminho autenticado do coletor é experimental e ainda exige smoke test; também requer JDK 21+ local. Campos não expostos pelo CLI, como modelo servido e pico de contexto, ficam desconhecidos. Nenhum resultado desse coletor CLI é publicado; as medidas reais usam o runner Hermes separado.

## Privacidade e publicação

O repositório usa somente dados sintéticos. `.gitignore` exclui caches, targets, logs, recibos locais e credenciais. Antes de publicar, o índice exato e o histórico de saída passam por scanner de segredos e revisão independente. A evidência desses gates fica registrada no PR, não por afirmação antecipada nesta página.
