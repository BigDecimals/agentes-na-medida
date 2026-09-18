# Roteiro de apresentação

Apresentação em português brasileiro. 845 segundos de fala planejada, com 55 segundos de margem até 15 minutos. Tempos são metas de ensaio, não medidas da fala real.

Não executar código ao vivo. As notas também estão nos slides (tecla S). As medidas são de doze ensaios de uma consulta sintética, não um ranking geral de modelos nem uma promessa de economia universal.

## inicio — 30 s

Abertura, 30 segundos. A audiência já usa IA: não vamos explicar o que é um chatbot. A conversa é sobre desenhar o trabalho para não gastar inteligência com o que já sabemos executar. Os números vêm de execuções reais de uma consulta pequena. Não prometa a mesma economia para toda tarefa.

## padaria — 45 s

45 segundos. Você entra na padaria e diz que está com fome. Pão? Sanduíche? Café da manhã ou festa? Quero bolo melhora o pedido, mas ainda há decisões abertas. Clique para as perguntas e depois para a fatia de chocolate. O alvo da piada é a ambiguidade, não o usuário. Não é preciso explicar a receita ao atendente.

## pedido — 45 s

45 segundos. Um agente pode e deve pedir esclarecimentos quando necessário; ele não é obrigado a adivinhar. Pedidos amplos são adequados para exploração. A distinção é não deixar decisões de alto impacto escondidas. Transição: instruções melhores não significam prompts cada vez maiores.

## pecas — 55 s

55 segundos. Evite transformar isso num glossário. O modelo entende o pedido; o agente mantém o ciclo; a ferramenta consulta pedidos; a skill diz qual ferramenta usar e quais limites preservar. Uma skill não é outro modelo nem uma barreira de segurança. MCP é uma forma de expor ferramentas; um comando local também serve.

## contexto — 65 s

65 segundos. Um teste Maven não gasta tokens por existir. O modelo gasta ao decidir e ao receber a saída. Logs grandes podem reaparecer no contexto das próximas chamadas. Cache pode mudar o preço, não faz o conteúdo desaparecer. Contar somente a resposta final ou o agente filho esconde parte do custo. Contexto e input acumulado não são sinônimos.

## experimento — 50 s

50 segundos. Apresente o laboratório de pedidos, independente de qualquer sistema real. H2 é um banco SQL embarcado, escolhido para reprodução simples; não é uma simulação de texto. A consulta usa JDBC e retorna valores decimais e IDs estáveis. O desempate também precisa estar definido. O código está no repositório.

## caminhos — 65 s

65 segundos. Estes são caminhos conceituais, não uma animação fingindo ser uma execução real. Ferramentas movem trabalho determinístico para código. Skills evitam redescoberta. Separar os três braços ajuda a não atribuir todo ganho à skill. Rodadas independentes, ordem alternada e falhas mantidas nos resultados.

## skill — 60 s

60 segundos. Codex descobre metadados de skills e carrega as instruções quando relevantes. Não é custo zero. Este bloco demonstra regras, não esconde uma enciclopédia. Não se deve recarregar documentação inteira para uma tarefa já resolvida. O comando concreto está na skill do laboratório e será ligado à implementação verificada.

## codigo — 45 s

45 segundos. Mostrar a consulta parametrizada da implementação testada. O modelo não precisa inventar joins, ordenação ou limites. O banco faz o trabalho e devolve apenas a página pedida. Regras da ferramenta continuam valendo independentemente do prompt.

## evidencia — 65 s

65 segundos. Medianas de três execuções Luna/low: genérico 1782 tokens, ferramenta 929, ferramenta mais skill 1978. Todos acertaram. A ferramenta reduziu o trabalho desta consulta; carregar uma skill desnecessária custou mais. Isso não prova que skills são ruins: procedimentos úteis podem evitar tentativas e erros em tarefas difíceis. A amostra tem um único pedido e não mede o agente completo. A conversa principal e probes de preparação estão fora da comparação; os limites e recibos estão no repositório.

## testes — 70 s

70 segundos. A mesma mudança pode exigir teste focal, testes do módulo e integração. Use o menor check relevante durante iteração; execute a validação exigida antes de concluir. A primeira execução também inclui compilação e dependências, então não atribua toda diferença de tempo ao escopo dos testes. O comando focal vem do exemplo que realmente executamos.

## logs — 50 s

50 segundos. Não mostrar um log inventado como resultado real: o painel está rotulado como ilustração. Um helper deve interpretar relatórios Surefire, preservar o exit code e manter o log completo em armazenamento limitado. Nunca transformar saída vazia em sucesso. O modelo lê só o necessário para decidir o próximo passo.

## modelos — 90 s

90 segundos. Clique entre tarefas. Modelo menor para filtros é uma hipótese avaliável, não garantia. Diagnóstico entre serviços pode justificar capacidade e esforço maiores. Autorização pede revisão cuidadosa e testes negativos: modelo grande não é controle de segurança. Não comparamos capacidades relativas de Astra e Sol sem evidência. Um modelo barato que falha repetidamente pode custar mais por tarefa correta.

## delegacao — 65 s

65 segundos. O benefício é conter exploração ruidosa e, às vezes, paralelizar. O filho também consome tokens e pode herdar contexto. Em consultas simples, chamar a ferramenta diretamente costuma ser a arquitetura mais simples. Não precisa de equipe de agentes para servir a fatia de bolo.

## fechamento — 45 s

45 segundos. Feche retomando a padaria: você não explica o funcionamento da padaria toda vez que compra bolo. Melhor fluxo reduz decisões desnecessárias, mas não elimina as necessárias. A apresentação tem 845 segundos de conteúdo planejado e uma pequena margem até 15 minutos; consulte o roteiro para a soma validada. Convide a audiência a reproduzir e questionar as medidas, não decorar uma receita universal.
