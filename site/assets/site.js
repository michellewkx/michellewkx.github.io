const printButton = document.querySelector('#print-cv');
if (printButton) {
  printButton.hidden = false;
  printButton.addEventListener('click', () => window.print());
}

const flow = document.querySelector('[data-flow]');
if (flow) {
  const steps = [...flow.querySelectorAll('[data-flow-step]')];
  const notes = [...flow.querySelectorAll('[data-flow-note]')];
  const replay = flow.querySelector('[data-flow-replay]');
  const caption = flow.querySelector('figcaption');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let observer;

  function selectStep(index) {
    flow.dataset.active = String(index);
    steps.forEach((step, stepIndex) => {
      step.setAttribute('aria-pressed', String(stepIndex === index));
      notes[stepIndex].hidden = stepIndex !== index;
    });
  }

  function stopReplay() {
    window.clearTimeout(timer);
    replay.removeAttribute('aria-busy');
  }

  function playStep(index) {
    selectStep(index);
    if (index === steps.length - 1) {
      stopReplay();
    } else {
      timer = window.setTimeout(() => playStep(index + 1), reducedMotion.matches ? 500 : 820);
    }
  }

  function startReplay() {
    stopReplay();
    replay.setAttribute('aria-busy', 'true');
    playStep(0);
  }

  function takeControl() {
    observer?.disconnect();
    caption.setAttribute('aria-live', 'polite');
  }

  steps.forEach((step, index) => {
    step.disabled = false;
    step.addEventListener('click', () => {
      takeControl();
      stopReplay();
      selectStep(index);
    });
  });

  replay.hidden = false;
  replay.addEventListener('click', () => {
    takeControl();
    startReplay();
  });

  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (!reducedMotion.matches) startReplay();
    }, { threshold: .6 });
    observer.observe(flow);
  }
}
