# Agentes na Medida — Pare de Fazer a IA Adivinhar

### 🚀 **[Abrir Apresentação no Navegador (GitHub Pages)](https://bigdecimals.github.io/agentes-na-medida/)**
Link direto: **`https://bigdecimals.github.io/agentes-na-medida/`**

---

Apresentação interativa (~15 minutos) em formato híbrido (**Scrollytelling + Slides**) sobre **Engenharia de Contexto** aplicada ao dia a dia:

1. **O Pedido Descritivo**: Como eliminar os "pontos cegos" onde a IA precisa adivinhar (Objetivo + Contexto + Restrições + Formato).
2. **Instructions & Prefix Caching**: Por que regras globais no topo do prompt ficam em cache (até 90% de economia em tokens e respostas mais rápidas).
3. **Instructions Modularizadas**: Carregamento sob medida por pasta/escopo (`/frontend`, `/backend`, `/tests`, `/docs`) para não poluir a janela de contexto.
4. **Tools (Ferramentas)**: Como poupar milhares de tokens tirando o trabalho braçal do prompt e reaproveitando scripts/integrações determinísticas.
5. **Skills vs. Subagents (Lado a Lado)**:
   - **Skills**: Manuais sob demanda carregados via *Revelação Progressiva* na **mesma conversa**.
   - **Subagents**: Especialistas com **janela de contexto isolada** para pesquisas pesadas sem poluir a conversa principal.
6. **Mapa de Decisão**: Guia prático de quando usar cada recurso.
7. **Estudo de Caso Real em Produção (Slide 10 — Enxame Autônomo 24/7)**: Arquitetura real do laboratório multiagente para o **Kaggle Gemma 4 Developer Agent**, demonstrando ao vivo (com zoom/pan interativo e tela cheia) como **Instructions em Cache (`AGENTS.md`)**, **Enxame em 3 Tiers de Modelos (`Swarm Board`)**, **6 Skills (`SKILL.md`)**, **14 Subagents Read-Only Isolados** e **Tools CLI Determinísticas (`lab`)** interagem sem poluir contexto nem colidir arquivos.

## Atalhos Durante a Apresentação

- `Scroll` ou setas `←` / `→` (`PageUp` / `PageDown`): Navegar entre os slides
- `1` a `9` e `0`: Ir direto para os Slides 01 a 10 (`0` abre o Slide 10 · Caso Real)
- `F`: Alternar **Tela Cheia**
- `N`: Abrir/fechar o **Roteiro do Apresentador** com tempo sugerido por seção
- No **Slide 10 (Caso Real)**: arraste para mover o diagrama, `Ctrl + Scroll` (ou botões `+`/`−`) para zoom, e duplo clique (ou `⛶ Ampliar Diagrama`) para tela cheia interativa (`Esc` para fechar)

---

## Estudo de Caso Real: Ecossistema Multiagente 24/7 (Mermaid)

### 1. Visão Completa — Agents, Skills, Subagents, Tools & Prefix Cache

