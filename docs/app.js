// ============================================================================
// Agentes na Medida — Interactive Presentation Controller
// ============================================================================

let currentSlide = 0;
const totalSlides = 9;

// Speaker Notes (~15 minutes total pacing)
const speakerNotes = [
  {
    title: "Slide 01 · Abertura (~1.5 min)",
    html: `
      <p><strong>Gancho inicial:</strong> Quando pedimos algo para a IA e ela entrega algo fora do esperado, nossa reação costuma ser "o modelo alucinou". Mas na maioria das vezes o problema está em um de dois extremos:</p>
      <ul>
        <li><strong>Falta de contexto:</strong> obrigamos a IA a adivinhar regras que estão só na nossa cabeça.</li>
        <li><strong>Excesso de ruído:</strong> jogamos tudo de uma vez na conversa, deixando caro, lento e confuso.</li>
      </ul>
      <p>Nos próximos 15 minutos, vamos ver como usar <strong>Pedidos Descritivos, Instructions, Cache, Tools, Skills e Subagents</strong> na medida certa.</p>
    `
  },
  {
    title: "Slide 02 · O Pedido Descritivo (~2 min)",
    html: `
      <p><strong>Ponto principal:</strong> A IA é uma máquina probabilística. Quando você faz um pedido vago, ela não levanta a mão para perguntar — ela "chuta" a resposta mais provável.</p>
      <ul>
        <li>Mostre o <strong>Pedido Vago</strong> e os 5 pontos cegos onde a IA teve que adivinhar.</li>
        <li>Clique em <strong>Pedido Descritivo</strong>: mostre como responder aos 4 pilares (<strong>Objetivo, Contexto, Restrições e Formato</strong>) elimina os chutes de primeira.</li>
        <li><em>Gancho para o próximo slide:</em> "Mas eu preciso digitar as regras da empresa toda vez? Não! É aí que entram as Instructions."</li>
      </ul>
    `
  },
  {
    title: "Slide 03 · Instructions & Prefix Caching (~2 min)",
    html: `
      <p><strong>Ponto principal:</strong> Tudo o que vale para o projeto inteiro vai nas <strong>Instructions</strong>. Além de poupar digitação, isso ativa o <strong>Prefix Caching</strong>.</p>
      <ul>
        <li>Explique que os modelos leem de cima para baixo. Tudo que fica estático no topo (Sistema + Tools + Instructions) fica salvo em cache após a 1ª mensagem.</li>
        <li>Clique em <strong>2ª+ Mensagem</strong>: mostre a economia de até 90% nos tokens daquele bloco e a velocidade de resposta.</li>
        <li>Clique em <strong>Armadilha</strong>: se colocarmos todos os manuais da empresa num arquivo só, o contexto já nasce cheio. Como resolver?</li>
      </ul>
    `
  },
  {
    title: "Slide 04 · Instructions Modularizadas (~1.5 min)",
    html: `
      <p><strong>Ponto principal:</strong> Em vez de um arquivo monolítico gigante, modularizamos as instruções por pasta!</p>
      <ul>
        <li>Clique nas pastas (<code>/frontend</code>, <code>/backend</code>, <code>/tests</code>, <code>/docs</code>) para mostrar que a IA só carrega as regras daquela área quando entra na pasta.</li>
        <li>Se a IA está mexendo no banco de dados ou na documentação de negócio, ela não gasta tokens lendo regras de CSS.</li>
      </ul>
    `
  },
  {
    title: "Slide 05 · Tools: Poupando Tokens e Reuso (~2 min)",
    html: `
      <p><strong>Ponto principal:</strong> Não use tokens caros do modelo para fazer trabalho braçal que um código ou script faz em milissegundos.</p>
      <ul>
        <li>Compare os dois lados: colar 5.000 linhas no prompt gasta ~18.000 tokens, demora e não deixa nada pronto para o próximo colega.</li>
        <li>Com uma <strong>Tool</strong>, a lógica roda fora do modelo, devolve só o resultado exato (~240 tokens) e fica <strong>reaproveitável</strong> para toda a equipe.</li>
      </ul>
    `
  },
  {
    title: "Slide 06 · Skills: Como Poupam Tokens (~2 min)",
    html: `
      <p><strong>Ponto principal:</strong> Sem uma Skill, o agente principal precisa <strong>abrir arquivo por arquivo</strong> para entender como o projeto funciona, gastando milhares de tokens de exploração.</p>
      <ul>
        <li><strong>Economia 1 (Catálogo Leve):</strong> Em repouso, cada Skill gasta apenas ~30 tokens (nome + descrição).</li>
        <li><strong>Economia 2 (Atalho na Execução):</strong> Quando ativada, a Skill entrega o mapa exato (<code>SKILL.md</code> ~320 tokens) + scripts prontos. O agente <strong>pula a leitura arquivo a arquivo</strong> e vai direto ao ponto!</li>
      </ul>
    `
  },
  {
    title: "Slide 07 · Subagents: Isolando o Trabalho Pesado (~2 min)",
    html: `
      <p><strong>Ponto principal:</strong> E quando não existe receita pronta e a IA <em>realmente precisa</em> ler 40 arquivos (ex: caçar um bug inédito ou auditar o sistema)?</p>
      <ul>
        <li>Se o agente principal fizer isso, ele acumula +14.000 tokens de código lido na sua conversa principal.</li>
        <li>Com um <strong>Subagent</strong>, essa exploração acontece em uma <strong>janela de contexto separada</strong> (que é descartada no fim), e o agente principal recebe apenas ~220 tokens com a conclusão!</li>
      </ul>
    `
  },
  {
    title: "Slide 08 · Skills vs. Subagents Lado a Lado (~1 min)",
    html: `
      <p><strong>O resumo do duelo:</strong></p>
      <ul>
        <li><strong>Skill (Mesma Conversa):</strong> Dá o mapa pronto (~320t) para o agente <strong>não precisar</strong> abrir arquivo por arquivo.</li>
        <li><strong>Subagent (Outra Sala):</strong> Quando <strong>é obrigatório</strong> abrir 40 arquivos (~12.000t), faz isso em outra sala e traz só a resposta (~250t)!</li>
      </ul>
    `
  },
  {
    title: "Slide 09 · Mapa de Decisão e Fechamento (~1 min)",
    html: `
      <p><strong>Fechamento prático:</strong></p>
      <ul>
        <li>Passe rapidamente pela tabela resumo: cada peça tem seu lugar exato.</li>
        <li>Convide o público a olhar os 6 cenários práticos embaixo: quando damos o contexto certo, na hora certa e no lugar certo, paramos de contar com a sorte e passamos a ter engenharia previsível.</li>
      </ul>
    `
  }
];

// ============================================================================
// SLIDE 02 DATA: Descriptive Prompts vs Vague Prompts
// ============================================================================
let currentPromptScenario = "product";
let currentPromptMode = "vague";

