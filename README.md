# Agentes na Medida — Pare de Fazer a IA Adivinhar

Apresentação interativa (~15 minutos) em formato híbrido (**Scrollytelling + Slides**) sobre **Engenharia de Contexto** aplicada ao dia a dia:

1. **O Pedido Descritivo**: Como eliminar os "pontos cegos" onde a IA precisa adivinhar (Objetivo + Contexto + Restrições + Formato).
2. **Instructions & Prefix Caching**: Por que regras globais no topo do prompt ficam em cache (até 90% de economia em tokens e respostas mais rápidas).
3. **Instructions Modularizadas**: Carregamento sob medida por pasta/escopo (`/frontend`, `/backend`, `/tests`, `/docs`) para não poluir a janela de contexto.
4. **Tools (Ferramentas)**: Como poupar milhares de tokens tirando o trabalho braçal do prompt e reaproveitando scripts/integrações determinísticas.
5. **Skills vs. Subagents (Lado a Lado)**:
   - **Skills**: Manuais sob demanda carregados via *Revelação Progressiva* na **mesma conversa**.
   - **Subagents**: Especialistas com **janela de contexto isolada** para pesquisas pesadas sem poluir a conversa principal.
6. **Mapa de Decisão**: Guia prático de quando usar cada recurso.

## Como Apresentar

- **Via GitHub Pages**: A apresentação fica em [`docs/index.html`](./docs/index.html) (compatível tanto com publicação pela pasta `/docs` quanto pela raiz `/`).
- **Atalhos durante a apresentação**:
  - `Scroll` ou setas `←` / `→` (`PageUp` / `PageDown`): Navegar entre os slides
  - `1` a `7`: Ir direto para o slide correspondente
  - `N`: Abrir/fechar o **Roteiro do Apresentador** com tempo sugerido por seção