```mermaid
flowchart LR
  subgraph L1["1. INSTRUCTIONS & PREFIX CACHE (-90% CUSTO)"]
    direction TB
    AGENTS["⚡ AGENTS.md (Instruction Global)
    Fuso GMT-3 · 0 Warnings · ≤ 700 Linhas
    Fronteiras Estritas de Escrita"]:::cacheNode
    CAT["📑 Indice de Skills em Cache (~180t)
    6 entradas YAML (name + description)
    Corpos SKILL.md fechados em repouso"]:::cacheNode
    TOML[("⚙️ lab.toml (Estado & Ratchet)
    [gemma.mastermind] · [gemma.ratchet]
    Candidatos em Quarentena")]:::modNode
  end

  subgraph L2["2. ENXAME AUTONOMO 24/7 (NATIVE SWARM · 3 TIERS)"]
    direction TB
    CRON(["⏰ Schedule Cron (*/30 min · IsDaemon)"]):::swarmNode
    COORD{{"👑 @coordinator (Juiz Supremo)
    Tier 1: Gemini 4 Carbon High"}}:::coordNode
    BOARD["📋 Native Swarm Message Board
    post_message · read_board · swarm_wait
    Doorbell @nome (0 tokens em espera)"]:::boardNode

    subgraph T2["Tier 2 · Orchestrator Carbon (Planeja Carbon / Executa Hydrogen)"]
      direction TB
      TRAINER["🏋️ @trainer
      SFT LoRA, Calibracao & Evals
      (0 subagents aninhados)"]:::swarmNode
      FANATIC["🕵️ @fanatic (Cron 6h)
      Detetive Paranoico Causa Raiz
      (1 hipotese falsificavel/vez)"]:::swarmNode
      AUDITOR["🛡️ @auditor (Cron 12h)
      Guardiao Zero-Defeito & Wheels
      (Silencioso se 0 CRITICAL/HIGH)"]:::swarmNode
    end

    subgraph T3["Tier 3 · Gemini 4 Hydrogen Medium (Ops & Docs Leves)"]
      direction TB
      COMPMON["📡 @comp-monitor
      Radar Kaggle LB, Cotas & Forum"]:::opsNode
      SCRIBE["📝 @scribe
      Sincroniza LOG, PAPER & STATUS"]:::opsNode
      WATCH["⏱️ @monitor
      Watchdog Anti-Stall do Board"]:::opsNode
    end
  end

  subgraph L3["3. SKILLS (MESMA SALA) vs SUBAGENTS (OUTRA SALA)"]
    direction TB
    subgraph SKBOX["📘 Skills (.agents/skills/*/SKILL.md · Revelacao Progressiva)"]
      direction TB
      SK_MM["📘 Skill: mastermind-overseer
      SKILL.md + mastermind-ledger.md"]:::skillNode
      SK_TR["📘 Skill: training-cycle
      SKILL.md + trainer-memory.md
      + findings_tasks/ + candidates/"]:::skillNode
      SK_FN["📘 Skill: paranoid-fanatic
      SKILL.md + fanatic-dossier.md"]:::skillNode
      SK_AU["📘 Skill: repo-auditor
      SKILL.md + findings/ + references/*.md"]:::skillNode
      SK_OP["📘 Skills: competition-monitor & scribe
      STATUS.md · FORUM.md · LOG.md · PAPER.md"]:::skillNode
    end

    subgraph SUBBOX["🤖 Subagents (invoke_subagent · Janelas 100% Isoladas)"]
      direction TB
      SUB14["🤖 Ate 14 Subagents Read-Only Paralelos
      Dataset · Loss Mask · Safetensors · Wheel · Pytest
      ~180k tokens descartados -> retorna so resumo!"]:::subNode
      SUBMON["🤖 Subagent Persistente (send_message)
      Sessao isolada p/ polling de LB e Forum"]:::subNode
    end
  end

  subgraph L4["4. TOOLS CLI DETERMINISTICAS (.venv/bin/lab) & GPUS"]
    direction TB
    TL_PULSE["🛠️ Tool: lab pulse & mastermind-status
    Trava .venv + Saldo Dual-Colab & Kaggle"]:::toolNode
    TL_GATE["🛠️ Tool: devil-advocate & train-gate
    Bloqueia DE-01..45 + 100% loss_mask==1"]:::toolNode
    TL_AUTOP["🛠️ Tool: fanatic-autopsy & fanatic-p0
    Forense Exata + Preempcao P0 Automatica"]:::toolNode
    TL_COLAB["🔥 Tool GPU: lab colab job (2x Contas)
    GPUs G4 / A100 · SFT LoRA & Evals"]:::gpuNode
    TL_CALIB["🛠️ Tool: calibrate, check & non-regression
    Norma F32 @0.975x · 0 regressoes 2/2 vs 0.22"]:::toolNode
    TL_KAGGLE["🏆 Tool GPU: kaggle-queue & gemma submit
    4xL4 (≤ 11h) -> 4-Gate BiS -> submission.zip"]:::gpuNode
  end

  AGENTS -.->|"Prefix Cache Fixo"| COORD
  CAT -.->|"Indice 30t/Skill"| BOARD
  CRON -->|"Tick 30m"| COORD
  COORD <-->|"Diretivas & Ratchet"| TOML
  COORD ==>|"Doorbell @nome"| BOARD
  WATCH -.->|"Destrava stall"| BOARD

  BOARD ==>|"Missao SFT"| TRAINER
  BOARD ==>|"Forense 6h"| FANATIC
  BOARD ==>|"Drift / Audit"| AUDITOR
  BOARD -->|"Sync Pos-Run"| SCRIBE
  BOARD -->|"Checar LB"| COMPMON

  COORD ---|"Abre na mesma sala"| SK_MM
  TRAINER ---|"Abre na mesma sala"| SK_TR
  FANATIC ---|"Abre na mesma sala"| SK_FN
  AUDITOR ---|"Abre na mesma sala"| SK_AU
  SCRIBE ---|"Abre na mesma sala"| SK_OP
  COMPMON ---|"Abre na mesma sala"| SK_OP

  AUDITOR ==>|"invoke_subagent (x14)"| SUB14
  COMPMON ==>|"send_message"| SUBMON

  COORD -->|"Checa cotas"| TL_PULSE
  TRAINER -->|"1. Gate Zero-Defeito"| TL_GATE
  TRAINER -->|"2. Treina LoRA"| TL_COLAB
  TRAINER -->|"3. Valida Campeao"| TL_CALIB
  TRAINER ==>|"4. Auto-Submit BiS"| TL_KAGGLE
  FANATIC -->|"Auditoria & P0"| TL_AUTOP
  TL_AUTOP -.->|"Trava P0 se bug real"| TOML
  SUBMON -->|"API Kaggle"| TL_KAGGLE

  classDef cacheNode fill:#062e24,stroke:#10b981,stroke-width:2px,color:#ecfdf5
  classDef modNode fill:#24123b,stroke:#a855f7,stroke-width:2px,color:#f3e8ff
  classDef coordNode fill:#0c2d48,stroke:#38bdf8,stroke-width:2.5px,color:#f0f9ff
  classDef boardNode fill:#112240,stroke:#60a5fa,stroke-width:2px,color:#e0f2fe
  classDef swarmNode fill:#0f2438,stroke:#38bdf8,stroke-width:1.8px,color:#e0f2fe
  classDef opsNode fill:#162032,stroke:#94a3b8,stroke-width:1.5px,color:#f1f5f9
  classDef skillNode fill:#083344,stroke:#06b6d4,stroke-width:2px,color:#cffafe
  classDef subNode fill:#3b0d2c,stroke:#ec4899,stroke-width:2px,color:#fce7f3
  classDef toolNode fill:#362207,stroke:#f59e0b,stroke-width:2px,color:#fef3c7
  classDef gpuNode fill:#421c07,stroke:#fb923c,stroke-width:2.5px,color:#ffedd5
```