const promptData = {
  product: {
    vaguePrompt: `"Crie um resumo da sprint para apresentar amanhã."`,
    descriptivePrompt: `<span class="prompt-tag tag-obj">Objetivo</span> Crie um resumo executivo da Sprint 42 focado em valor de negócio entregue.\n<span class="prompt-tag tag-ctx">Contexto</span> O público é a diretoria comercial (não-técnica). Tivemos 4 entregas concluídas no módulo de checkout e 1 adiamento por dependência externa.\n<span class="prompt-tag tag-res">Restrições</span> Não use jargões de código (PRs, refatoração, endpoints). Máximo de 1 página.\n<span class="prompt-tag tag-fmt">Formato</span> 1) Destaques de impacto no cliente, 2) Métricas atingidas, 3) Riscos e próximos passos em tabela.`,
    blindSpots: [
      { q: "Quem vai ler?", bad: "Chute da IA: escreveu um texto técnico cheio de nomes de tarefas do Jira.", good: "Definido: diretoria comercial (linguagem de negócio, sem jargão técnico)." },
      { q: "Qual o foco principal?", bad: "Chute da IA: listou tarefas operacionais em vez do impacto no cliente.", good: "Definido: foco em valor entregue no módulo de checkout." },
      { q: "Como tratar o que atrasou?", bad: "Chute da IA: ignorou os bloqueios ou inventou justificativas genéricas.", good: "Definido: explicar o adiamento por dependência externa com plano de ação." },
      { q: "Qual o tamanho e tom?", bad: "Chute da IA: gerou um texto longo de 9 parágrafos prolixos.", good: "Definido: máximo de 1 página, direto ao ponto." },
      { q: "Qual o formato visual?", bad: "Chute da IA: texto corrido difícil de apresentar em reunião.", good: "Definido: 3 blocos claros + tabela de riscos e próximos passos." }
    ],
    vagueOutcome: `⚠️ <strong>Resultado:</strong> Você gasta mais 4 mensagens pedindo "deixe menos técnico", "resuma mais", "coloque em tabela" — desperdiçando tempo e tokens.`,
    descriptiveOutcome: `✅ <strong>Resultado:</strong> Entrega pronta na 1ª resposta, no formato exato da reunião, sem retrabalho.`
  },
  dev: {
    vaguePrompt: `"Crie um endpoint para exportar os pedidos em CSV."`,
    descriptivePrompt: `<span class="prompt-tag tag-obj">Objetivo</span> Crie o endpoint <code>GET /api/v1/orders/export</code> para exportar pedidos filtrados por período.\n<span class="prompt-tag tag-ctx">Contexto</span> Projeto Node/TypeScript usando Prisma. A tabela pode ter até 50 mil registros por mês.\n<span class="prompt-tag tag-res">Restrições</span> Use streaming para não estourar a memória RAM; exija permissão <code>ADMIN</code>; limite máximo de 90 dias por consulta.\n<span class="prompt-tag tag-fmt">Formato</span> Retorne o controller, validação de query params e testes unitários dos casos de erro.`,
    blindSpots: [
      { q: "Volume de dados e memória?", bad: "Chute da IA: carregou tudo na memória com findMany() (vai derrubar o servidor em produção).", good: "Definido: uso obrigatório de cursor/streaming para suportar 50 mil registros." },
      { q: "Segurança e permissão?", bad: "Chute da IA: deixou a rota aberta para qualquer usuário logado.", good: "Definido: restrito ao perfil ADMIN." },
      { q: "Filtros e limites?", bad: "Chute da IA: permitiu exportar o banco inteiro sem filtro de data.", good: "Definido: filtro obrigatório por período com trava máxima de 90 dias." },
      { q: "Stack e padrões?", bad: "Chute da IA: usou biblioteca externa que não existe no projeto.", good: "Definido: Node/TypeScript + Prisma seguindo o padrão da API v1." },
      { q: "Critério de pronto (Testes)?", bad: "Chute da IA: entregou só o caminho feliz sem tratamento de erro.", good: "Definido: inclui validação de parâmetros e testes de borda." }
    ],
    vagueOutcome: `⚠️ <strong>Resultado:</strong> Código que funciona com 10 linhas no ambiente local, mas quebra em produção e exige horas de revisão.`,
    descriptiveOutcome: `✅ <strong>Resultado:</strong> Código seguro, performático e alinhado com a arquitetura logo na 1ª geração.`
  }
};

function setPromptScenario(scenario) {
  currentPromptScenario = scenario;
  document.getElementById("promptScenarioProduct").className =
    "tab-btn" + (scenario === "product" ? " active" : "");
  document.getElementById("promptScenarioDev").className =
    "tab-btn" + (scenario === "dev" ? " active" : "");
  renderPromptSlide();
}

function setPromptMode(mode) {
  currentPromptMode = mode;
  document.getElementById("promptModeVague").className =
    "tab-btn" + (mode === "vague" ? " active-danger" : "");
  document.getElementById("promptModeDescriptive").className =
    "tab-btn" + (mode === "descriptive" ? " active-success" : "");
  renderPromptSlide();
}

function renderPromptSlide() {
  const data = promptData[currentPromptScenario];
  const isVague = currentPromptMode === "vague";

  const badge = document.getElementById("promptGuessBadge");
  badge.className = "cache-status-pill " + (isVague ? "pill-red" : "pill-green");
  badge.textContent = isVague ? "5 Pontos Cegos (Chutes)" : "0 Pontos Cegos (Preciso)";

  document.getElementById("promptTextDisplay").innerHTML = isVague
    ? data.vaguePrompt
    : data.descriptivePrompt;

  const listEl = document.getElementById("blindSpotsList");
  listEl.innerHTML = data.blindSpots
    .map(
      (item) => `
      <div class="blind-spot-item ${isVague ? "" : "resolved"}">
        <span style="font-size: 1rem;">${isVague ? "🎲" : "✅"}</span>
        <div>
          <strong style="color: ${isVague ? "#fca5a5" : "#6ee7b7"};">${item.q}</strong><br/>
          <span style="color: var(--text-secondary);">${isVague ? item.bad : item.good}</span>
        </div>
      </div>
    `
    )
    .join("");

  document.getElementById("promptOutcomeBox").innerHTML = isVague
    ? data.vagueOutcome
    : data.descriptiveOutcome;
  fitSlidesToViewport();
}

// ============================================================================
// SLIDE 03 DATA: Instructions & Prefix Caching
// ============================================================================
function setCacheState(state) {
  document.getElementById("cacheStateTurn1").className =
    "tab-btn" + (state === "turn1" ? " active" : "");
  document.getElementById("cacheStateTurn2").className =
    "tab-btn" + (state === "turn2" ? " active-success" : "");
  document.getElementById("cacheStateBloated").className =
    "tab-btn" + (state === "bloated" ? " active-danger" : "");

  const stackEl = document.getElementById("cacheStackVisualizer");
  const metricsEl = document.getElementById("cacheMetricsRow");
  const titleEl = document.getElementById("cacheExplainTitle");
  const bodyEl = document.getElementById("cacheExplainBody");

  if (state === "turn1") {
    stackEl.innerHTML = `
      <div class="cache-block dynamic">
        <div>
          <strong>1. Topo Fixo: Sistema + Definições de Tools</strong>
          <div style="font-size: 0.78rem; color: var(--text-secondary);">Estrutura base do agente (~1.200 tokens)</div>
        </div>
        <span class="cache-status-pill pill-blue">Processando e Salvando Cache...</span>
      </div>
      <div class="cache-block dynamic">
        <div>
          <strong>2. Instructions Globais (<code>AGENTS.md</code>)</strong>
          <div style="font-size: 0.78rem; color: var(--text-secondary);">Regras do projeto, stack, idioma e padrões (~500 tokens)</div>
        </div>
        <span class="cache-status-pill pill-blue">Processando e Salvando Cache...</span>
      </div>
      <div class="cache-block dynamic">
        <div>
          <strong>3. Sua 1ª Mensagem no Chat</strong>
          <div style="font-size: 0.78rem; color: var(--text-secondary);">O pedido específico da tarefa (~150 tokens)</div>
        </div>
        <span class="cache-status-pill pill-blue">Novo (Processado)</span>
      </div>
    `;
    metricsEl.innerHTML = `
      <div class="metric-box">
        <div class="metric-value" style="color: #38bdf8;">0%</div>
        <div class="metric-label">Economia no 1º Turno</div>
      </div>
      <div class="metric-box">
        <div class="metric-value" style="color: #34d399;">Gravado</div>
        <div class="metric-label">Status do Prefixo</div>
      </div>
      <div class="metric-box">
        <div class="metric-value" style="color: var(--text-primary);">1.850 t</div>
        <div class="metric-label">Tokens Lidos</div>
      </div>
    `;
    titleEl.textContent = "1ª Mensagem: Preparando o Terreno";
    bodyEl.innerHTML = `
      <p>Na primeira mensagem da conversa, o modelo lê o topo fixo (Sistema + Tools + suas <strong>Instructions</strong>) e gera um <strong>hash de cache</strong> para esse prefixo.</p>
      <p style="margin-top: 10px;">Como as Instructions vêm antes do histórico do chat, elas ficam em uma posição privilegiada: <strong>tudo o que é estático no topo fica pronto para ser reaproveitado instantaneamente</strong> nas próximas interações.</p>
    `;
  } else if (state === "turn2") {
    stackEl.innerHTML = `
      <div class="cache-block cached">
        <div>
          <strong>1. Topo Fixo: Sistema + Definições de Tools</strong>
          <div style="font-size: 0.78rem; color: var(--text-secondary);">Idêntico ao turno anterior (~1.200 tokens)</div>
        </div>
        <span class="cache-status-pill pill-green">🟢 EM CACHE (-90% custo)</span>
      </div>
      <div class="cache-block cached">
        <div>
          <strong>2. Instructions Globais (<code>AGENTS.md</code>)</strong>
          <div style="font-size: 0.78rem; color: var(--text-secondary);">Idêntico ao turno anterior (~500 tokens)</div>
        </div>
        <span class="cache-status-pill pill-green">🟢 EM CACHE (-90% custo)</span>
      </div>
      <div class="cache-block dynamic">
        <div>
          <strong>3. Histórico Recente + Nova Mensagem</strong>
          <div style="font-size: 0.78rem; color: var(--text-secondary);">Apenas o final dinâmico precisa ser calculado do zero</div>
        </div>
        <span class="cache-status-pill pill-blue">Processamento Incremental</span>
      </div>
    `;
    metricsEl.innerHTML = `
      <div class="metric-box">
        <div class="metric-value" style="color: #34d399;">Até -90%</div>
        <div class="metric-label">Custo nos Tokens em Cache</div>
      </div>
      <div class="metric-box">
        <div class="metric-value" style="color: #34d399;">~2x a 4x</div>
        <div class="metric-label">Mais Rápido (Menor Latência)</div>
      </div>
      <div class="metric-box">
        <div class="metric-value" style="color: #38bdf8;">100%</div>
        <div class="metric-label">Consistência das Regras</div>
      </div>
    `;
    titleEl.textContent = "2ª+ Mensagem: O Poder do Prefix Caching!";
    bodyEl.innerHTML = `
      <p>A partir da segunda mensagem, o modelo reconhece que o topo do prompt não mudou. Ele <strong>pula o reprocessamento pesado</strong> das suas Instructions e lê direto da memória de cache!</p>
      <p style="margin-top: 10px;"><strong>Por que isso importa?</strong> Se você ficasse colando regras manualmente no meio da conversa, além de dar trabalho, você não aproveitaria o prefixo fixo. Com Instructions bem estruturadas no topo, o agente lembra das regras da empresa pagando uma fração mínima de tokens e respondendo muito mais rápido.</p>
    `;
  } else {
    stackEl.innerHTML = `
      <div class="cache-block bloated">
        <div>
          <strong>1. Mega-Arquivo de Instructions Inchado</strong>
          <div style="font-size: 0.78rem; color: #fca5a5;">Regras de 15 áreas diferentes, manuais inteiros e exceções raras (~25.000 tokens!)</div>
        </div>
        <span class="cache-status-pill pill-red">⚠️ Contexto Poluído</span>
      </div>
      <div class="cache-block bloated">
        <div>
          <strong>2. Efeito "Lost in the Middle" (Perda de Foco)</strong>
          <div style="font-size: 0.78rem; color: #fca5a5;">Regras de banco de dados misturadas com regras de design e RH</div>
        </div>
        <span class="cache-status-pill pill-red">⚠️ Atenção Diluída</span>
      </div>
      <div class="cache-block dynamic">
        <div>
          <strong>3. Sua Mensagem Simples</strong>
          <div style="font-size: 0.78rem; color: var(--text-secondary);">Sobrou menos espaço útil e a IA começa a ignorar instruções importantes</div>
        </div>
        <span class="cache-status-pill pill-red">Lento e Caro</span>
      </div>
    `;
    metricsEl.innerHTML = `
      <div class="metric-box">
        <div class="metric-value" style="color: #f87171;">25.000+</div>
        <div class="metric-label">Tokens Base em Todo Turno</div>
      </div>
      <div class="metric-box">
        <div class="metric-value" style="color: #f87171;">Baixa</div>
        <div class="metric-label">Atenção às Regras Reais</div>
      </div>
      <div class="metric-box">
        <div class="metric-value" style="color: #fbbf24;">Solução →</div>
        <div class="metric-label">Modularizar (Slide 04)</div>
      </div>
    `;
    titleEl.textContent = "A Armadilha: Colocar Tudo na Instruction Global";
    bodyEl.innerHTML = `
      <p>Mesmo com cache, colocar <strong>todos os manuais da empresa</strong> na Instruction global é um erro clássico.</p>
      <p style="margin-top: 10px;">Quanto maior o bloco de instruções fixas, mais a atenção do modelo se dilui entre regras que não têm nada a ver com a tarefa atual (fenômeno conhecido como <em>Context Rot / Lost in the Middle</em>). A solução é manter a raiz enxuta e <strong>modularizar o resto</strong>!</p>
    `;
  }
  fitSlidesToViewport();
}

