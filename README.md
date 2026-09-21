# Agentes na medida

**Seu agente precisa pensar tanto assim?** Uma apresentação interativa de aproximadamente 15 minutos, em português brasileiro, sobre skills, ferramentas, contexto e escolha de modelos.

**[Abrir apresentação](https://bigdecimals.github.io/agentes-na-medida/)** · **[Modo leitura](https://bigdecimals.github.io/agentes-na-medida/?view=reading)** · [Fontes](docs/sources.html)

**[Apresentação 2](https://bigdecimals.github.io/agentes-na-medida/apresentacao-2/)** · [Leitura + notas](https://bigdecimals.github.io/agentes-na-medida/apresentacao-2/?view=reading) · [Evidências](https://bigdecimals.github.io/agentes-na-medida/apresentacao-2/evidence/) — comparações mais claras de skills e exemplos de subagentes; versão independente, sem substituir a primeira.

## A ideia

Uma solicitação clara ajuda. Um fluxo preparado evita que o agente precise redescobrir tudo. Ferramentas executam operações determinísticas; skills documentam como usá-las; subagentes isolam trabalho quando o benefício compensa o overhead.

O objetivo não é minimizar tokens a qualquer custo. É concluir corretamente a tarefa, com menos trabalho desnecessário. Modelo, esforço de raciocínio e risco precisam ser avaliados juntos.

## O que funciona sem servidor próprio

A apresentação usa HTML, CSS e reveal.js com dependências locais. GitHub Pages serve os arquivos de `docs/`. O navegador não executa Java, não acessa um banco e não chama modelos. Não há CDN, analytics ou credenciais.

- Setas / espaço: avançar e revelar conteúdo.
- Esc: visão geral. S: notas e cronômetro (permita a janela do apresentador).
- Leitura: todas as seções em uma página, incluindo no celular.
- Imprimir: abre o modo de impressão/PDF; use a impressão do navegador em paisagem.

As notas do apresentador são públicas, embora não apareçam na projeção.

## Código e reprodução

- [`examples/order-service/`](examples/order-service/): Java, Spring Boot, JDBC, H2, Lombok e testes. Dados sintéticos fixos, sem serviços externos.
- [`.agents/skills/`](.agents/skills/): procedimento reutilizável do laboratório.
- [`prompts/`](prompts/): pedido e formato de resposta do experimento.
- [`benchmarks/methodology.md`](benchmarks/methodology.md): protocolo e limites.
- [`benchmarks/results/`](benchmarks/results/): estado explícito da coleta; nunca números inventados.
- [`docs/`](docs/): apresentação publicável sem build no GitHub.

**Resultados reais:** doze execuções isoladas, todas corretas, usando autenticação Hermes e um ciclo Responses limitado. Em Luna/low, as medianas foram 1.782 tokens (genérico), 929 (ferramenta) e 1.978 (ferramenta + skill). Carregar uma skill não foi vantagem nesta consulta simples. Isso não é um benchmark do agente completo nem uma economia universal. [Resultados e limites](benchmarks/RESULTS.md).

## Desenvolvimento da apresentação

Node.js 22 ou compatível:

```sh
npm ci
npm test
npx playwright install chromium
npm run test:browser
npm run serve
```

O servidor de desenvolvimento escuta somente em `127.0.0.1:4173`. Ele é opcional para desenvolvimento local e não faz parte da hospedagem. `npm run vendor` atualiza apenas os arquivos do reveal.js da versão fixada no lockfile. Não é necessário instalar Node para assistir pelo GitHub Pages.

## Verificar sem despejar o log inteiro

```sh
node scripts/test-summary.mjs OrderCliTest#searchReturnsTopFiveAwaitingShipmentWithDescendingIdTieBreak
```

O helper executa o teste real e devolve JSON com exit code, contagens de relatórios Surefire **novos**, tempo e caminho do log. Relatório ausente, nenhum teste executado ou falha não viram sucesso. Logs locais ficam em `.runs/tests/`, limitados a 10 arquivos e removidos por idade (24 horas) na próxima execução; cada arquivo tem limite de tamanho. Em falha, leia o trecho e depois o log completo quando necessário.

`node scripts/sync-snippets.mjs` executa uma compilação limpa e a suíte Java completa (`java-lab.sh verify`), verifica que os fontes não mudaram durante a execução e só então atualiza o trecho publicado e seus hashes. Um relatório antigo não certifica código alterado. O site usa somente essa cópia estática.

## Publicação

Em Settings → Pages, escolher **Deploy from a branch**, branch `main`, pasta `/docs`. Não há workflow próprio de build/teste. O GitHub executa a publicação Pages gerenciada. Links e assets usam caminhos relativos para funcionar sob o caminho do repositório.

## Licença

Conteúdo autoral: [MIT](LICENSE). reveal.js: [licença preservada](docs/vendor/reveal/LICENSE), com avisos das dependências incorporadas. Dados de exemplo são sintéticos. Nenhum resultado de sistema privado é reutilizado.
