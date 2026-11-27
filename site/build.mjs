import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { chinese, english } from './content.mjs';
import { patentGroups } from './patents.mjs';

const origin = 'https://michellewkx.com';
const assets = new URL('./assets/', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const versionedAssets = await Promise.all(['site.css', 'site.js', 'career-map.mjs', 'mark.png']
  .map((name) => readFile(new URL(name, assets))));
const assetHash = createHash('sha256');
versionedAssets.forEach((asset) => assetHash.update(asset));
const assetVersion = assetHash.digest('hex').slice(0, 10);
const portrait = '/assets/kathy-wang-portrait.webp';
const anchors = ['overview', 'timeline', 'work', 'cv', 'contact'];
const themeOptions = ['system', 'light', 'dark'];

const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const escape = (value) => value.replace(/[&<>"]/g, (character) => entities[character]);

function renderLinks(links) {
  return links.map(([label, href]) => `<a href="${escape(href)}">${escape(label)}</a>`).join('');
}

function head(page, title = page.name, missing = false) {
  return `<!doctype html>
<html lang="${page.lang}" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#101018" media="all" data-theme-override>
  <meta name="theme-color" content="#fcfcff" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#101018" media="(prefers-color-scheme: dark)">
  <title>${escape(title)} · CV</title>
  <meta name="description" content="${escape(page.description)}">
  ${missing ? '<meta name="robots" content="noindex">' : `
  <link rel="canonical" href="${origin}${page.path}">
  <link rel="alternate" hreflang="en" href="${origin}/">
  <link rel="alternate" hreflang="zh-CN" href="${origin}/zh/">
  <link rel="alternate" hreflang="x-default" href="${origin}/">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(page.description)}">
  <meta property="og:url" content="${origin}${page.path}">`}
  <script>
    document.documentElement.dataset.js = '';
    try {
      const storedTheme = localStorage.getItem('cv-theme');
      if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
        document.documentElement.dataset.theme = storedTheme;
      }
    } catch {
      // The default appearance still works when storage is unavailable.
    }
  </script>
  ${missing ? '' : '<link rel="preconnect" href="https://dumate-skill-bos.bj.bcebos.com">'}
  <link rel="icon" href="/assets/mark.png?v=${assetVersion}" type="image/png">
  <link rel="stylesheet" href="/assets/site.css?v=${assetVersion}">
</head>`;
}

function renderFlow(flow) {
  const symbols = ['≡', '▧', '✓'];
  const wires = '<span></span>'.repeat(flow.agents.length);
  return `
        <figure class="flow" data-flow data-active="0" aria-labelledby="flow-title">
          <div class="flow-top">
            <a id="flow-title" href="#dumate">${escape(flow.title)}</a>
            <button class="flow-replay" type="button" data-flow-replay hidden>
              <span aria-hidden="true">↻</span> ${escape(flow.replay)}
            </button>
          </div>
          <div class="flow-diagram">
            <div class="flow-hub">${escape(flow.orchestrator)}</div>
            <div class="flow-wires" aria-hidden="true">${wires}</div>
            <div class="flow-agents" role="group" aria-labelledby="flow-title">
              ${flow.agents.map(([label], index) => `
                <button type="button" data-flow-step aria-pressed="${index === 0}" disabled>
                  <span aria-hidden="true">${symbols[index]}</span> ${escape(label)}
                </button>`).join('')}
            </div>
            <div class="flow-wires flow-wires-return" aria-hidden="true">${wires}</div>
            <div class="flow-output">${escape(flow.output)}</div>
          </div>
          <figcaption class="flow-details" aria-live="off">
            ${flow.agents.map(([, description], index) => `
              <p data-flow-note${index === 0 ? '' : ' hidden'}>${escape(description)}</p>`).join('')}
          </figcaption>
        </figure>`;
}

function renderProjectImage(image) {
  const type = image.type || 'image';
  return `
            <a class="project-media-link" href="${escape(image.source)}" aria-label="${escape(image.caption)}" data-media-preview="${type}"${image.sourceFallback ? ` data-media-fallback="${escape(image.sourceFallback)}"` : ''}>
              <figure class="project-visual">
                <img src="${escape(image.src)}" width="${image.width}" height="${image.height}" alt="${escape(image.alt)}" decoding="async"${image.fallback ? ` data-image-fallback="${escape(image.fallback)}"` : ''}>
                <figcaption>${escape(image.caption)}</figcaption>
              </figure>
              <span class="media-preview-icon" aria-hidden="true">${type === 'video' ? '▶' : '⤢'}</span>
            </a>`;
}

function renderMediaDialog(labels) {
  return `
  <dialog class="media-dialog" id="media-preview" data-media-dialog aria-labelledby="media-preview-title">
    <div class="media-dialog-frame">
      <header class="media-dialog-header">
        <h2 id="media-preview-title" data-media-title aria-live="polite"></h2>
        <button class="media-dialog-button media-dialog-close" type="button" data-media-close aria-label="${escape(labels.close)}" autofocus>×</button>
      </header>
      <div class="media-dialog-body">
        <img data-media-image alt="" hidden>
        <video data-media-video controls playsinline preload="none" hidden></video>
        <p class="media-dialog-error" data-media-error role="status" hidden>${escape(labels.loadError)}</p>
      </div>
      <div class="media-dialog-footer">
        <a class="media-dialog-source" data-media-source data-image-label="${escape(labels.originalImage)}" data-video-label="${escape(labels.originalVideo)}" target="_blank" rel="noopener"></a>
        <div class="media-dialog-controls" data-media-controls hidden>
          <button class="media-dialog-button" type="button" data-media-prev aria-label="${escape(labels.previous)}">‹</button>
          <span class="media-dialog-count" data-media-count aria-hidden="true"></span>
          <button class="media-dialog-button" type="button" data-media-next aria-label="${escape(labels.next)}">›</button>
        </div>
      </div>
    </div>
  </dialog>`;
}

function renderTimeline(timeline) {
  const { employment } = timeline;
  const entries = [...timeline.entries].reverse();
  const stops = entries.map((entry) => `
              <a class="timeline-stop" href="#work-${escape(entry.id)}" data-career-stop${entry.current ? ' data-current' : ''} aria-label="${escape(`${entry.jump} · ${entry.title}`)}">
                <span class="timeline-stop-pin" aria-hidden="true"></span>
                <span class="timeline-stop-label">${escape(entry.jump)}</span>
              </a>`).join('');
  const cards = entries.map((entry) => `
            <article class="timeline-card" id="work-${escape(entry.id)}" data-career-entry>
              <p class="timeline-date">${escape(entry.date)}</p>
              <div class="timeline-card-copy">
                <h3>${escape(entry.title)}</h3>
                <p class="timeline-role">${escape(entry.role)}</p>
                <p>${escape(entry.description)}</p>
              </div>${entry.link ? `
              <div class="timeline-card-links">${renderLinks([entry.link])}</div>` : ''}
            </article>`).join('');

  return `
        <section id="timeline" class="timeline-section" aria-labelledby="timeline-title">
          <header class="timeline-header">
            <div class="timeline-heading">
              <h2 id="timeline-title">${escape(timeline.heading)}</h2>
              <p class="timeline-tenure">
                <strong class="timeline-company">${escape(employment.company)}</strong>
                <span class="timeline-tenure-date">${escape(employment.tenure)}</span>
                <span class="timeline-tenure-role">${escape(employment.role)}</span>
              </p>
            </div>
          </header>
          <div class="timeline-explorer" data-career-map data-terrain-module="/assets/career-map.mjs?v=${assetVersion}">
            <div class="timeline-stage">
              <canvas class="timeline-terrain" data-career-canvas aria-hidden="true"></canvas>
              <span class="timeline-map-hint" aria-hidden="true">${escape(timeline.rotate)}</span>
              <nav class="timeline-stops" data-career-stops aria-labelledby="timeline-title">${stops}
              </nav>
            </div>
            <div class="timeline-details" data-career-details>${cards}
            </div>
          </div>
        </section>`;
}

function renderPatents(page) {
  const lang = page.lang === 'en' ? 'en' : 'zh';
  const format = new Intl.DateTimeFormat(page.lang, {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  });
  const renderDate = (kind, date) => `<span>${escape(page.patents.dates[kind])} <time datetime="${escape(date)}">${escape(format.format(new Date(date)))}</time></span>`;
  return patentGroups.map((group) => {
    const heading = page.patents.statusHeadings[group.status];
    return `
        <section class="patent-group" aria-labelledby="patents-${group.status}">
          <h3 id="patents-${group.status}">${escape(heading)} <span class="patent-count">${group.records.length}</span></h3>
          <ol class="patent-list" role="list">
            ${group.records.map((patent) => `
            <li class="patent-item" id="patent-${escape(patent.number)}">
              <h4>${escape(patent[lang])}</h4>
              <div class="patent-dates">
                ${renderDate('filed', patent.filed)}
                ${renderDate(group.status, patent.date)}${patent.rejected ? `
                ${renderDate('rejected', patent.rejected)}` : ''}
              </div>
              <a href="${escape(patent.source || `https://patents.google.com/patent/${patent.number}/zh`)}">${escape(patent.number)}</a>
            </li>`).join('')}
          </ol>
        </section>`;
  }).join('');
}

function renderPage(page, alternate) {
  const work = page.work.entries.map((entry) => {
    const media = `
          <div class="project-media${entry.images.length > 1 ? ' project-gallery' : ''}">${entry.images.map(renderProjectImage).join('')}
          </div>`;
    return `
        <article class="project" id="${escape(entry.id)}" aria-labelledby="project-${escape(entry.id)}">
          <div class="project-copy">
            <p class="entry-meta">${escape(entry.scope)}</p>
            <h3 id="project-${escape(entry.id)}">${escape(entry.name)}</h3>
            <p class="project-description">${escape(entry.description)}</p>
            <div class="text-links">${renderLinks(entry.links)}</div>
          </div>
          ${entry.id === 'dumate' ? `<div class="project-showcase">${media}${renderFlow(page.flow)}
          </div>` : media}
        </article>`;
  }).join('');

  const experience = page.cv.entries.map(([time, institution, role]) => `
        <li class="entry">
          <span class="entry-meta">${escape(time)}</span>
          <div class="entry-body">
            <h3>${escape(institution)}</h3>
            <p>${escape(role)}</p>
          </div>
        </li>`).join('');

  return `${head(page)}
<body>
  <a class="skip" href="#overview">${escape(page.skip)}</a>
  <header class="masthead">
    <div class="shell masthead-inner">
      <a class="identity" href="${page.path}" aria-label="${escape(page.name)}"><span class="mark" aria-hidden="true">KW</span></a>
      <nav aria-label="${page.lang === 'en' ? 'Primary' : '主导航'}">
        ${renderLinks(page.navigation.map((label, index) => [label, '#' + anchors[index]]))}
      </nav>
      <a class="locale" href="${alternate.path}" lang="${alternate.lang}" hreflang="${alternate.lang}">${page.alternate}</a>
      <details class="appearance" data-theme-picker hidden>
        <summary aria-label="${escape(page.theme.label)}" title="${escape(page.theme.label)}">
          <span class="theme-icon" aria-hidden="true"></span>
        </summary>
        <div class="theme-options" role="group" aria-label="${escape(page.theme.label)}">
          ${themeOptions.map((value, index) => `<button type="button" data-theme-option="${value}" aria-pressed="${value === 'dark'}">${escape(page.theme.choices[index])}</button>`).join('')}
        </div>
      </details>
    </div>
  </header>

  <main id="overview" tabindex="-1">
    <section class="hero" aria-labelledby="profile-title">
      <div class="shell hero-inner">
        <div class="hero-identity">
          <div class="profile-heading">
            <a class="portrait-link" href="${portrait}" data-media-preview="image" aria-label="${escape(page.portraitAlt)}">
              <img class="profile-portrait" src="${portrait}" width="512" height="512" alt="${escape(page.portraitAlt)}" decoding="async" fetchpriority="high">
              <span class="media-preview-icon" aria-hidden="true">⤢</span>
            </a>
            <div class="profile-name">
              <p class="secondary-name" lang="${alternate.lang}">${escape(page.secondaryName)}</p>
              <h1 id="profile-title">${escape(page.name)}</h1>
            </div>
          </div>
          <p class="role">${escape(page.role)}</p>
          <ul class="profile-details">
            <li>${escape(page.affiliation)}</li>
            <li>${escape(page.education)}</li>
            <li class="location">${escape(page.location)}</li>
          </ul>
          <div class="hero-links">${renderLinks(page.contact.links)}</div>
        </div>
        ${renderTimeline(page.timeline)}
      </div>
    </section>

    <section id="work" class="shell work" aria-labelledby="work-title">
      <div class="section-heading">
        <h2 id="work-title">${escape(page.work.heading)}</h2>
      </div>
      <div class="projects">${work}
      </div>
    </section>

    <section id="cv" class="shell cv-section" aria-labelledby="cv-title">
      <div class="section-heading">
        <h2 id="cv-title">${escape(page.cv.heading)}</h2>
      </div>
      <ul class="experience" role="list">${experience}
      </ul>
    </section>

    <section id="patents" class="shell patents-section" aria-labelledby="patents-title">
      <div class="section-heading">
        <h2 id="patents-title">${escape(page.patents.heading)}</h2>
      </div>
      <div class="patent-collections">
        ${renderPatents(page)}
        <p class="patent-note">${escape(page.patents.otherApplications)}</p>
      </div>
    </section>
  </main>

  <footer id="contact" aria-labelledby="contact-title">
    <div class="shell footer-content">
      <h2 id="contact-title">${escape(page.contact.heading)}</h2>
      <div class="footer-links">${renderLinks(page.contact.links)}</div>
    </div>
  </footer>
  ${renderMediaDialog(page.media)}
  <script defer src="/assets/site.js?v=${assetVersion}"></script>
</body>
</html>
`;
}

function renderNotFound(page) {
  return `${head(page, page.missing.heading, true)}
<body>
<main class="shell not-found">
  <span class="mark" aria-hidden="true">KW</span>
  <h1>${escape(page.missing.heading)}</h1>
  <p><a href="/">${escape(page.missing.back)}</a> <a href="/zh/" lang="zh-CN">返回中文首页</a></p>
</main>
</body>
</html>
`;
}

await rm(dist, { recursive: true, force: true });
await mkdir(new URL('zh/', dist), { recursive: true });
await cp(assets, new URL('assets/', dist), { recursive: true });
await Promise.all([
  writeFile(new URL('index.html', dist), renderPage(english, chinese)),
  writeFile(new URL('zh/index.html', dist), renderPage(chinese, english)),
  writeFile(new URL('404.html', dist), renderNotFound(english)),
  writeFile(new URL('robots.txt', dist), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`),
  writeFile(new URL('sitemap.xml', dist), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc></url>
  <url><loc>${origin}/zh/</loc></url>
</urlset>
`),
]);