// ============================================================================
// SLIDE 04 DATA: Modular Instructions by Folder
// ============================================================================
const folderData = {
  frontend: {
    title: "IA trabalhando em: <code>/src/frontend/</code>",
    savings: "83% menos tokens de instrução",
    badgeClass: "pill-green",
    tokensText: "750 / 4.500 tokens",
    rootWidth: "9%",
    scopedWidth: "8%",
    scopedColor: "var(--accent-modular)",
    legend: "🟣 <strong>Escopo /frontend (+350t):</strong> Ativado automaticamente",
    code: `# 1. Raiz Global (/AGENTS.md) — 400 tokens [🟢 EM CACHE]
- Projeto: Portal de Pedidos · Idioma: Português (PT-BR)
- Comandos globais: npm test | npm run build

# 2. Pasta Atual (/src/frontend/AGENTS.md) — 350 tokens [🟣 ATIVO AGORA]
applyTo: "src/frontend/**"
- Use componentes do Design System interno (@ui/core)
- Garanta acessibilidade (WCAG AA) e atributos aria-label
- Estado de tela deve usar React Query (nunca fetch direto)

# 🚫 Ignorados (0 tokens gastos): /backend, /tests, /docs`,
    takeaway: "✅ A IA recebe apenas a base global + as regras de interface. Ela não gasta nenhum token lendo regras de SQL ou templates de documentação."
  },
  backend: {
    title: "IA trabalhando em: <code>/src/backend/api/</code>",
    savings: "81% menos tokens de instrução",
    badgeClass: "pill-green",
    tokensText: "820 / 4.500 tokens",
    rootWidth: "9%",
    scopedWidth: "10%",
    scopedColor: "#38bdf8",
    legend: "🔵 <strong>Escopo /backend/api (+420t):</strong> Ativado automaticamente",
    code: `# 1. Raiz Global (/AGENTS.md) — 400 tokens [🟢 EM CACHE]
- Projeto: Portal de Pedidos · Idioma: Português (PT-BR)
- Comandos globais: npm test | npm run build

# 2. Pasta Atual (/src/backend/api/AGENTS.md) — 420 tokens [🔵 ATIVO AGORA]
applyTo: "src/backend/api/**"
- Toda rota deve validar payload com Zod antes do controller
- Nunca exponha dados sensíveis (CPF/tokens) nos logs de erro
- Use transações em operações que alterem mais de 1 tabela

# 🚫 Ignorados (0 tokens gastos): /frontend, /tests, /docs`,
    takeaway: "✅ Assim que a IA entra na pasta da API, as regras de segurança, validação e banco entram em cena — sem poluir com regras de CSS."
  },
  tests: {
    title: "IA trabalhando em: <code>/tests/e2e/</code>",
    savings: "84% menos tokens de instrução",
    badgeClass: "pill-green",
    tokensText: "700 / 4.500 tokens",
    rootWidth: "9%",
    scopedWidth: "7%",
    scopedColor: "#34d399",
    legend: "🟢 <strong>Escopo /tests/e2e (+300t):</strong> Ativado automaticamente",
    code: `# 1. Raiz Global (/AGENTS.md) — 400 tokens [🟢 EM CACHE]
- Projeto: Portal de Pedidos · Idioma: Português (PT-BR)

# 2. Pasta Atual (/tests/e2e/AGENTS.md) — 300 tokens [🟢 ATIVO AGORA]
applyTo: "tests/e2e/**/*.spec.ts"
- Use seletores semânticos (getByRole, getByLabel) em vez de classes CSS
- Cada teste deve ser independente e criar seus próprios dados (seed)
- Cubra sempre o cenário de sucesso + erro de validação 400

# 🚫 Ignorados (0 tokens gastos): /frontend, /backend, /docs`,
    takeaway: "✅ Perfeito para QA e automação: quando a IA cria ou corrige testes, ela segue rigorosamente o padrão de qualidade daquela pasta."
  },
  docs: {
    title: "IA trabalhando em: <code>/docs/produto/</code>",
    savings: "85% menos tokens de instrução",
    badgeClass: "pill-green",
    tokensText: "680 / 4.500 tokens",
    rootWidth: "9%",
    scopedWidth: "6%",
    scopedColor: "#fbbf24",
    legend: "🟡 <strong>Escopo /docs/produto (+280t):</strong> Ativado automaticamente",
    code: `# 1. Raiz Global (/AGENTS.md) — 400 tokens [🟢 EM CACHE]
- Projeto: Portal de Pedidos · Idioma: Português (PT-BR)

# 2. Pasta Atual (/docs/produto/AGENTS.md) — 280 tokens [🟡 ATIVO AGORA]
applyTo: "docs/produto/**/*.md"
- Linguagem voltada para Produto e Negócio (evite detalhes de código)
- Toda especificação deve conter: Contexto, Critérios de Aceite (Gherkin) e Métricas de Sucesso

# 🚫 Ignorados (0 tokens gastos): /frontend, /backend, /tests`,
    takeaway: "✅ Quando um PM ou analista usa o agente na pasta de documentação, a IA adota automaticamente o formato de negócio da empresa."
  },
  monolith: {
    title: "⚠️ Anti-Padrão: Tudo em 1 Arquivo Único na Raiz",
    savings: "100% do custo em toda mensagem!",
    badgeClass: "pill-red",
    tokensText: "4.500 / 4.500 tokens",
    rootWidth: "100%",
    scopedWidth: "0%",
    scopedColor: "#ef4444",
    legend: "🔴 <strong>Monolito Global (4.500t):</strong> Carrega regras de todas as áreas sem necessidade",
    code: `# /AGENTS.md Monolítico — 4.500 tokens carregados SEMPRE:
- Regras Gerais + Regras de React/CSS + Regras de Banco/SQL
- + Regras de Testes E2E + Regras de Infra/Docker
- + Templates de Produto + Regras de RH + Legado de 2022...

⚠️ Resultado: Mesmo para mudar 1 linha de texto na documentação,
a IA precisa ler milhares de tokens de regras de banco de dados e CSS!`,
    takeaway: "❌ Sem modularização por pasta, você desperdiça janela de contexto e confunde o modelo com regras contraditórias de outros módulos."
  }
};

