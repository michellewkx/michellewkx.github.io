# Kexin Wang · CV

The English and Chinese CV share content in `site/content.mjs`, a template in
`site/build.mjs`, and styles and artwork in `site/assets/`. To build and preview
locally with Node.js 18+ and Python 3:

```sh
node site/build.mjs
python3 -m http.server 4173 --directory dist
```

GitHub Actions publishes the generated `dist/` directory to GitHub Pages on
pushes to `master`. The previous Jekyll blog is available in the Git history at
`7bfe02d`. The inkpress demo is published by the separate inkpress repository.
