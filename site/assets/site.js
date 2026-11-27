const themePicker = document.querySelector('[data-theme-picker]');
const themeOverride = document.querySelector('[data-theme-override]');
const pageRoot = document.documentElement;

function updateBrowserTheme(value) {
  if (value === 'system') {
    themeOverride.media = 'not all';
  } else {
    themeOverride.content = document.querySelector(`meta[media="(prefers-color-scheme: ${value})"]`).content;
    themeOverride.media = 'all';
  }
}

if (themeOverride) {
  updateBrowserTheme(pageRoot.dataset.theme || 'system');
}

if (themePicker) {
  const trigger = themePicker.querySelector('summary');
  const options = [...themePicker.querySelectorAll('[data-theme-option]')];

  function updateSelection(value) {
    for (const option of options) {
      option.setAttribute('aria-pressed', String(option.dataset.themeOption === value));
    }
  }

  updateSelection(pageRoot.dataset.theme || 'system');
  themePicker.hidden = false;

  for (const option of options) {
    option.addEventListener('click', () => {
      const value = option.dataset.themeOption;
      if (value === 'system') {
        delete pageRoot.dataset.theme;
      } else {
        pageRoot.dataset.theme = value;
      }
      try {
        if (value === 'system') localStorage.removeItem('cv-theme');
        else localStorage.setItem('cv-theme', value);
      } catch {
        // The selection still applies to the current page when storage is unavailable.
      }
      updateSelection(value);
      updateBrowserTheme(value);
      themePicker.open = false;
      trigger.focus();
    });
  }

  document.addEventListener('pointerdown', (event) => {
    if (themePicker.open && !themePicker.contains(event.target)) themePicker.open = false;
  });
  themePicker.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !themePicker.open) return;
    themePicker.open = false;
    trigger.focus();
  });
}

for (const image of document.querySelectorAll('[data-image-fallback]')) {
  const useFallback = () => { image.src = image.dataset.imageFallback; };
  if (image.complete && !image.naturalWidth) useFallback();
  else image.addEventListener('error', useFallback, { once: true });
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
  let userInteracted = false;

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
    userInteracted = true;
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
      if (!userInteracted && !reducedMotion.matches) startReplay();
    }, { threshold: .6 });
    observer.observe(flow);
  }
}

const workTimeline = document.querySelector('[data-timeline]');
if (workTimeline && 'IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    workTimeline.dataset.visible = '';
    visibilityObserver.disconnect();
  }, { threshold: .16 });
  visibilityObserver.observe(workTimeline);
}