function selectFolder(folderKey) {
  ["frontend", "backend", "tests", "docs", "monolith"].forEach((k) => {
    const btn = document.getElementById("folder-" + k);
    if (btn) {
      btn.classList.toggle("active", k === folderKey);
    }
  });

  const d = folderData[folderKey];
  document.getElementById("folderTitleDisplay").innerHTML = d.title;

  const badge = document.getElementById("folderSavingsBadge");
  badge.className = "cache-status-pill " + d.badgeClass;
  badge.textContent = d.savings;

  document.getElementById("folderTokenCountText").textContent = d.tokensText;

  const meterRoot = document.getElementById("meterRoot");
  const meterScoped = document.getElementById("meterScoped");
  meterRoot.style.width = d.rootWidth;
  meterRoot.style.background =
    folderKey === "monolith" ? "var(--accent-danger)" : "var(--accent-cache)";
  meterScoped.style.width = d.scopedWidth;
  meterScoped.style.background = d.scopedColor;

  document.getElementById("meterLegendScoped").innerHTML = d.legend;
  document.getElementById("folderCodePreview").textContent = d.code;
  document.getElementById("folderTakeawayText").textContent = d.takeaway;
  fitSlidesToViewport();
}

// ============================================================================
// SLIDE 05 DATA: Tools (Saving Tokens & Reusability)
// ============================================================================
const toolCases = {
  logs: {
    noToolTitle: "❌ Sem Tool (Tudo 'No Braço' no Prompt)",
    withToolTitle: "✅ Com Tool (Execução Determinística + Reuso)",
    noToolTokens: "~18.500 tokens",
    withToolTokens: "~240 tokens (-98%)",
    noToolDesc: "Você copia 5.000 linhas de log ou planilha e cola direto no chat pedindo para a IA encontrar os erros.",
    withToolDesc: "A IA chama uma Tool que filtra o arquivo via código em 20ms e devolve apenas o resumo exato dos erros.",
    noToolSteps: [
      { label: "1. Colar 5.000 linhas brutas na janela de contexto", badge: "+18.000 tokens", color: "#f87171" },
      { label: "2. IA tenta 'contar e filtrar' linha por linha no olho", badge: "Lento (15s+)", color: "#f87171" },
      { label: "3. Na semana seguinte, outro colega precisa fazer tudo de novo", badge: "Zero Reuso", color: "#f87171" }
    ],
    withToolSteps: [
      { label: "1. IA chama tool: filtrar_erros_log(periodo='hoje')", badge: "35 tokens", color: "#34d399" },
      { label: "2. Script filtra as 5.000 linhas fora do modelo com 100% de precisão", badge: "Execução < 50ms", color: "#34d399" },
      { label: "3. Tool devolve apenas os 12 erros agrupados para a IA analisar", badge: "+205 tokens", color: "#34d399" }
    ],
    noToolVerdict: "❌ Alto gasto de tokens, risco da IA pular linhas no meio do arquivo e nenhum reaproveitamento.",
    withToolVerdict: "✅ Poupa 98% dos tokens, contagem 100% exata e a Tool fica pronta para qualquer pessoa ou agente reutilizar."
  },
  sprint: {
    noToolTitle: "❌ Sem Tool (Colando JSON Bruto no Chat)",
    withToolTitle: "✅ Com Tool (Consulta Limpa via Integração)",
    noToolTokens: "~9.200 tokens",
    withToolTokens: "~310 tokens (-96%)",
    noToolDesc: "Exportar JSON/HTML gigante do Jira ou GitHub e colar no prompt para descobrir quais tarefas estão sem revisão.",
    withToolDesc: "Usar uma Tool (ex: via MCP ou script da equipe) que consulta a API já filtrando apenas os itens pendentes.",
    noToolSteps: [
      { label: "1. Exportar e colar dezenas de páginas de dados brutos", badge: "+9.000 tokens", color: "#f87171" },
      { label: "2. Contexto fica cheio de campos inúteis (IDs, avatares, metadados)", badge: "Ruído Alto", color: "#f87171" },
      { label: "3. Processo manual que depende de cada pessoa lembrar como filtrar", badge: "Trabalho Manual", color: "#f87171" }
    ],
    withToolSteps: [
      { label: "1. IA aciona a Tool: buscar_pendencias_sprint(time='checkout')", badge: "40 tokens", color: "#34d399" },
      { label: "2. A integração busca na fonte oficial e limpa os campos inúteis", badge: "Padronizado", color: "#34d399" },
      { label: "3. IA recebe só a lista enxuta dos 5 itens que precisam de ação", badge: "+270 tokens", color: "#34d399" }
    ],
    noToolVerdict: "❌ Polui a memória da conversa com dados brutos que não servem para mais nada.",
    withToolVerdict: "✅ Conecta a IA aos dados reais em tempo real, gastando o mínimo possível de tokens."
  },
  calc: {
    noToolTitle: "❌ Sem Tool (Fazendo Conta no Texto)",
    withToolTitle: "✅ Com Tool (Cálculo Determinístico Certificado)",
    noToolTokens: "~4.800 tokens + Risco",
    withToolTokens: "~180 tokens (100% Exato)",
    noToolDesc: "Pedir para o modelo calcular impostos, juros compostos ou validar 200 registros usando apenas texto preditivo.",
    withToolDesc: "A IA extrai os parâmetros da conversa e chama uma Tool de cálculo/validação determinística já testada.",
    noToolSteps: [
      { label: "1. Explicar todas as fórmulas complexas no texto do prompt", badge: "+1.500 tokens", color: "#f87171" },
      { label: "2. Modelo gasta milhares de tokens de raciocínio fazendo conta no papel", badge: "+3.300 tokens", color: "#f87171" },
      { label: "3. Risco de arredondamento errado ou alucinação aritmética", badge: "Impreciso", color: "#f87171" }
    ],
    withToolSteps: [
      { label: "1. IA identifica os valores e chama: simular_calculo(valor, regra)", badge: "45 tokens", color: "#34d399" },
      { label: "2. Código oficial da empresa executa a regra de negócio exata", badge: "Zero Alucinação", color: "#34d399" },
      { label: "3. IA apenas explica o resultado certificado para o usuário", badge: "+135 tokens", color: "#34d399" }
    ],
    noToolVerdict: "❌ Modelos de linguagem preveem palavras — não foram feitos para substituir calculadoras ou validadores no braço.",
    withToolVerdict: "✅ Você combina o melhor dos dois mundos: a IA entende o pedido humano e a Tool garante a matemática exata."
  },
  code: {
    isCodeView: true,
    noToolTitle: "📄 1. O Arquivo da Tool (mcp-server/filtrar-logs.ts)",
    withToolTitle: "⚡ 2. Como a IA Chama e Usa na Prática",
    noToolTokens: "Definição no Topo (🟢 Em Cache)",
    withToolTokens: "Execução Determinística",
    noToolDesc: "A IA conhece apenas a assinatura da Tool (nome + parâmetros). O código pesado roda fora do modelo:",
    withToolDesc: "Veja o que acontece por trás dos panos quando você faz a pergunta no chat:",
    leftCode: `// 📁 mcp-server/tools/filtrar-logs.ts
export const filtrarErrosLogTool = {
  name: "filtrar_erros_log",
  description: "Filtra arquivos grandes de log e retorna apenas a contagem e resumo de erros.",
  parameters: {
    servico: { type: "string", description: "Ex: checkout, auth" },
    nivel:   { type: "string", enum: ["ERROR", "WARN"] }
  },
  // 👇 Roda FORA da IA (0 tokens gastos para ler as 5.000 linhas!)
  async execute({ servico, nivel }) {
    const linhas = fs.readFileSync(\`/logs/\${servico}.log\`, "utf8").split("\\n");
    const erros = linhas.filter((l) => l.includes(\`[\${nivel}]\`));
    return {
      totalLinhasAnalisadas: linhas.length,
      totalErrosEncontrados: erros.length,
      amostra: erros.slice(0, 5) // Devolve só o resumo enxuto!
    };
  }
};`,
    rightCode: `👤 1. Usuário pergunta no chat:
"Tivemos erros graves no serviço de checkout hoje?"

🤖 2. IA decide chamar a Tool (gasta só ~35 tokens):
tool_call: filtrar_erros_log({
  "servico": "checkout",
  "nivel": "ERROR"
})

📥 3. Retorno da Tool para a janela de contexto (~180 tokens):
{
  "totalLinhasAnalisadas": 5420,
  "totalErrosEncontrados": 12,
  "amostra": ["[ERROR] Timeout gateway pagamento (12 ocorrências)"]
}

💬 4. Resposta final da IA:
"Sim! Analisei as 5.420 linhas do log de checkout e encontrei
exatamente 12 erros, todos causados por timeout no gateway."`,
    noToolVerdict: "💡 Só o cabeçalho (name + description + parameters) fica no contexto inicial (e entra no Prefix Cache!).",
    withToolVerdict: "✅ As 5.420 linhas brutas nunca entraram no prompt — a IA recebeu apenas 6 linhas JSON mastigadas!"
  }
};

