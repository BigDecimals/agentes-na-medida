# Validação executada

Resultados reais; somente dados sintéticos. Sem chamadas de modelo nesta validação.
Toolchain: imagem Maven 3.9.9 / Eclipse Temurin 21 fixada por digest no wrapper;
Spring Boot 4.1.0. Docker em Linux ARM64. Outras arquiteturas não foram executadas.

## RED → GREEN observado

| Incremento | RED observado | GREEN observado |
|---|---|---|
| `list` | 1 teste falhou: processo não encontrava a classe principal | 1 teste passou com Spring/JDBC/H2 e 12 fixtures |
| `schema` | 1 teste falhou: esperava tabela `ORDERS`, recebia pedidos | 2 testes passaram; metadados vêm do H2 |
| `search` | 1 teste falhou: esperava os cinco IDs ordenados, recebia os 12 pedidos | 3 testes passaram; filtro JDBC parametrizado e desempate |
| Validação de argumentos | 16 casos falharam: processo retornava 0 ou 1, não 2 | 19 testes passaram; enum, limite, aridade e flags validados antes do Spring |
| Wrapper Docker | Smoke falhou: wrapper inexistente | Smoke passou com JAR empacotado, schema/list/search e erro de limite |
| Bootstrap Maven | Regressão falhou: Jansi não podia mapear biblioteca nativa em tmpfs `noexec` | Regressão passou após permitir mapeamentos executáveis no tmpfs limitado |

Depois, cinco casos adicionais confirmaram os limites aceitos (1 e 10) e todos os
status. Nenhuma mudança de comportamento foi necessária para esses casos.

## Comandos finais e resultados

Executados a partir da raiz do repositório:

```bash
./scripts/java-lab.sh test -Dtest=OrderCliTest#searchReturnsTopFiveAwaitingShipmentWithDescendingIdTieBreak
# Tests run: 1, Failures: 0, Errors: 0, Skipped: 0; BUILD SUCCESS

./scripts/java-lab.sh test
# Tests run: 24, Failures: 0, Errors: 0, Skipped: 0; BUILD SUCCESS

python3 examples/order-service/test_wrapper.py
# Ran 2 tests; OK
# Inclui ./scripts/java-lab.sh build e execução real do JAR via Docker.

./scripts/java-lab.sh schema
# Array JSON com 5 colunas de ORDERS; TOTAL é NUMERIC(12,2).

./scripts/java-lab.sh list
# Array JSON com os 12 pedidos, id ASC.

./scripts/java-lab.sh search --status AWAITING_SHIPMENT --limit 5
# exit 0; IDs: [1004, 1002, 1009, 1007, 1001]

./scripts/java-lab.sh search --status SHIPPED --limit 11
# exit 2; stdout vazio; JSON invalid_arguments em stderr.
```

A suíte Java cria processos reais da aplicação; não substitui JDBC por mocks.
O smoke Python valida que stdout inteiro é um único documento JSON e que consultas
válidas não escrevem stderr. Os limites Docker e timeouts são configuração de
execução, não uma alegação de isolamento contra código hostil.
