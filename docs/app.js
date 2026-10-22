// ============================================================================
// Agentes na Medida — Interactive Presentation Controller
// ============================================================================

let currentSlide = 0;
const totalSlides = 7;

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
    title: "Slide 02 · O Pedido Descritivo (~2.5 min)",
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
    title: "Slide 03 · Instructions & Prefix Caching (~2.5 min)",
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
    title: "Slide 04 · Instructions Modularizadas (~2 min)",
    html: `
      <p><strong>Ponto principal:</strong> Em vez de um arquivo monolítico gigante, modularizamos as instruções por pasta!</p>
      <ul>
        <li>Clique nas pastas (<code>/frontend</code>, <code>/backend</code>, <code>/tests</code>, <code>/docs</code>) para mostrar que a IA só carrega as regras daquela área quando entra na pasta.</li>
        <li>Se a IA está mexendo no banco de dados ou na documentação de negócio, ela não gasta tokens lendo regras de CSS.</li>
        <li>Clique em <strong>Comparar Monolito</strong> para mostrar a diferença gritante no consumo de tokens.</li>
      </ul>
    `
  },
  {
    title: "Slide 05 · Tools: Poupando Tokens e Reuso (~2.5 min)",
    html: `
      <p><strong>Ponto principal:</strong> Não use tokens caros do modelo para fazer trabalho braçal que um código ou script faz em milissegundos.</p>
      <ul>
        <li>Compare os dois lados: colar 5.000 linhas no prompt gasta ~18.000 tokens, demora e não deixa nada pronto para o próximo colega.</li>
        <li>Com uma <strong>Tool</strong>, a lógica roda fora do modelo, devolve só o resultado exato (~240 tokens) e fica <strong>reaproveitável</strong> para toda a equipe.</li>
      </ul>
    `
  },
  {
    title: "Slide 06 · Skills vs. Subagents (~3 min)",
    html: `
      <p><strong>O coração da apresentação:</strong> Qual a diferença real entre uma Skill e um Subagent?</p>
      <ul>
        <li><strong>Skill = Manual na mesma sala:</strong> usa <em>Revelação Progressiva</em> (a IA só lê 1 linha de índice; quando precisa, abre o manual na <strong>mesma conversa</strong>). Ideal para fluxos padronizados onde o histórico atual importa.</li>
        <li><strong>Subagent = Especialista em outra sala:</strong> abre uma <strong>janela de contexto isolada</strong>. Ideal quando a tarefa exige ler dezenas de arquivos sem poluir a conversa principal.</li>
        <li>Use os 3 botões do simulador abaixo para mostrar visualmente o impacto na memória!</li>
      </ul>
    `
  },
  {
    title: "Slide 07 · Mapa de Decisão e Fechamento (~1.5 min)",
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
    noToolTokens: "~4.800 tokens + Risco",
    withToolTokens: "~180 tokens (100% Exato)",
    noToolDesc: "Pedir para o modelo calcular impostos, juros compostos ou validar 200 registros " + "usando apenas texto preditivo.",
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
  }
};

function setToolCase(caseKey) {
  ["logs", "sprint", "calc"].forEach((k) => {
    const id = "toolCase" + k.charAt(0).toUpperCase() + k.slice(1);
    const btn = document.getElementById(id);
    if (btn) btn.className = "tab-btn" + (k === caseKey ? " active" : "");
  });

  const c = toolCases[caseKey];
  document.getElementById("noToolTokenBadge").textContent = c.noToolTokens;
  document.getElementById("withToolTokenBadge").textContent = c.withToolTokens;
  document.getElementById("noToolDesc").textContent = c.noToolDesc;
  document.getElementById("withToolDesc").textContent = c.withToolDesc;

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

  document.getElementById("noToolVerdict").textContent = c.noToolVerdict;
  document.getElementById("withToolVerdict").textContent = c.withToolVerdict;
  fitSlidesToViewport();
}

