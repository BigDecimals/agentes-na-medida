# Laboratório Java: pedidos sintéticos

Aplicação **console**, sem servidor: Java 21, Spring Boot 4.1.0, Spring JDBC,
Lombok (`@RequiredArgsConstructor`), records, H2 em memória e JUnit.
Cada execução recria os mesmos 12 pedidos; não há nomes, endereços ou dados reais.

## Executar

Na raiz do repositório, com Bash e Docker disponíveis (não exige Java/Maven no host):

```bash
./scripts/java-lab.sh build
./scripts/java-lab.sh schema
./scripts/java-lab.sh list
./scripts/java-lab.sh search --status AWAITING_SHIPMENT --limit 5
```

O primeiro build baixa a imagem e as dependências; precisa de internet. Os comandos
`schema`, `list` e `search` executam o JAR em um contêiner **sem rede**. Em checkout
novo, esses comandos compilam automaticamente se o JAR ainda não existir.
**Após editar fontes, rode `build` novamente**: um JAR existente não é recompilado
implicitamente. Faça o build antes de medir consultas; não inclua o download no
benchmark. Não é necessário executar código durante a apresentação.

## Contrato pequeno

| Comando | Resultado JSON em stdout |
|---|---|
| `schema` | Colunas da tabela `ORDERS`, na ordem de declaração; nome, tipo, precisão/escala numérica e nulabilidade |
| `list` | Todos os 12 pedidos, ordenados por `id ASC` |
| `search --status STATUS --limit N` | Somente o status solicitado, `total DESC, id DESC`, no máximo N linhas |

A ordem dos argumentos é fixa. Não há parâmetros opcionais nem SQL livre.
`STATUS` é um enum sensível a maiúsculas: `AWAITING_SHIPMENT`, `SHIPPED`,
`CANCELLED`, `PENDING_PAYMENT`. `N` é um inteiro de **1 a 10**, inclusive.
Filtros são parâmetros JDBC, não concatenação de SQL. `AWAITING_SHIPMENT` significa
aguardando envio: os pedidos `SHIPPED` não entram, mesmo com valores maiores.

Uma consulta válida devolve um array JSON (inclusive `[]` quando não há resultados),
com exit code 0 e sem logs Spring. Datas são ISO `YYYY-MM-DD`. `total` é uma
**string decimal com duas casas**, em reais, para não perder precisão monetária.
`shippedOn` é `null` antes do envio. Os nomes camelCase do JSON correspondem às
colunas snake_case do banco.

Argumentos inválidos: exit code **2**, stdout vazio e JSON em stderr:

```json
{"error":"invalid_arguments","usage":"schema | list | search --status STATUS --limit 1..10"}
```

Falhas de infraestrutura/build também retornam código não zero; não são resultados
de consulta. Logs de build vão para stderr, nunca para stdout da consulta.

## Tarefa e resposta verificável

> Liste os cinco pedidos de maior valor que aguardam envio. Em empate, priorize o
> maior ID. Retorne os IDs na ordem encontrada.

```bash
./scripts/java-lab.sh search --status AWAITING_SHIPMENT --limit 5
```

Resposta: **`[1004, 1002, 1009, 1007, 1001]`**.

| ID | Total (R$) | Status |
|---|---:|---|
| 1004 | 2500.00 | AWAITING_SHIPMENT |
| 1002 | 2500.00 | AWAITING_SHIPMENT |
| 1009 | 1750.00 | AWAITING_SHIPMENT |
| 1007 | 1750.00 | AWAITING_SHIPMENT |
| 1001 | 1250.00 | AWAITING_SHIPMENT |

As fixtures incluem empates e distrações: `1003` já enviado (9999.00), `1005`
cancelado (8888.00), `1008` aguardando pagamento (7777.00). O caminho genérico pode
inspecionar `schema` e `list`, filtrando e ordenando por conta própria; a ferramenta
estreita recebe somente status e limite. Ambos consultam exatamente a mesma base.

## Testes reais

```bash
# Suíte Java completa, com processos reais e H2 (sem mocks):
./scripts/java-lab.sh test
# Foco na consulta usada na apresentação:
./scripts/java-lab.sh test -Dtest=OrderCliTest#searchReturnsTopFiveAwaitingShipmentWithDescendingIdTieBreak
# Smoke do wrapper + JAR empacotado; Python 3 stdlib, sem pip:
python3 examples/order-service/test_wrapper.py
```

Equivalente Maven, dentro de `examples/order-service` com JDK 21 + Maven:
`mvn -B -ntp test` ou
`mvn -B -ntp -Dtest=OrderCliTest#searchReturnsTopFiveAwaitingShipmentWithDescendingIdTieBreak test`.
O caminho Docker é o validado e fixa o toolchain. Os testes verificam JSON puro,
fixtures, esquema real, desempate, status e rejeição de entradas inválidas.

## Reprodutibilidade e escopo

- Imagem: `maven:3.9.9-eclipse-temurin-21@sha256:3a4ab3276a087bf276f79cae96b1af04f53731bec53fb2e651aca79e4b10211e`.
- Spring Boot 4.1.0: [requisitos oficiais](https://docs.spring.io/spring-boot/system-requirements.html)
  e [POM publicado](https://repo.maven.apache.org/maven2/org/springframework/boot/spring-boot-starter-parent/4.1.0/spring-boot-starter-parent-4.1.0.pom).
- Somente `examples/order-service` é montado no build; na consulta, somente o JAR,
  somente leitura. Nenhuma variável de configuração do host é encaminhada.
- Cache Maven local e ignorado pelo Git: `examples/order-service/.cache/m2`;
  artefatos: `examples/order-service/target`. Sem volumes persistentes de banco.
- Contêineres efêmeros (`--rm`), 1 CPU, 1 GiB, 128 PIDs; timeout de 240 s por Maven
  e 30 s por consulta, com encerramento forçado após mais 5 s. O download inicial
  da imagem é controlado pelo Docker, antes do timeout interno.
- Exemplo didático, não uma fronteira de segurança para código hostil: acesso ao
  Docker e execução de Maven são capacidades de desenvolvimento.
