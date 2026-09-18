# Protocolo e limites da comparação

## O que foi medido

Execuções reais de modelos Codex, usando a autenticação já existente do Hermes. O runner implementa um **ciclo Responses limitado**, não o Codex CLI nem o agente Hermes completo. Cada execução recebe apenas o pedido público, instruções do laboratório e schemas das ferramentas; não recebe a conversa, memória, perfis, arquivos privados ou a resposta esperada.

A comparação é do **desenho do fluxo**, não um ranking de inteligência ou uma promessa de economia universal. Os números, recibos e resumos estão em [results/](results/).

## Desenho

- Workflow: `gpt-5.6-luna`, esforço `low`, três execuções por braço.
- Modelo: `gpt-5.6-luna` versus `gpt-6-astra`, ambos `low`, mesma ferramenta pronta, três execuções por modelo. As três execuções Luna/ferramenta são compartilhadas entre as análises, não novas observações.
- Total da campanha: doze execuções independentes. O modelo solicitado e o devolvido pelo provedor constam de cada recibo.
- Ordem dos braços Luna: genérico/ferramenta/skill; ferramenta/skill/genérico; skill/genérico/ferramenta. Uma execução Astra/ferramenta ocorre após cada rodada. Não houve randomização nem controle de carga do provedor.
- Mesmo JAR pré-compilado, dataset sintético com doze pedidos, prompt, critério de acerto e desempate. O hash do dataset é extraído de dentro do JAR e comparado ao fonte; o runner rejeita divergências.

## Interfaces

- **Genérico:** ferramenta `orders` com `schema` ou `list`. O modelo pode consultar a listagem diretamente; nenhuma leitura de schema é obrigatória. Filtra e ordena a pequena listagem em sua resposta.
- **Ferramenta:** `orders(status, limit)` chama a busca Java parametrizada, ordenada e limitada.
- **Ferramenta + skill:** mesma busca, mais `load_skill`, que retorna a skill pública. O modelo é instruído a carregá-la. O texto e a chamada extras **custam tokens**; essa tarefa simples pode não compensar esse custo.

Não há shell, SQL arbitrário, acesso ao filesystem ou subagentes expostos aos modelos. O host valida argumentos e executa somente comandos Java permitidos, via Docker. Portanto, o baseline **não** representa um agente de programação completo que poderia escrever um script de filtragem. O coletor CLI opcional é outro protocolo; não misturar seus resultados com esta campanha.

## Contagem

Cada chamada usa `store=false`, sem histórico anterior ao ensaio, e sem retries automáticos do SDK. O runner permite até seis chamadas e impõe deadline por ensaio. Mudanças nos scripts/prompt/skill ou JAR durante um ensaio invalidam seu resultado.

- Input e output: somas do usage terminal informado pelo provedor em **todas** as chamadas daquele ensaio, não somente a última resposta.
- Cached input é subconjunto do input; reasoning é subconjunto do output. Não somar novamente.
- `maxReportedInputTokens`: maior input reportado de uma chamada. Não é o pico interno de contexto, que não é exposto.
- Tempo inclui chamadas de modelo e ferramentas Java, mas exclui autenticação e build. Não é latência pura do modelo.
- Nenhuma conversão para reais, preço por token ou consumo da franquia da assinatura é inferida.
- A conversa principal e os probes de preparação não estão na janela comparativa. Não há filhos dentro do ensaio. Se outra arquitetura incluir pai/filhos, medir ambos.
- Tentativas da campanha não podem ser descartadas por falharem. Usage ausente permanece desconhecido e impede um total completo; nunca vira zero.

Publicamos cada execução e a **mediana de três** por configuração, além de acertos, intervalos e somas. As repetições não são necessariamente estatisticamente independentes: o cache do provedor pode persistir mesmo com conversas novas. A amostra pequena de uma única consulta não sustenta significância estatística, conclusões sobre produção, grandes bancos, outras tarefas ou uma hierarquia de modelos.

## Preparação e transparência

O caminho inicial via Codex CLI encontrou ausência de login. O caminho direto confirmou a autenticação Hermes e consultou o catálogo da conta. Um probe com `gpt-5.4-mini` foi rejeitado como não suportado por esse acesso; não é um resultado de benchmark. Um primeiro smoke Luna falhou porque o evento terminal omitia o output já entregue nos eventos de streaming. O coletor foi corrigido, ganhou teste de regressão e passou um segundo smoke antes da campanha. Os dois recibos de smoke estão separados dos ensaios comparáveis. Um probe de diagnóstico de transporte adicional não coletou um recibo de uso; não alegamos contabilização completa da preparação.

O output é reconstruído de `response.output_item.done` quando necessário, mas o usage vem do evento terminal do provedor. Raciocínio interno e conteúdo criptografado permanecem somente em memória durante a execução; não são gravados nem publicados.

## Reprodução

Veja [README.md](README.md). O runner não altera a configuração do Hermes, não copia credenciais e não cria um serviço ou proxy. Bibliotecas e helpers internos do Hermes podem mudar: valide novamente após atualizar o runtime. Os hashes dos scripts usados, do JAR e do dataset constam dos recibos. Resultados registrados não são automaticamente atualizados por um novo build.
