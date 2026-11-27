import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { chinese, english } from './content.mjs';

const origin = 'https://michellewkx.com';
const assets = new URL('./assets/', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const anchors = ['overview', 'work', 'cv', 'contact'];

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
  <meta name="theme-color" content="#f6f4ec">
  <title>${escape(title)} · ${escape(page.cv.label)}</title>
  <meta name="description" content="${escape(page.description)}">
  ${missing ? '<meta name="robots" content="noindex">' : `
  <link rel="canonical" href="${origin}${page.path}">
  <link rel="alternate" hreflang="en" href="${origin}/">
  <link rel="alternate" hreflang="zh-CN" href="${origin}/zh/">
  <link rel="alternate" hreflang="x-default" href="${origin}/">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(page.description)}">
  <meta property="og:url" content="${origin}${page.path}">
  <meta property="og:image" content="${origin}/assets/agent-systems-plate.jpg">`}
  <link rel="icon" href="/assets/mark.png" type="image/png">
  <link rel="stylesheet" href="/assets/site.css">
</head>`;
}

function renderPage(page, alternate) {
  const [firstLine, secondLine] = page.headline;
  const work = page.work.entries.map((entry) => `
        <article class="project">
          <div>
            <p class="project-scope">${escape(entry.scope)}</p>
            <h3>${escape(entry.name)}</h3>
          </div>
          <div>
            <p>${escape(entry.description)}</p>
            <div class="text-links">${renderLinks(entry.links)}</div>
          </div>
        </article>`).join('');

  const experience = page.cv.entries.map(([time, institution, role]) => `
        <li class="cv-row">
          <span class="cv-time">${escape(time)}</span>
          <div>
            <h3>${escape(institution)}</h3>
            <p>${escape(role)}</p>
          </div>
        </li>`).join('');

  return `${head(page)}
<body>
  <a class="skip" href="#overview">${escape(page.skip)}</a>
  <header class="masthead">
    <div class="shell masthead-inner">
      <a class="identity" href="${page.path}" aria-label="${escape(page.name)}">
        <span class="mark" aria-hidden="true">KW</span>
        <span class="wordmark">${escape(page.name)}</span>
      </a>
      <nav aria-label="${page.lang === 'en' ? 'Primary' : '主导航'}">
        ${renderLinks(page.navigation.map((label, index) => [label, '#' + anchors[index]]))}
      </nav>
      <a class="locale" href="${alternate.path}" lang="${alternate.lang}" hreflang="${alternate.lang}">${page.alternate}</a>
    </div>
  </header>

  <main id="overview" tabindex="-1">
    <section class="shell hero" aria-labelledby="profile-title">
      <div class="hero-copy">
        <p class="eyebrow location">${escape(page.role)}</p>
        <h1 id="profile-title">${page.nameParts.map(escape).join(' ')}</h1>
        <p class="secondary-name" lang="${alternate.lang}">${escape(page.secondaryName)}</p>
        <p class="headline">${escape(firstLine)} <em>${escape(secondLine)}</em></p>
        <p class="intro">${escape(page.intro)}</p>
        <div class="hero-actions">
          <a class="button" href="#work">${page.viewWork}</a>
          ${renderLinks([page.contact.links[0]])}
        </div>
      </div>
      <div class="hero-visual">
        <div class="plate">
          <img src="/assets/agent-systems-plate.webp" width="900" height="1125" alt="${escape(page.artAlt)}" fetchpriority="high">
        </div>
        <ul class="domains" aria-label="${page.lang === 'en' ? 'Areas of interest' : '关注方向'}">
          ${page.domains.map((domain) => `<li>${escape(domain)}</li>`).join('')}
        </ul>
      </div>
    </section>

    <section id="work" class="work" aria-labelledby="work-title">
      <div class="shell section-grid">
        <div class="section-heading">
          <p class="eyebrow">${escape(page.work.label)}</p>
          <h2 id="work-title">${escape(page.work.heading)}</h2>
        </div>
        <div class="work-list">${work}
        </div>
      </div>
    </section>

    <section id="cv" class="shell section-grid cv" aria-labelledby="cv-title">
      <div class="section-heading">
        <p class="eyebrow">${escape(page.cv.label)}</p>
        <h2 id="cv-title">${escape(page.cv.heading)}</h2>
        <button class="print" id="print-cv" type="button" hidden>${escape(page.cv.print)}</button>
      </div>
      <div class="cv-content">
        <ol class="cv-list">${experience}
        </ol>
        <article class="patent">
          <div class="patent-meta">
            <span class="eyebrow">${escape(page.patent.label)}</span>
            <span>${escape(page.patent.date)}</span>
          </div>
          <h3>${escape(page.patent.heading)}</h3>
          <p>${escape(page.patent.description)}</p>
          <div class="text-links">${renderLinks([[page.patent.number, page.patent.link]])}</div>
        </article>
      </div>
    </section>
  </main>

  <footer id="contact" aria-labelledby="contact-title">
    <div class="shell footer-content">
      <div>
        <p class="eyebrow">${escape(page.contact.label)}</p>
        <h2 id="contact-title">${escape(page.contact.heading)}</h2>
      </div>
      <div class="footer-links">${renderLinks(page.contact.links)}</div>
    </div>
    <div class="shell footer-signature"><span>${escape(page.name)}</span><span>michellewkx.com</span></div>
  </footer>
  <script defer src="/assets/site.js"></script>
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
  <p><a class="button" href="/">${escape(page.missing.back)}</a> <a href="/zh/" lang="zh-CN">返回中文首页</a></p>
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
