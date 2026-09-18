# Agentes na medida

Public educational project, not production infrastructure. Keep the 15-minute presentation in Brazilian Portuguese and the example data synthetic.

- Presentation is static HTML/CSS/JS in docs, served by GitHub Pages. No live Java/model calls, analytics, or secrets in browser code.
- Never invent benchmark results. Pending measurements stay visibly pending. Preserve failed attempts and declare which usage fields are actually available.
- Keep code excerpts generated from tested Java source. Label illustrative flows separately from measured traces.
- Implement deterministic filtering/validation in Java, not prompts. No arbitrary SQL or unrestricted shell tool behind the order-search interface.
- Prefer focused tests during iteration; run npm test, npm run test:browser and the Java suite for relevant final changes. Use RED-GREEN for behavioral changes.
- Do not create unrelated GitHub Actions. Pages branch publishing is the only intended automatic publication.
- Preserve third-party licenses. No private data, credentials, raw agent logs, build artifacts, node_modules, or machine-specific paths in commits.
- Contributions use a branch and reviewed PR. Record verification honestly and do not claim a benchmark ran when only its collector was tested.