### 2. Ciclo de Interação Passo a Passo (Sequence Diagram)

```mermaid
sequenceDiagram
  autonumber
  participant MM as 👑 Coordinator (Carbon High)
  participant BD as 📋 Swarm Board (Doorbell)
  participant TR as 🏋️ @trainer + 📘 Skill
  participant AU as 🛡️ @auditor + 📘 Skill
  participant SB as 🤖 14 Subagents (Isolados)
  participant FN as 🕵️ @fanatic + 📘 Skill
  participant TL as 🛠️ Tools CLI (lab) & GPUs
  participant SC as 📝 @scribe & @comp-monitor

  Note over MM,SC: AGENTS.md + Indice das 6 Skills ja estao congelados no Prefix Cache (-90% custo)

  MM->>TL: Cron */30m -> abre mastermind-overseer/SKILL.md -> roda lab gemma mastermind-status
  TL-->>MM: JSON enxuto (Saldo 2x Colab G4, Cota Kaggle 4xL4, Ratchet 21.0/44)
  MM->>BD: post_message("@trainer Execute ciclo SFT ancorado no Campeao 0.22") + swarm_wait

  BD->>TR: Acorda @trainer (Orchestrator Carbon)
  Note over TR: Abre training-cycle/SKILL.md + trainer-memory.md na MESMA janela (~600t)
  TR->>TL: Tool: lab gemma devil-advocate & train-gate (valida 100% loss_mask==1)
  TL-->>TR: Gate APROVADO (0 Dead-Ends, max_per_repo ≤ 5, 0 CRITICAL/HIGH)

  par Auditoria de Paridade com Subagents Isolados
    BD->>AU: Acorda @auditor em mudanca de wheel ou ciclo 12h
    AU->>SB: invoke_subagent x14 (Dataset, Safetensors, Wheel Parity, Pytest)
    Note over SB: 14 salas Read-Only leem 50+ arquivos (~180k tokens descartados!)
    SB-->>AU: Retorna apenas resumo executivo (~300t: 0 CRITICAL / 0 HIGH)
  and Treino Remoto em GPU + Forense 6h
    TR->>TL: Tool: lab colab job (Treino LoRA SFT em 2x G4 + canary12 + extra-d-clean)
    FN->>TL: Ciclo 6h -> abre paranoid-fanatic/SKILL.md -> lab gemma fanatic-autopsy
    TL-->>FN: Hipotese testada (se defeito provado -> aciona fanatic-p0 no lab.toml)
    TL-->>TR: Pesos baixados -> lab gemma calibrate (F32 @0.975x) + non-regression
  end

  TR->>TL: 4 Gates BiS OK! -> lab kaggle-queue (4xL4 ≤ 11.0h) -> lab gemma submit
  TL-->>TR: Submissao Oficial enviada ao Kaggle (submission.zip certificada)
  TR->>BD: post_message("[done] @coordinator @scribe @comp-monitor Novo recorde submetido")

  BD->>SC: Acorda Tier 3 (Hydrogen Medium)
  SC->>TL: Confere JSONs brutos + lab submissions + lab forum --new
  SC-->>BD: STATUS.md, LOG.md, TRAINING.md, PAPER.md e FORUM.md sincronizados (GMT-3)
```