function setToolCase(caseKey) {
  ["logs", "sprint", "calc", "code"].forEach((k) => {
    const id = "toolCase" + k.charAt(0).toUpperCase() + k.slice(1);
    const btn = document.getElementById(id);
    if (btn) btn.className = "tab-btn" + (k === caseKey ? " active" : "");
  });

  const c = toolCases[caseKey];
  const noCard = document.getElementById("noToolCard");
  const noTitle = document.getElementById("noToolTitle");
  const noBadge = document.getElementById("noToolTokenBadge");

  noTitle.textContent = c.noToolTitle;
  document.getElementById("withToolTitle").textContent = c.withToolTitle;
  noBadge.textContent = c.noToolTokens;
  document.getElementById("withToolTokenBadge").textContent = c.withToolTokens;
  document.getElementById("noToolDesc").textContent = c.noToolDesc;
  document.getElementById("withToolDesc").textContent = c.withToolDesc;

  if (c.isCodeView) {
    noCard.style.borderTopColor = "var(--accent-prompt)";
    noTitle.style.color = "#38bdf8";
    noBadge.className = "cache-status-pill pill-blue";
    document.getElementById("noToolSteps").innerHTML = `<div class="code-preview" style="font-size:0.76rem;line-height:1.5;"></div>`;
    document.getElementById("noToolSteps").firstChild.textContent = c.leftCode;

    document.getElementById("withToolSteps").innerHTML = `<div class="code-preview" style="font-size:0.76rem;line-height:1.5;"></div>`;
    document.getElementById("withToolSteps").firstChild.textContent = c.rightCode;
  } else {
    noCard.style.borderTopColor = "var(--accent-danger)";
    noTitle.style.color = "#f87171";
    noBadge.className = "cache-status-pill pill-red";
    document.getElementById("noToolSteps").innerHTML = c.noToolSteps
      .map(
        (s) => `
        <div class="flow-step">
          <span>${s.label}</span>
          <strong style="color: ${s.color}; font-family: var(--font-mono); font-size: 0.76rem;">${s.badge}</strong>
        </div>
      `
      )
      .join("");

    document.getElementById("withToolSteps").innerHTML = c.withToolSteps
      .map(
        (s) => `
        <div class="flow-step">
          <span>${s.label}</span>
          <strong style="color: ${s.color}; font-family: var(--font-mono); font-size: 0.76rem;">${s.badge}</strong>
        </div>
      `
      )
      .join("");
  }

  document.getElementById("noToolVerdict").textContent = c.noToolVerdict;
  document.getElementById("withToolVerdict").textContent = c.withToolVerdict;
  fitSlidesToViewport();
}

// ============================================================================
// SLIDE 06 DATA: Skills (Token Usage & Avoiding File-by-File Exploration)
// ============================================================================
const skillCases = {
  explore: {
    noSkillTitle: "❌ Sem Skill (Agente Lendo Arquivo por Arquivo)",
    noSkillTokens: "~9.400 tokens gastos",
    withSkillTitle: "✅ Com Skill (Mapa Direto + Script Pronto)",
    withSkillTokens: "~520 tokens (-94%)",
    noSkillDesc: "Você pede: 'Consulte os pedidos com falha no módulo de ordens'. O agente principal não sabe como o projeto funciona e sai vasculhando:",
    withSkillDesc: "A Skill já ensina o atalho exato. O agente lê o SKILL.md sob demanda e executa de primeira sem abrir arquivos à toa:",
    noSkillSteps: [
      { label: "1. Lista pastas e lê config/build (pom.xml / package.json) para entender a stack", badge: "+2.100 tokens", color: "#f87171" },
      { label: "2. Abre schema.sql, migrations e 5 classes para descobrir onde ficam os pedidos", badge: "+4.800 tokens", color: "#f87171" },
      { label: "3. Tenta rodar um comando no chute, recebe erro de sintaxe e lê mais arquivos", badge: "+2.500 tokens", color: "#f87171" }
    ],
    withSkillSteps: [
      { label: "1. No início do chat, a IA só leu 1 linha do índice: 'consultar-pedidos'", badge: "30 tokens (Cache)", color: "#34d399" },
      { label: "2. Ao ver seu pedido, a IA abre o arquivo SKILL.md com a receita exata", badge: "+310 tokens", color: "#22d3ee" },
      { label: "3. Executa o comando/script oficial de primeira (zero arquivos abertos à toa!)", badge: "+180 tokens", color: "#34d399" }
    ],
    noSkillVerdict: "❌ O agente principal gastou 9.400 tokens na sua conversa só para 'descobrir como o projeto funciona'.",
    withSkillVerdict: "✅ A Skill eliminou a exploração às cegas: o agente não precisou ler arquivo por arquivo e economizou 94% dos tokens!"
  },
  catalog: {
    noSkillTitle: "❌ 15 Manuais Jogados nas Instructions Globais",
    noSkillTokens: "12.000 tokens em TODO chat",
    withSkillTitle: "✅ 15 Skills com Revelação Progressiva",
    withSkillTokens: "450t base + 320t da Skill usada",
    noSkillDesc: "Se você colocar os 15 procedimentos da equipe direto no arquivo de Instructions para a IA 'saber tudo':",
    withSkillDesc: "Transformando cada procedimento em uma Skill separada (arquivos SKILL.md independentes):",
    noSkillSteps: [
      { label: "1. Carrega manual de Deploy + Banco + UI + QA + Release em toda conversa", badge: "12.000 tokens", color: "#f87171" },
      { label: "2. Você faz uma pergunta simples e já paga o peso de 14 manuais inúteis", badge: "Contexto Cheio", color: "#f87171" },
      { label: "3. Instruções demais misturadas fazem a IA confundir regras", badge: "Perda de Foco", color: "#f87171" }
    ],
    withSkillSteps: [
      { label: "1. Catálogo inicial: IA lê só nome + descrição curta das 15 Skills (15 × 30t)", badge: "450 tokens (Cache)", color: "#34d399" },
      { label: "2. As 14 Skills que não têm relação com a tarefa continuam fechadas", badge: "0 tokens gastos", color: "#34d399" },
      { label: "3. Apenas a Skill necessária para o pedido atual é carregada no contexto", badge: "+320 tokens", color: "#22d3ee" }
    ],
    noSkillVerdict: "❌ Escalar conhecimento colocando tudo nas Instructions estoura a janela de contexto rapidamente.",
    withSkillVerdict: "✅ Com Skills você pode ter 20, 50 ou 100 playbooks no projeto sem engordar o contexto inicial!"
  },
  pattern: {
    noSkillTitle: "❌ Sem Skill (IA Tentando Adivinhar o Padrão do Time)",
    noSkillTokens: "~6.800 tokens + Retrabalho",
    withSkillTitle: "✅ Com Skill (Template + Checklist Oficial)",
    withSkillTokens: "~410 tokens (-93%)",
    noSkillDesc: "Você pede: 'Crie uma nova rota/história seguindo o nosso padrão'. Sem Skill, a IA tenta deduzir o padrão olhando o passado:",
    withSkillDesc: "A Skill já empacota o template oficial e o checklist de validação que o time definiu:",
    noSkillSteps: [
      { label: "1. IA abre 6 arquivos antigos do projeto para 'tentar imitar' o estilo", badge: "+4.600 tokens", color: "#f87171" },
      { label: "2. Acaba copiando um código legado antigo que não é mais o padrão atual", badge: "Padrão Errado", color: "#f87171" },
      { label: "3. Você precisa corrigir manualmente no chat gastando mais turnos", badge: "+2.200 tokens", color: "#f87171" }
    ],
    withSkillSteps: [
      { label: "1. IA identifica a intenção e abre a Skill 'criar-endpoint-padrao'", badge: "+290 tokens", color: "#22d3ee" },
      { label: "2. Segue o template atualizado sem precisar ler arquivos antigos no escuro", badge: "Zero Adivinhação", color: "#34d399" },
      { label: "3. Entrega no formato exato do time logo na primeira tentativa", badge: "+120 tokens", color: "#34d399" }
    ],
    noSkillVerdict: "❌ Deixar a IA deduzir padrões lendo arquivos antigos gasta milhares de tokens e perpetua código legado.",
    withSkillVerdict: "✅ A Skill garante que qualquer pessoa do time gere entregas padronizadas gastando o mínimo de tokens."
  },
  code: {
    isCodeView: true,
    noSkillTitle: "📄 1. O Arquivo da Skill (.agents/skills/consultar-pedidos/SKILL.md)",
    withSkillTitle: "⚡ 2. Como a Skill É Chamada e Usada na Prática",
    noSkillTokens: "Topo: 30t | Corpo: ~280t",
    withSkillTokens: "Revelação Progressiva",
    noSkillDesc: "Veja a estrutura real do arquivo SKILL.md no repositório (YAML no topo + receita em Markdown):",
    withSkillDesc: "Veja como o agente descobre, carrega sob demanda e executa a Skill na mesma conversa:",
    leftCode: `---
# 👇 SÓ ESTAS 2 LINHAS (~30 tokens) entram no início do chat!
name: consultar-pedidos
description: >
  Use quando precisar consultar pedidos, status de pagamento
  ou falhas de processamento no banco de ordens.
---

# Manual da Skill: Consultar Pedidos
Não abra os arquivos Java/SQL para descobrir o schema.
Use diretamente o script oficial já preparado na pasta desta Skill:

## Como Executar
1. Para listar pedidos com falha:
   \`./.agents/skills/consultar-pedidos/scripts/query.sh --status FAILED\`
2. Para buscar um pedido específico:
   \`./.agents/skills/consultar-pedidos/scripts/query.sh --id <ORDER_ID>\`

## Formato de Saída
Sempre apresente o resultado em tabela com: ID, Cliente, Valor e Motivo.`,
    rightCode: `🟢 1. No início da conversa (Catálogo em Cache — ~30 tokens):
skills_disponiveis:
  - consultar-pedidos: "Use quando precisar consultar pedidos..."

👤 2. Usuário pede no chat:
"Quais pedidos falharam hoje e qual o motivo?"

📘 3. Agente vê que a descrição bate e abre o SKILL.md (+280 tokens):
call: read_file(".agents/skills/consultar-pedidos/SKILL.md")

🛠️ 4. Agente segue a receita direto (sem vasculhar pastas!):
call: run_command("./.agents/skills/consultar-pedidos/scripts/query.sh --status FAILED")
// Retorno: 3 pedidos com erro de cartão expirado

💬 5. Resposta na mesma conversa (em tabela conforme a Skill pediu):
"| ID #902 | Maria S. | R$ 240 | Cartão Expirado | ..."`,
    noSkillVerdict: "💡 O YAML no topo (name + description) é o 'índice' de 30 tokens. O resto do arquivo fica fechado até precisar!",
    withSkillVerdict: "✅ Quando ativada, a Skill entra na conversa atual e dá o comando pronto — zero arquivos abertos no chute!"
  }
};

