import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { chinese, english } from './content.mjs';

const origin = 'https://michellewkx.com';
const assets = new URL('./assets/', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const versionedAssets = await Promise.all(['site.css', 'site.js', 'mark.png']
  .map((name) => readFile(new URL(name, assets))));
const assetHash = createHash('sha256');
versionedAssets.forEach((asset) => assetHash.update(asset));
const assetVersion = assetHash.digest('hex').slice(0, 10);
const anchors = ['overview', 'work', 'cv', 'contact'];
const themeOptions = ['system', 'light', 'dark'];

const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const escape = (value) => value.replace(/[&<>"]/g, (character) => entities[character]);

function renderLinks(links) {
  return links.map(([label, href]) => `<a href="${escape(href)}">${escape(label)}</a>`).join('');
}

function head(page, title = page.name, missing = false) {
  return `<!doctype html>
<html lang="${page.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#fcfcff" media="not all" data-theme-override>
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
    try {
      const storedTheme = localStorage.getItem('cv-theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        document.documentElement.dataset.theme = storedTheme;
      }
    } catch {
      // Storage may be unavailable. Use the system appearance in that case.
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
  return `
            <a class="project-media-link" href="${escape(image.source)}" aria-label="${escape(image.caption)}">
              <figure class="project-visual">
                <img src="${escape(image.src)}" width="${image.width}" height="${image.height}" alt="${escape(image.alt)}" decoding="async"${image.fallback ? ` data-image-fallback="${escape(image.fallback)}"` : ''}>
                <figcaption>${escape(image.caption)}</figcaption>
              </figure>
            </a>`;
}

function renderPage(page, alternate) {
  const work = page.work.entries.map((entry) => `
        <article class="project" id="${escape(entry.id)}" aria-labelledby="project-${escape(entry.id)}">
          <div class="project-copy">
            <p class="entry-meta">${escape(entry.scope)}</p>
            <h3 id="project-${escape(entry.id)}">${escape(entry.name)}</h3>
            <p class="project-description">${escape(entry.description)}</p>
            <div class="text-links">${renderLinks(entry.links)}</div>
          </div>
          <div class="project-media${entry.images.length > 1 ? ' project-gallery' : ''}">${entry.images.map(renderProjectImage).join('')}
          </div>
        </article>`).join('');

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
          ${themeOptions.map((value, index) => `<button type="button" data-theme-option="${value}" aria-pressed="${index === 0}">${escape(page.theme.choices[index])}</button>`).join('')}
        </div>
      </details>
    </div>
  </header>

  <main id="overview" tabindex="-1">
    <section class="hero" aria-labelledby="profile-title">
      <div class="shell hero-inner">
        <div class="hero-identity">
          <p class="secondary-name" lang="${alternate.lang}">${escape(page.secondaryName)}</p>
          <h1 id="profile-title">${escape(page.name)}</h1>
          <p class="role">${escape(page.role)}</p>
          <ul class="profile-details">
            <li>${escape(page.affiliation)}</li>
            <li>${escape(page.education)}</li>
            <li class="location">${escape(page.location)}</li>
          </ul>
          <div class="hero-links">${renderLinks(page.contact.links)}</div>
        </div>
        ${renderFlow(page.flow)}
      </div>
    </section>

    <section id="work" class="shell work" aria-labelledby="work-title">
      <div class="section-heading">
        <h2 id="work-title">${escape(page.work.heading)}</h2>
      </div>
      <div class="projects">${work}
      </div>
    </section>

    <section id="cv" class="shell section-grid" aria-labelledby="cv-title">
      <div class="section-heading">
        <h2 id="cv-title">${escape(page.cv.heading)}</h2>
      </div>
      <ul class="entries experience">${experience}
      </ul>
    </section>

    <section class="shell section-grid patent" aria-labelledby="patent-title">
      <div class="section-heading">
        <h2 id="patent-title">${escape(page.patent.section)}</h2>
      </div>
      <article class="entry">
        <p class="entry-meta">${escape(page.patent.date)}</p>
        <div class="entry-body">
          <h3>${escape(page.patent.heading)}</h3>
          <p>${escape(page.patent.description)}</p>
          <div class="text-links">${renderLinks([[page.patent.number, page.patent.link]])}</div>
        </div>
      </article>
    </section>
  </main>

  <footer id="contact" aria-labelledby="contact-title">
    <div class="shell footer-content">
      <h2 id="contact-title">${escape(page.contact.heading)}</h2>
      <div class="footer-links">${renderLinks(page.contact.links)}</div>
    </div>
  </footer>
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
