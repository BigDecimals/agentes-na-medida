---
name: consultar-pedidos
description: Consultar pedidos do laboratório com filtros estruturados. Não usar para alterações de dados ou diagnóstico de infraestrutura.
---

Quando a ferramenta `orders` estiver disponível, use seus parâmetros `status` e `limit`. No terminal, use `./scripts/java-lab.sh search --status STATUS --limit N` a partir da raiz.

- “Aguardam envio” corresponde a `AWAITING_SHIPMENT`. Outros status: `SHIPPED`, `CANCELLED`, `PENDING_PAYMENT`.
- Preserve o limite solicitado (1..10). O código ordena por total decrescente, depois ID decrescente.
- Não escreva SQL arbitrário: a operação search já valida e limita resultados.
- Não amplie filtros quando não houver resultados. Uma página não informa o total.
- `total` é uma string decimal em reais. Responda só com dados retornados.
- Restrição não suportada exige esclarecimento; falha de execução não autoriza inventar dados.

Pré-requisito: JAR compilado. Consulte `examples/order-service/README.md` somente se precisar preparar o ambiente ou entender outro comando. A skill orienta o fluxo; validação e acesso seguro pertencem ao código.