function setSkillCase(caseKey) {
  ["explore", "catalog", "pattern", "code"].forEach((k) => {
    const id = "skillCase" + k.charAt(0).toUpperCase() + k.slice(1);
    const btn = document.getElementById(id);
    if (btn) btn.className = "tab-btn" + (k === caseKey ? " active" : "");
  });

  const c = skillCases[caseKey];
  const noCard = document.getElementById("noSkillCard");
  const noTitle = document.getElementById("noSkillTitle");
  const noBadge = document.getElementById("noSkillTokenBadge");

  noTitle.textContent = c.noSkillTitle;
  document.getElementById("withSkillTitle").textContent = c.withSkillTitle;
  noBadge.textContent = c.noSkillTokens;
  document.getElementById("withSkillTokenBadge").textContent = c.withSkillTokens;
  document.getElementById("noSkillDesc").textContent = c.noSkillDesc;
  document.getElementById("withSkillDesc").textContent = c.withSkillDesc;

  if (c.isCodeView) {
    noCard.style.borderTopColor = "var(--accent-skill)";
    noTitle.style.color = "#22d3ee";
    noBadge.className = "cache-status-pill pill-blue";
    document.getElementById("noSkillSteps").innerHTML = `<div class="code-preview" style="font-size:0.75rem;line-height:1.48;"></div>`;
    document.getElementById("noSkillSteps").firstChild.textContent = c.leftCode;

    document.getElementById("withSkillSteps").innerHTML = `<div class="code-preview" style="font-size:0.75rem;line-height:1.48;"></div>`;
    document.getElementById("withSkillSteps").firstChild.textContent = c.rightCode;
  } else {
    noCard.style.borderTopColor = "var(--accent-danger)";
    noTitle.style.color = "#f87171";
    noBadge.className = "cache-status-pill pill-red";
    document.getElementById("noSkillSteps").innerHTML = c.noSkillSteps
      .map(
        (s) => `
        <div class="flow-step">
          <span>${s.label}</span>
          <strong style="color: ${s.color}; font-family: var(--font-mono); font-size: 0.76rem;">${s.badge}</strong>
        </div>
      `
      )
      .join("");

    document.getElementById("withSkillSteps").innerHTML = c.withSkillSteps
      .map(
        (s) => `
        <div class="flow-step">
          <span>${s.label}</span>
          <strong style="color: ${s.color}; font-family: var(--font-mono); font-size: 0.76rem;">${s.badge}</strong>
        </div>
      `
      )
      .join("");
  }

  document.getElementById("noSkillVerdict").textContent = c.noSkillVerdict;
  document.getElementById("withSkillVerdict").textContent = c.withSkillVerdict;
  fitSlidesToViewport();
}

