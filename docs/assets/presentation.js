/* No network calls, model calls, analytics, or credentials. */
const reading = new URLSearchParams(location.search).get('view') === 'reading';
if (reading) document.body.classList.add('reading');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const advice = {
  filters: 'Um modelo mais leve é candidato: tarefa estreita, ferramenta validada e resposta fácil de conferir. Meça a taxa de acerto.',
  failure: 'Um modelo mais capaz pode se justificar: hipóteses concorrentes, interações entre serviços e diagnóstico com evidências. Ajuste também o esforço.',
  security: 'Priorize capacidade e revisão independente. Teste acessos negados e limites de permissão. Nenhum modelo substitui controles de segurança.'
};
for (const button of document.querySelectorAll('[data-task]')) {
  button.addEventListener('click', () => {
    for (const other of document.querySelectorAll('[data-task]')) other.setAttribute('aria-pressed', String(other === button));
    document.getElementById('model-advice').textContent = advice[button.dataset.task];
  });
}
const snippet = document.getElementById('java-snippet');
if (window.VERIFIED_CODE?.javaSnippet) snippet.textContent = window.VERIFIED_CODE.javaSnippet;
const focused = document.getElementById('focused-command');
if (window.VERIFIED_CODE?.focusedCommand) focused.textContent = window.VERIFIED_CODE.focusedCommand;
if (window.BENCHMARK?.status === 'measured') {
  const data = window.BENCHMARK;
  document.getElementById('benchmark-status').textContent = `${data.runCount} execuções reais · ${data.correct}/${data.runCount} corretas`;
  document.getElementById('benchmark-reason').textContent = 'Input + output: mediana de três execuções por configuração.';
  for (const element of document.querySelectorAll('[data-benchmark-arm]')) {
    const group = data.groups.find(g => g.model === 'gpt-5.6-luna' && g.arm === element.dataset.benchmarkArm);
    element.textContent = group.medianTotalTokens.toLocaleString('pt-BR') + ' tokens';
  }
  const models = data.groups.filter(g => g.arm === 'tool');
  document.getElementById('model-evidence').textContent = models.map(g =>
    `${g.model}: ${g.correct}/${g.n} corretas, mediana ${g.medianTotalTokens} tokens`).join(' · ');
}
Reveal.initialize({
  width:1200, height:700, margin:0.10, center:false, hash:true,
  transition:reducedMotion || reading ? 'none' : 'fade', backgroundTransition:'none',
  controls:!reading, progress:!reading, overview:!reading, keyboard:!reading,
  touch:!reading, autoSlide:0, totalTime:900, slideNumber:false, pdfSeparateFragments:false,
  plugins:[RevealHighlight,RevealNotes]
}).then(() => {
  function position() {
    document.getElementById('slide-position').textContent = `${Reveal.getIndices().h + 1} / ${Reveal.getTotalSlides()}`;
    if (reading) {
      for (const section of document.querySelectorAll('.slides > section')) {
        section.removeAttribute('aria-hidden');
        section.hidden = false;
        section.inert = false;
      }
    }
  }
  position(); Reveal.on('slidechanged', position);
});
