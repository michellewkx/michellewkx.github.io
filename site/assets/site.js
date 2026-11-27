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
      pageRoot.dataset.theme = value;
      try {
        localStorage.setItem('cv-theme', value);
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

const mediaDialog = document.querySelector('[data-media-dialog]');
if (mediaDialog && typeof mediaDialog.showModal === 'function') {
  const previews = document.querySelectorAll('[data-media-preview]');
  const title = mediaDialog.querySelector('[data-media-title]');
  const image = mediaDialog.querySelector('[data-media-image]');
  const video = mediaDialog.querySelector('[data-media-video]');
  const loadError = mediaDialog.querySelector('[data-media-error]');
  const original = mediaDialog.querySelector('[data-media-source]');
  const controls = mediaDialog.querySelector('[data-media-controls]');
  const count = mediaDialog.querySelector('[data-media-count]');
  let opener;
  let gallery = [];
  let position = 0;
  let imageFallback;
  let pressedBackdrop = false;

  function releaseVideo() {
    if (!video.hasAttribute('src')) return;
    video.pause();
    video.removeAttribute('src');
    video.removeAttribute('poster');
    video.load();
  }

  function showMedia() {
    const item = gallery[position];
    const thumbnail = item.querySelector('img');
    const thumbnailUrl = thumbnail.currentSrc || thumbnail.src;
    const caption = item.getAttribute('aria-label') || thumbnail.alt;
    const isVideo = item.dataset.mediaPreview === 'video';

    releaseVideo();
    title.textContent = caption;
    loadError.hidden = true;
    mediaDialog.dataset.mediaKind = isVideo ? 'video' : 'image';
    mediaDialog.toggleAttribute('data-media-portrait', item.classList.contains('portrait-link'));
    original.href = item.href;
    original.textContent = isVideo ? original.dataset.videoLabel : original.dataset.imageLabel;
    controls.hidden = gallery.length < 2;
    count.textContent = `${position + 1} / ${gallery.length}`;
    image.hidden = isVideo;
    video.hidden = !isVideo;

    if (isVideo) {
      image.removeAttribute('src');
      imageFallback = undefined;
      video.setAttribute('aria-label', caption);
      video.poster = thumbnailUrl;
      video.src = item.href;
    } else {
      imageFallback = thumbnail.dataset.imageFallback;
      image.alt = thumbnail.alt;
      image.setAttribute('width', thumbnail.getAttribute('width'));
      image.setAttribute('height', thumbnail.getAttribute('height'));
      image.src = thumbnailUrl;
    }
  }

  function changeMedia(step) {
    if (gallery.length < 2) return;
    position = (position + step + gallery.length) % gallery.length;
    showMedia();
  }

  for (const preview of previews) {
    preview.setAttribute('aria-haspopup', 'dialog');
    preview.setAttribute('aria-controls', mediaDialog.id);
    preview.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const group = preview.closest('.project-gallery');
      opener = preview;
      gallery = group ? [...group.querySelectorAll('[data-media-preview]')] : [preview];
      position = gallery.indexOf(preview);
      showMedia();
      mediaDialog.showModal();
    });
  }

  image.addEventListener('error', () => {
    if (image.hidden || !mediaDialog.open) return;
    if (imageFallback && image.src !== new URL(imageFallback, document.baseURI).href) {
      image.src = imageFallback;
    } else {
      image.hidden = true;
      loadError.hidden = false;
    }
  });
  video.addEventListener('error', () => {
    if (video.hidden || !mediaDialog.open || !video.hasAttribute('src')) return;
    const fallback = gallery[position]?.dataset.mediaFallback;
    if (fallback && video.src !== fallback) {
      original.href = fallback;
      video.src = fallback;
    } else {
      loadError.hidden = false;
    }
  });
  mediaDialog.querySelector('[data-media-close]').addEventListener('click', () => mediaDialog.close());
  mediaDialog.querySelector('[data-media-prev]').addEventListener('click', () => changeMedia(-1));
  mediaDialog.querySelector('[data-media-next]').addEventListener('click', () => changeMedia(1));
  mediaDialog.addEventListener('keydown', (event) => {
    if (gallery.length < 2 || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    changeMedia(event.key === 'ArrowLeft' ? -1 : 1);
  });
  mediaDialog.addEventListener('pointerdown', (event) => {
    pressedBackdrop = event.target === mediaDialog;
  });
  mediaDialog.addEventListener('click', (event) => {
    if (pressedBackdrop && event.target === mediaDialog) mediaDialog.close();
    pressedBackdrop = false;
  });
  mediaDialog.addEventListener('close', () => {
    if (mediaDialog.open) return;
    releaseVideo();
    image.removeAttribute('src');
    gallery = [];
    pressedBackdrop = false;
    opener?.focus({ preventScroll: true });
    opener = undefined;
  });
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

const careerMap = document.querySelector('[data-career-map]');
if (careerMap) {
  const stage = careerMap.querySelector('[data-career-canvas]');
  const navigation = careerMap.querySelector('[data-career-stops]');
  const details = careerMap.querySelector('[data-career-details]');
  const stops = [...navigation.querySelectorAll('[data-career-stop]')];
  const entries = stops.map((stop) => document.getElementById(stop.hash.slice(1)));
  const indexFromHash = () => stops.findIndex((stop) => stop.hash === location.hash);
  let activeIndex;
  let terrain;

  function selectEntry(index, share = false) {
    if (index === activeIndex) return;
    activeIndex = index;
    if (share) {
      details.setAttribute('aria-live', 'polite');
      history.replaceState(history.state, '', stops[index].hash);
    }
    for (const [stopIndex, stop] of stops.entries()) {
      const selected = stopIndex === index;
      if (selected) stop.setAttribute('aria-current', 'true');
      else stop.removeAttribute('aria-current');
      entries[stopIndex].hidden = !selected;
    }
    terrain?.setActive(index);
  }

  const linkedIndex = indexFromHash();
  selectEntry(linkedIndex < 0 ? stops.findIndex((stop) => stop.hasAttribute('data-current')) : linkedIndex);

  for (const [index, stop] of stops.entries()) {
    stop.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      selectEntry(index, true);
    });
  }

  navigation.addEventListener('keydown', (event) => {
    const index = stops.indexOf(event.target);
    if (index < 0 || event.metaKey || event.ctrlKey || event.altKey) return;
    let nextIndex;
    switch (event.key) {
      case 'ArrowLeft': nextIndex = Math.max(0, index - 1); break;
      case 'ArrowRight': nextIndex = Math.min(stops.length - 1, index + 1); break;
      case 'Home': nextIndex = 0; break;
      case 'End': nextIndex = stops.length - 1; break;
      default: return;
    }
    event.preventDefault();
    selectEntry(nextIndex, true);
    stops[nextIndex].focus({ preventScroll: true });
  });

  window.addEventListener('hashchange', () => {
    const index = indexFromHash();
    if (index >= 0) selectEntry(index);
  });

  async function loadTerrain() {
    try {
      const { createTerrain } = await import(careerMap.dataset.terrainModule);
      terrain = createTerrain(stage, (points) => {
        for (const [index, { x, y }] of points.entries()) {
          stops[index].style.setProperty('--map-x', `${x * 100}%`);
          stops[index].style.setProperty('--map-y', `${y * 100}%`);
        }
        if (!careerMap.hasAttribute('data-ready')) careerMap.dataset.ready = '';
      });
      if (terrain) terrain.setActive(activeIndex);
      else careerMap.dataset.mapUnavailable = '';
    } catch {
      // The linked timeline remains usable when the canvas or its module is unavailable.
      careerMap.dataset.mapUnavailable = '';
    }
  }

  if ('IntersectionObserver' in window) {
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      visibilityObserver.disconnect();
      void loadTerrain();
    }, { rootMargin: '240px 0px' });
    visibilityObserver.observe(careerMap);
  } else {
    void loadTerrain();
  }
}