// ============================================================================
// SLIDE 07 DATA: Subagents (Isolated Context & Heavy Exploration)
// ============================================================================
const subagentCases = {
  investigate: {
    noSubTitle: "❌ Sem Subagent (Tudo na Conversa Principal)",
    noSubTokens: "+14.000t na sua janela!",
    withSubTitle: "✅ Com Subagent (Janela Isolada + Resumo)",
    withSubTokens: "Só +220t na principal (-98%)",
    noSubDesc: "Você pede: 'Descubra por que o cálculo de frete dá diferença em pedidos parcelados'. Não há receita pronta; a IA precisa investigar:",
    withSubDesc: "O agente principal delega a investigação para um Subagent em outra sala, protegendo a memória da sua conversa:",
    noSubSteps: [
      { label: "1. Agente principal abre 35 arquivos de código e testes procurando a regra", badge: "+11.200 tokens", color: "#f87171" },
      { label: "2. Lê logs de erro e histórico de commits direto na sua conversa", badge: "+2.800 tokens", color: "#f87171" },
      { label: "3. Todo esse lixo intermediário fica preso no seu chat para os próximos turnos!", badge: "Chat Poluído", color: "#f87171" }
    ],
    withSubSteps: [
      { label: "1. Agente principal aciona Subagent: 'Ache a causa raiz do frete parcelado'", badge: "80 tokens", color: "#38bdf8" },
      { label: "2. Subagent lê os 35 arquivos na JANELA ISOLADA DELE (descartada ao final)", badge: "14.000t isolados", color: "#f472b6" },
      { label: "3. Subagent devolve só o achado exato: 'Arquivo Checkout.ts, linha 142 (arredondamento)'", badge: "+220t na principal", color: "#34d399" }
    ],
    noSubVerdict: "❌ Sua conversa principal fica pesada, cara e lenta porque carregou 35 arquivos que não serão mais usados.",
    withSubVerdict: "✅ O Subagent fez o trabalho pesado em outra sala e trouxe apenas as 5 linhas de resposta que importavam!"
  },
  parallel: {
    noSubTitle: "❌ Sem Subagent (Sequencial e Misturado)",
    noSubTokens: "+18.500t misturados · Lento",
    withSubTitle: "✅ Com 3 Subagents em Paralelo",
    withSubTokens: "3x mais rápido · Foco isolado",
    noSubDesc: "Você quer revisar um módulo inteiro antes do lançamento avaliando Segurança, Performance e Cobertura de Testes:",
    withSubDesc: "O agente principal dispara 3 Subagents especialistas simultaneamente, cada um com sua própria janela limpa:",
    noSubSteps: [
      { label: "1. Analisa Segurança, depois Performance, depois Testes na mesma janela", badge: "+18.500 tokens", color: "#f87171" },
      { label: "2. Demora o triplo do tempo porque faz uma checagem depois da outra", badge: "Sequencial", color: "#f87171" },
      { label: "3. Mistura alertas de SQL com regras de UI e acaba esquecendo pontos críticos", badge: "Atenção Diluída", color: "#f87171" }
    ],
    withSubSteps: [
      { label: "1. Dispara Subagent A (Segurança), Subagent B (Performance) e Subagent C (QA)", badge: "Em Paralelo ⚡", color: "#38bdf8" },
      { label: "2. Cada especialista analisa o código com 100% de foco na sua janela isolada", badge: "Zero Distração", color: "#f472b6" },
      { label: "3. Agente principal recebe apenas os 3 resumos executivos e monta o parecer", badge: "+650t na principal", color: "#34d399" }
    ],
    noSubVerdict: "❌ Fazer múltiplas auditorias pesadas na mesma conversa estoura o contexto e reduz a qualidade da revisão.",
    withSubVerdict: "✅ Com Subagents você ganha velocidade (execução paralela) e qualidade (cada especialista focado em 1 tema)."
  },
  safety: {
    noSubTitle: "❌ Agente Único Fazendo Pesquisa e Edição",
    noSubTokens: "Modelo Caro + Risco de Edição",
    withSubTitle: "✅ Subagent com Permissão e Modelo Sob Medida",
    withSubTokens: "Read-Only + Modelo Econômico",
    noSubDesc: "Usar o agente principal (com modelo pesado e permissão total de escrita) apenas para explorar arquivos e tirar dúvidas:",
    withSubDesc: "Configurar um Subagent Explorador somente-leitura e com modelo rápido/econômico:",
    noSubSteps: [
      { label: "1. Agente principal tem permissão de alterar arquivos e rodar comandos destrutivos", badge: "Risco Desnecessário", color: "#f87171" },
      { label: "2. Gasta tokens do modelo mais caro (Pro/Opus) só para listar e ler pastas", badge: "Custo Elevado", color: "#f87171" },
      { label: "3. Acumula buscas exploratórias junto com a tomada de decisão", badge: "Sem Separação", color: "#f87171" }
    ],
    withSubSteps: [
      { label: "1. Subagent Pesquisador configurado apenas com tools de leitura (Read-Only)", badge: "100% Seguro 🔒", color: "#34d399" },
      { label: "2. Pode rodar em um modelo rápido/leve (Flash) para varrer arquivos rapidamente", badge: "Muito Mais Barato", color: "#38bdf8" },
      { label: "3. Devolve o contexto mastigado para o agente principal decidir o que fazer", badge: "Arquitetura Limpa", color: "#f472b6" }
    ],
    noSubVerdict: "❌ Nem toda subtarefa precisa das mesmas permissões ou do modelo mais caro do sistema.",
    withSubVerdict: "✅ Subagents permitem isolar não só o contexto (tokens), mas também permissões de segurança e custo de modelo!"
  },
  code: {
    isCodeView: true,
    noSubTitle: "📄 1. O Arquivo do Subagent (.agents/subagents/investigador.md)",
    withSubTitle: "⚡ 2. Como É Delegado e o Que Volta pro Chat Principal",
    noSubTokens: "Permissões + Modelo + Prompt",
    withSubTokens: "Janela 100% Isolada",
    noSubDesc: "Veja como um Subagent é definido (incluindo modelo próprio e restrição de ferramentas somente-leitura):",
    withSubDesc: "Veja a chamada de delegação e como os 14.000 tokens de busca ficam isolados fora da conversa principal:",
    leftCode: `---
# 📁 .agents/subagents/investigador.md (ou .github/agents/)
name: investigador-codigo
description: >
  Especialista em vasculhar múltiplos arquivos para encontrar
  causa raiz de bugs e mapear fluxos sem poluir o chat principal.
model: gemini-flash          # ⚡ Modelo rápido e econômico
tools:                       # 🔒 Somente leitura (não edita arquivos!)
  - read_file
  - grep_search
  - find_by_name
---

Você é um Subagent de investigação técnica.
1. Faça todas as buscas e leituras de arquivos necessárias na sua janela.
2. NÃO retorne arquivos inteiros para o agente principal.
3. Retorne APENAS um resumo direto com:
   - Arquivo(s) e linha(s) exatas encontradas
   - Causa raiz explicada em no máximo 5 linhas.`,
    rightCode: `👤 1. Usuário pergunta no chat principal:
"Descubra onde o cálculo de frete parcelado está arredondando errado."

🤖 2. Agente Principal delega para o Subagent (~80 tokens):
invoke_subagent({
  name: "investigador-codigo",
  prompt: "Localize onde o frete parcelado é calculado e a causa do erro."
})

🚪 3. [SALA ISOLADA DO SUBAGENT — 14.000 tokens gastos lá dentro]:
  -> grep_search("frete") -> abre 18 arquivos -> lê CheckoutService.ts
  -> acha o bug na linha 142 -> [Sala do Subagent é encerrada e descartada!]

📥 4. Único texto que entra na conversa principal (+190 tokens):
"Encontrado em src/services/CheckoutService.ts (linha 142):
usa Math.floor() antes de dividir pelas parcelas. Sugestão: arredondar
apenas no centavo final."`,
    noSubVerdict: "💡 Note que o Subagent tem seu próprio model, lista restrita de tools e instruções próprias!",
    withSubVerdict: "✅ Os 18 arquivos abertos morreram na sala do Subagent. O chat principal só recebeu 4 linhas limpas!"
  }
};

function setSubagentCase(caseKey) {
  ["investigate", "parallel", "safety", "code"].forEach((k) => {
    const id = "subagentCase" + k.charAt(0).toUpperCase() + k.slice(1);
    const btn = document.getElementById(id);
    if (btn) btn.className = "tab-btn" + (k === caseKey ? " active" : "");
  });

  const c = subagentCases[caseKey];
  const noCard = document.getElementById("noSubagentCard");
  const noTitle = document.getElementById("noSubagentTitle");
  const noBadge = document.getElementById("noSubagentTokenBadge");

  noTitle.textContent = c.noSubTitle;
  document.getElementById("withSubagentTitle").textContent = c.withSubTitle;
  noBadge.textContent = c.noSubTokens;
  document.getElementById("withSubagentTokenBadge").textContent = c.withSubTokens;
  document.getElementById("noSubagentDesc").textContent = c.noSubDesc;
  document.getElementById("withSubagentDesc").textContent = c.withSubDesc;

  if (c.isCodeView) {
    noCard.style.borderTopColor = "var(--accent-subagent)";
    noTitle.style.color = "#f472b6";
    noBadge.className = "cache-status-pill pill-blue";
    document.getElementById("noSubagentSteps").innerHTML = `<div class="code-preview" style="font-size:0.75rem;line-height:1.48;"></div>`;
    document.getElementById("noSubagentSteps").firstChild.textContent = c.leftCode;

    document.getElementById("withSubagentSteps").innerHTML = `<div class="code-preview" style="font-size:0.75rem;line-height:1.48;"></div>`;
    document.getElementById("withSubagentSteps").firstChild.textContent = c.rightCode;
  } else {
    noCard.style.borderTopColor = "var(--accent-danger)";
    noTitle.style.color = "#f87171";
    noBadge.className = "cache-status-pill pill-red";
    document.getElementById("noSubagentSteps").innerHTML = c.noSubSteps
      .map(
        (s) => `
        <div class="flow-step">
          <span>${s.label}</span>
          <strong style="color: ${s.color}; font-family: var(--font-mono); font-size: 0.76rem;">${s.badge}</strong>
        </div>
      `
      )
      .join("");

    document.getElementById("withSubagentSteps").innerHTML = c.withSubSteps
      .map(
        (s) => `
        <div class="flow-step">
          <span>${s.label}</span>
          <strong style="color: ${s.color}; font-family: var(--font-mono); font-size: 0.76rem;">${s.badge}</strong>
        </div>
      `
      )
      .join("");
  }

  document.getElementById("noSubagentVerdict").textContent = c.noSubVerdict;
  document.getElementById("withSubagentVerdict").textContent = c.withSubVerdict;
  fitSlidesToViewport();
}