// ============================================================================
// SLIDE 06 DATA: Skills vs Subagents Context Simulator
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
    mainLabel.textContent = "Mesma Conversa · 28% ocupada";
    mainBar.innerHTML = `
      <div class="meter-segment" style="width: 10%; background: var(--accent-cache);" title="Instructions em Cache"></div>
      <div class="meter-segment" style="width: 8%; background: var(--accent-prompt);" title="Conversa Atual"></div>
      <div class="meter-segment" style="width: 10%; background: var(--accent-skill);" title="Skill Carregada Sob Demanda"></div>
    `;
    mainExplain.innerHTML = `🟢 <strong>Base em Cache (10%)</strong> + 🔵 <strong>Histórico (8%)</strong> + 📘 <strong>Manual da Skill (10%)</strong>.<br/>A Skill entrou na conversa atual só quando foi chamada, aproveitando todo o contexto que você já tinha construído.`;

    subLabel.style.color = "var(--text-muted)";
    subLabel.textContent = "Não utilizada (0%)";
    subBar.innerHTML = `<div class="meter-segment" style="width: 0%;"></div>`;
    subExplain.innerHTML = `Como a tarefa era direta e padronizada (ex: gerar uma Release Note ou seguir um template), não precisou abrir outra sala.`;
  } else if (mode === "subagent") {
    mainLabel.style.color = "#34d399";
    mainLabel.textContent = "Protegida e Limpa! · 20% ocupada";
    mainBar.innerHTML = `
      <div class="meter-segment" style="width: 10%; background: var(--accent-cache);" title="Instructions em Cache"></div>
      <div class="meter-segment" style="width: 7%; background: var(--accent-prompt);" title="Conversa Atual"></div>
      <div class="meter-segment" style="width: 3%; background: var(--accent-subagent);" title="Apenas o Resumo Final do Subagent"></div>
    `;
    mainExplain.innerHTML = `🟢 <strong>Base (10%)</strong> + 🔵 <strong>Histórico (7%)</strong> + 🤖 <strong>Resumo Final do Subagent (3%)</strong>.<br/>Sua conversa principal continua leve, rápida e sem nenhum lixo das 40 buscas intermediárias!`;

    subLabel.style.color = "#f472b6";
    subLabel.textContent = "Trabalho Pesado Isolado · 75% usada (e descartada depois)";
    subBar.innerHTML = `
      <div class="meter-segment" style="width: 75%; background: var(--accent-subagent);"></div>
    `;
    subExplain.innerHTML = `🤖 O Subagent abriu 40 arquivos, testou hipóteses e gastou tokens na <strong>janela separada dele</strong>. Ao terminar, devolveu só a resposta mastigada e encerrou a sala.`;
  } else {
    mainLabel.style.color = "#f87171";
    mainLabel.textContent = "⚠️ Poluída com Ruído · 92% ocupada!";
    mainBar.innerHTML = `
      <div class="meter-segment" style="width: 10%; background: var(--accent-cache);"></div>
      <div class="meter-segment" style="width: 8%; background: var(--accent-prompt);"></div>
      <div class="meter-segment" style="width: 74%; background: var(--accent-danger);"></div>
    `;
    mainExplain.innerHTML = `🔴 O agente principal abriu dezenas de arquivos e logs direto na sua conversa. Agora toda nova mensagem carrega esse peso morto de 74% de ruído!`;

    subLabel.style.color = "var(--text-muted)";
    subLabel.textContent = "Não utilizada (Erro de escolha)";
    subBar.innerHTML = `<div class="meter-segment" style="width: 0%;"></div>`;
    subExplain.innerHTML = `⚠️ Deveria ter usado um <strong>Subagent</strong> para isolar a investigação pesada fora da conversa principal.`;
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
    } else if (e.key >= "1" && e.key <= "7") {
      goToSlide(Number(e.key) - 1);
    }
  });
});