// ============================================================================
// SLIDE 07 DATA: Skills vs Subagents Context Simulator
// ============================================================================
function setDuelSim(mode) {
  document.getElementById("simBtnSkill").className =
    "tab-btn" + (mode === "skill" ? " active" : "");
  document.getElementById("simBtnSubagent").className =
    "tab-btn" + (mode === "subagent" ? " active" : "");
  document.getElementById("simBtnBad").className =
    "tab-btn" + (mode === "bad" ? " active-danger" : "");

  const mainLabel = document.getElementById("simMainTokenLabel");
  const mainBar = document.getElementById("simMainBar");
  const mainExplain = document.getElementById("simMainExplain");

  const subLabel = document.getElementById("simSubTokenLabel");
  const subBar = document.getElementById("simSubBar");
  const subExplain = document.getElementById("simSubExplain");

  if (mode === "skill") {
    mainLabel.style.color = "#22d3ee";
    mainLabel.textContent = "Mesma Conversa · ~600 tokens gastos (Sem exploração!)";
    mainBar.innerHTML = `
      <div class="meter-segment" style="width: 10%; background: var(--accent-cache);" title="Instructions em Cache"></div>
      <div class="meter-segment" style="width: 8%; background: var(--accent-prompt);" title="Conversa Atual"></div>
      <div class="meter-segment" style="width: 8%; background: var(--accent-skill);" title="Skill Carregada Sob Demanda (~320t)"></div>
    `;
    mainExplain.innerHTML = `🟢 <strong>Base (400t)</strong> + 🔵 <strong>Pedido (200t)</strong> + 📘 <strong>Skill (~320t)</strong>.<br/>Como a Skill já deu a receita pronta e o comando exato, o agente principal <strong>não precisou abrir arquivo por arquivo</strong>!`;

    subLabel.style.color = "var(--text-muted)";
    subLabel.textContent = "Não utilizada (0 tokens)";
    subBar.innerHTML = `<div class="meter-segment" style="width: 0%;"></div>`;
    subExplain.innerHTML = `Não precisou de Subagent porque não havia necessidade de vasculhar dezenas de arquivos desconhecidos — a Skill já tinha o atalho.`;
  } else if (mode === "subagent") {
    mainLabel.style.color = "#34d399";
    mainLabel.textContent = "Protegida! · Só +250 tokens recebidos na principal";
    mainBar.innerHTML = `
      <div class="meter-segment" style="width: 10%; background: var(--accent-cache);" title="Instructions em Cache"></div>
      <div class="meter-segment" style="width: 7%; background: var(--accent-prompt);" title="Conversa Atual"></div>
      <div class="meter-segment" style="width: 4%; background: var(--accent-subagent);" title="Apenas o Resumo Final do Subagent (+250t)"></div>
    `;
    mainExplain.innerHTML = `🟢 <strong>Base (400t)</strong> + 🔵 <strong>Pedido (200t)</strong> + 🤖 <strong>Resposta Final do Subagent (+250t)</strong>.<br/>Sua conversa principal ficou limpa! Todo o peso de abrir arquivo por arquivo ficou fora daqui.`;

    subLabel.style.color = "#f472b6";
    subLabel.textContent = "Absorveu a Exploração · ~12.000 tokens isolados (e descartados)";
    subBar.innerHTML = `
      <div class="meter-segment" style="width: 82%; background: var(--accent-subagent);"></div>
    `;
    subExplain.innerHTML = `🤖 Como era uma investigação aberta (caçar um bug em 40 arquivos), o Subagent fez a leitura arquivo a arquivo na <strong>janela própria dele</strong> e devolveu só a resposta.`;
  } else {
    mainLabel.style.color = "#f87171";
    mainLabel.textContent = "⚠️ Poluída! · +12.000 tokens acumulados na conversa";
    mainBar.innerHTML = `
      <div class="meter-segment" style="width: 10%; background: var(--accent-cache);"></div>
      <div class="meter-segment" style="width: 8%; background: var(--accent-prompt);"></div>
      <div class="meter-segment" style="width: 76%; background: var(--accent-danger);"></div>
    `;
    mainExplain.innerHTML = `🔴 Sem Skill (para dar o atalho) e sem Subagent (para isolar a busca), o <strong>agente principal teve que abrir arquivo por arquivo na sua conversa</strong>, deixando tudo caro e lento!`;

    subLabel.style.color = "var(--text-muted)";
    subLabel.textContent = "Não utilizada (Todo o ruído ficou na janela principal)";
    subBar.innerHTML = `<div class="meter-segment" style="width: 0%;"></div>`;
    subExplain.innerHTML = `⚠️ Se a tarefa era repetível, uma <strong>Skill</strong> evitaria ler esses arquivos; se era uma busca aberta, um <strong>Subagent</strong> isolaria esse ruído.`;
  }
  fitSlidesToViewport();
}

// ============================================================================
// AUTO-FIT VIEWPORT & FULLSCREEN CONTROLLER
// ============================================================================
function fitSlidesToViewport() {
  const containers = document.querySelectorAll(".slide-container");
  if (!containers.length) return;

  if (window.innerWidth <= 1024) {
    containers.forEach((c) => {
      c.style.transform = "none";
    });
    return;
  }

  const isFs = Boolean(document.fullscreenElement);
  const topOffset = isFs ? 56 : 66;
  const availWidth = window.innerWidth - 64;
  const availHeight = window.innerHeight - topOffset - 22;

  containers.forEach((container) => {
    container.style.transform = "none";
    const naturalWidth = container.offsetWidth || 1260;
    const naturalHeight = container.offsetHeight || 600;

    const scaleX = availWidth / naturalWidth;
    const scaleY = availHeight / naturalHeight;
    const scale = Math.min(scaleX, scaleY, 1.16);
    container.style.transform = `scale(${scale.toFixed(4)})`;
  });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else {
    document.exitFullscreen?.().catch(() => {});
  }
}

function updateFullscreenUI() {
  const isFs = Boolean(document.fullscreenElement);
  document.body.classList.toggle("is-fullscreen", isFs);
  const fsBtn = document.getElementById("fullscreenBtn");
  if (fsBtn) {
    fsBtn.classList.toggle("active", isFs);
    fsBtn.innerHTML = isFs ? "🗗 Sair da Tela Cheia" : "⛶ Tela Cheia";
  }
  fitSlidesToViewport();
  // Keep current slide aligned after fullscreen transition
  const target = document.getElementById(`slide-${currentSlide}`);
  if (target) {
    target.scrollIntoView({ behavior: "instant" });
  }
}

// ============================================================================
// NAVIGATION, SCROLL TRACKING & KEYBOARD SHORTCUTS
// ============================================================================
function updateNavigationUI(index) {
  currentSlide = index;
  const dots = document.querySelectorAll(".slide-dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });

  const progress = ((index + 1) / totalSlides) * 100;
  document.getElementById("progressFill").style.width = `${progress}%`;

  const formattedIndex = String(index + 1).padStart(2, "0");
  document.getElementById("slideCounterBadge").textContent = `${formattedIndex}/0${totalSlides}`;

  // Update Speaker Notes content
  const note = speakerNotes[index] || speakerNotes[0];
  document.getElementById("notesSlideTitle").textContent = `🎙️ ${note.title}`;
  document.getElementById("notesBody").innerHTML = note.html;
}

function goToSlide(index) {
  const clamped = Math.max(0, Math.min(totalSlides - 1, index));
  const target = document.getElementById(`slide-${clamped}`);
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
    updateNavigationUI(clamped);
  }
}

function toggleNotes() {
  const drawer = document.getElementById("notesDrawer");
  const btn = document.getElementById("toggleNotesBtn");
  const isOpen = drawer.classList.toggle("open");
  btn.classList.toggle("active", isOpen);
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize interactive views
  renderPromptSlide();
  setCacheState("turn2");
  selectFolder("frontend");
  setToolCase("logs");
  setSkillCase("explore");
  setSubagentCase("investigate");
  setDuelSim("skill");
  updateNavigationUI(0);
  fitSlidesToViewport();

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => fitSlidesToViewport());
  }

  window.addEventListener("resize", fitSlidesToViewport);
  document.addEventListener("fullscreenchange", updateFullscreenUI);

  // Slide dot clicks
  document.querySelectorAll(".slide-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = Number(dot.getAttribute("data-slide"));
      goToSlide(idx);
    });
  });

  // Top bar buttons
  document.getElementById("fullscreenBtn").addEventListener("click", toggleFullscreen);
  document.getElementById("prevSlideBtn").addEventListener("click", () => {
    goToSlide(currentSlide - 1);
  });
  document.getElementById("nextSlideBtn").addEventListener("click", () => {
    goToSlide(currentSlide + 1);
  });
  document.getElementById("toggleNotesBtn").addEventListener("click", toggleNotes);

  // IntersectionObserver to sync active slide while scrolling
  const slides = document.querySelectorAll(".slide");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.getAttribute("data-index"));
          if (!Number.isNaN(idx)) {
            updateNavigationUI(idx);
          }
        }
      });
    },
    { threshold: 0.52 }
  );

  slides.forEach((s) => observer.observe(s));

  // Keyboard navigation (PowerPoint + Web ergonomics)
  window.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
      return;
    }

    if (e.key === "ArrowRight" || e.key === "PageDown") {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key === "n" || e.key === "N") {
      e.preventDefault();
      toggleNotes();
    } else if (e.key >= "1" && e.key <= "9") {
      goToSlide(Number(e.key) - 1);
    }
  });
});
